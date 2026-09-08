import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from '../../_services/admin.service';

// One editable row in the Returns modal — mirrors an order item plus the qty/amount the
// admin wants to mark returned.
interface ReturnRow {
  orderItemId: number;
  productName: string;
  quantity: number;        // ordered
  unitPrice: number;
  lineTotal: number;
  origReturnedQty: number; // what was already returned (to know if we must send an undo)
  returnQty: number;       // editable
  returnAmount: number;    // editable (auto = unitPrice * returnQty)
}

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['../adminpanel.shared.css', './returns.component.css']
})
export class ReturnsComponent implements OnInit {

  loading = false;
  error = '';
  notice = '';

  startDate = '';
  endDate = '';

  orders: any[] = [];
  returns: any[] = [];

  // Client-side filters for the Orders table (applied over the already-loaded range).
  orderSearch = '';
  orderMethod = '';   // '' = all, 'COD', 'Razorpay'

  // Return modal
  modalOpen = false;
  loadingOrder = false;
  selectedOrder: any = null;
  rows: ReturnRow[] = [];
  refundStatus = 'Refunded';
  reason = '';
  saving = false;
  saveError = '';
  confirming = false;

  constructor(private admin: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.setThisMonth();
    this.loadAll();
  }

  setThisMonth(): void {
    const n = new Date();
    this.startDate = this.toIso(new Date(n.getFullYear(), n.getMonth(), 1));
    this.endDate = this.toIso(new Date(n.getFullYear(), n.getMonth() + 1, 0));
  }

  loadAll(): void {
    if (!this.startDate || !this.endDate) { this.error = 'Please choose a start and end date.'; return; }
    if (this.endDate < this.startDate) { this.error = 'End date must be on or after the start date.'; return; }

    this.error = '';
    this.loading = true;

    this.admin.getOrders(this.startDate, this.endDate).subscribe({
      next: (res) => { this.orders = (res && res.data) || []; this.loading = false; },
      error: (e) => this.handleError(e)
    });

    this.admin.getReturns(this.startDate, this.endDate).subscribe({
      next: (res) => { this.returns = (res && res.data) || []; },
      error: (e) => this.handleError(e)
    });
  }

