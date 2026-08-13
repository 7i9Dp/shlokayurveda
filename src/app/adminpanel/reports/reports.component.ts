import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AdminService, ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from '../../_services/admin.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['../adminpanel.shared.css', './reports.component.css']
})
export class ReportsComponent implements OnInit {

  loading = false;
  error = '';

  activeQuick: 'month' | 'year' | 'custom' = 'month';
  startDate = '';
  endDate = '';
  method = '';   // '', 'COD', 'Razorpay'
  status = '';   // '', 'Paid', 'COD', 'Failed', ...

  rows: any[] = [];

  constructor(private admin: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.setThisMonth();
    this.load();
  }

  setThisMonth(): void {
    const n = new Date();
    this.startDate = this.toIso(new Date(n.getFullYear(), n.getMonth(), 1));
    this.endDate = this.toIso(new Date(n.getFullYear(), n.getMonth() + 1, 0));
    this.activeQuick = 'month';
  }

  setThisYear(): void {
    const n = new Date();
    this.startDate = this.toIso(new Date(n.getFullYear(), 0, 1));
    this.endDate = this.toIso(new Date(n.getFullYear(), 11, 31));
    this.activeQuick = 'year';
  }

  onCustomChange(): void { this.activeQuick = 'custom'; }

  load(): void {
    if (!this.startDate || !this.endDate) { this.error = 'Please choose a start and end date.'; return; }
    if (this.endDate < this.startDate) { this.error = 'End date must be on or after the start date.'; return; }

    this.error = '';
    this.loading = true;
    this.admin.getReports(this.startDate, this.endDate, this.method, this.status).subscribe({
      next: (res) => {
        this.rows = (res && res.data) || [];
        this.loading = false;
      },
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
    this.error = 'Could not load the report. Please try again.';
  }

  exportExcel(): void {
    if (!this.rows.length) { return; }

    // Column order/labels for the sheet — only the currently loaded (filtered) rows.
    const data = this.rows.map(r => ({
      'Order ID': r.orderNumber,
      'Order Date': this.fmtDate(r.orderDate),
      'Customer': r.customerName,
      'Phone': r.customerPhone,
      'Email': r.customerEmail,
      'Product': r.productName,
      'Quantity': r.quantity,
      'Line Total': r.lineTotal,
      'Order Amount': r.orderAmount,
      'Payment Method': r.paymentMethod,
      'Payment Status': r.paymentStatus,
      'Order Status': r.orderStatus,
      'Returned Qty': r.returnedQuantity || 0,
      'Returned Amount': r.returnedAmount || 0,
      'Return Status': r.returnStatus || '',
      'Refund Status': r.refundStatus || ''
    }));

    const sheet = XLSX.utils.json_to_sheet(data);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Report');
    XLSX.writeFile(book, this.buildFileName());
  }

  private buildFileName(): string {
    if (this.activeQuick === 'month') {
      return `ShlokAyurveda_Report_${this.startDate.slice(0, 7)}.xlsx`;
    }
    if (this.activeQuick === 'year') {
      return `ShlokAyurveda_Report_${this.startDate.slice(0, 4)}.xlsx`;
    }
    return `ShlokAyurveda_Report_${this.startDate}_to_${this.endDate}.xlsx`;
  }

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