  private handleError(e: any): void {
    this.loading = false;
    if (e && e.status === 401) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      this.router.navigate(['/login']);
      return;
    }
    this.error = 'Could not load data. Please try again.';
  }

  // Recorded returns grouped by order — one entry per order with its returned product
  // lines nested under it (OrderItems link to the order via OrderId).
  get groupedReturns(): any[] {
    const map = new Map<string, any>();
    for (const r of this.returns) {
      const key = r.orderNumber || ('#' + r.orderId);
      let g = map.get(key);
      if (!g) {
        g = { orderNumber: r.orderNumber, orderId: r.orderId, returnedOn: r.returnedOn, totalAmount: 0, refunds: new Set<string>(), items: [] };
        map.set(key, g);
      }
      g.items.push(r);
      g.totalAmount += (r.returnedAmount || 0);
      if (r.refundStatus) { g.refunds.add(r.refundStatus); }
      if (r.returnedOn && (!g.returnedOn || r.returnedOn > g.returnedOn)) { g.returnedOn = r.returnedOn; }
    }
    return Array.from(map.values()).map(g => ({
      ...g,
      refundLabel: g.refunds.size === 0 ? '—' : (g.refunds.size === 1 ? Array.from(g.refunds)[0] : 'Mixed')
    }));
  }

  // Orders filtered by the search box (order id / customer / amount) and payment method.
  get filteredOrders(): any[] {
    const term = (this.orderSearch || '').trim().toLowerCase();
    return this.orders.filter(o => {
      if (this.orderMethod && o.paymentMethod !== this.orderMethod) { return false; }
      if (!term) { return true; }
      const hay = [
        o.orderNumber,
        o.customerName,
        o.amount != null ? ('' + o.amount) : ''
      ].join(' ').toLowerCase();
      return hay.includes(term);
    });
  }

  clearOrderFilters(): void {
    this.orderSearch = '';
    this.orderMethod = '';
  }

  // ---------------------------------------------------------------- modal
  openReturn(order: any): void {
    this.modalOpen = true;
    this.selectedOrder = null;
    this.rows = [];
    this.saveError = '';
    this.confirming = false;
    this.refundStatus = 'Refunded';
    this.reason = '';
    this.loadingOrder = true;

    this.admin.getOrder(order.id).subscribe({
      next: (res) => {
        this.selectedOrder = (res && res.data) || null;
        this.loadingOrder = false;
        if (this.selectedOrder) {
          this.rows = (this.selectedOrder.items || []).map((it: any) => ({
            orderItemId: it.id,
            productName: it.productName,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            lineTotal: it.lineTotal,
            origReturnedQty: it.returnedQuantity || 0,
            returnQty: it.returnedQuantity || 0,
            returnAmount: it.returnedAmount || 0
          }));
        }
      },
      error: (e) => {
        this.loadingOrder = false;
        this.saveError = 'Could not load the order.';
        if (e && e.status === 401) { this.handleError(e); }
      }
    });
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedOrder = null;
    this.rows = [];
    this.confirming = false;
  }

  /** Return every product in full. */
  returnAll(): void {
    this.rows.forEach(r => {
      r.returnQty = r.quantity;
      r.returnAmount = r.lineTotal;
    });
  }

  /** Clear all return quantities/amounts (undo). */
  clearAll(): void {
    this.rows.forEach(r => { r.returnQty = 0; r.returnAmount = 0; });
  }

  /** +/- stepper for the return quantity. */
  stepQty(r: ReturnRow, delta: number): void {
    r.returnQty = (Number(r.returnQty) || 0) + delta;
    this.onQtyChange(r);
  }

  /** Keep qty within 0..ordered and auto-fill the amount from unit price. */
  onQtyChange(r: ReturnRow): void {
    if (r.returnQty == null || r.returnQty < 0) { r.returnQty = 0; }
    if (r.returnQty > r.quantity) { r.returnQty = r.quantity; }
    r.returnAmount = +(r.unitPrice * r.returnQty).toFixed(2);
  }

  get totalReturnAmount(): number {
    return this.rows.reduce((sum, r) => sum + (r.returnQty > 0 ? (r.returnAmount || 0) : 0), 0);
  }

  get selectedCount(): number {
    return this.rows.filter(r => r.returnQty > 0).length;
  }

  askConfirm(): void {
    this.saveError = '';
    // Anything to send? A row counts if it has a return now, or previously had one we'd clear.
    const toSend = this.rows.filter(r => r.returnQty > 0 || r.origReturnedQty > 0);
    if (toSend.length === 0) {
      this.saveError = 'Enter a return quantity for at least one product.';
      return;
    }
    if (this.rows.some(r => r.returnAmount < 0)) {
      this.saveError = 'Amounts cannot be negative.';
      return;
    }
    this.confirming = true;
  }

  cancelConfirm(): void { this.confirming = false; }

  submit(): void {
    if (!this.selectedOrder) { return; }
    this.saving = true;
    this.saveError = '';

    const items = this.rows
      .filter(r => r.returnQty > 0 || r.origReturnedQty > 0)
      .map(r => ({
        orderItemId: r.orderItemId,
        returnedQuantity: r.returnQty,
        returnedAmount: r.returnQty > 0 ? r.returnAmount : 0
      }));

    const payload = {
      orderId: this.selectedOrder.id,
      refundStatus: this.refundStatus,
      reason: this.reason,
      items
    };

    this.admin.createReturn(payload).subscribe({
      next: (res) => {
        this.saving = false;
        if (res && res.isSuccess) {
          this.closeModal();
          this.notice = res.returnMessage || 'Return recorded.';
          this.loadAll();
          setTimeout(() => this.notice = '', 4000);
        } else {
          this.saveError = (res && res.returnMessage) || 'Could not record the return.';
          this.confirming = false;
        }
      },
      error: (e) => {
        this.saving = false;
        this.confirming = false;
        this.saveError = 'Could not record the return. Please try again.';
        if (e && e.status === 401) { this.handleError(e); }
      }
    });
  }

  // ----------------------------------------------------------- formatting
  fmtCur(n: number): string {
    return '₹' + (n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  fmtDate(d: string): string {
    if (!d) { return ''; }
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private toIso(d: Date): string {
    const y = d.getFullYear();
    const m = ('' + (d.getMonth() + 1)).padStart(2, '0');
    const day = ('' + d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
