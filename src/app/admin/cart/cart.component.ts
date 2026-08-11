import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CreateOrderRequest, OrderItemRequest, PaymentMethod } from 'src/app/_interface/payment';
import { brandAlert, orderSuccessAlert } from 'src/app/_shared/alert';
import { CartLine, CartService } from 'src/app/_services/cart.service';
import { CheckoutOutcome, CheckoutService } from 'src/app/_services/checkout.service';
import { SiteDataService } from 'src/app/_services/site-data.service';
import { environment } from 'src/environments/environment';

/** While online payment is switched off, COD is the only method the form can hold. */
const DEFAULT_PAYMENT_METHOD: PaymentMethod = environment.paymentEnabled ? 'Razorpay' : 'COD';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  lines: CartLine[] = [];
  userForm: FormGroup;
  submitted = false;
  submitbtn = false;

  /** Online payment is off for now, so the template hides the picker and COD is the only option. */
  paymentEnabled = environment.paymentEnabled;

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private cart: CartService,
    private router: Router,
    private checkout: CheckoutService,
    private siteData: SiteDataService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', Validators.required],
      paymentMethod: [DEFAULT_PAYMENT_METHOD, Validators.required],
    });
  }

  ngOnInit(): void {
    this.subs.add(this.cart.items.subscribe(lines => this.lines = lines));

    // A cart can sit in localStorage for weeks, so re-price it against the live
    // catalog before the customer commits — the API refuses stale prices rather
    // than charging an amount the cart never showed.
    this.subs.add(this.siteData.getCatalog().subscribe(catalog => {
      const { repriced, removed } = this.cart.syncWithCatalog(catalog);

      if (removed.length) {
        brandAlert(
          'Cart updated',
          `${removed.join(', ')} ${removed.length > 1 ? 'are' : 'is'} no longer available, so we removed ${removed.length > 1 ? 'them' : 'it'} from your cart.`,
          'info'
        );
      } else if (repriced) {
        brandAlert(
          'Cart updated',
          'Some prices have changed since these items were added. Your cart now shows the current prices.',
          'info'
        );
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get uf() { return this.userForm.controls; }

  get subtotal(): number {
    return this.cart.subtotal;
  }

  get savings(): number {
    return this.lines.reduce(
      (sum, l) => sum + (l.oldPrice ? (l.oldPrice - l.price) * l.quantity : 0), 0
    );
  }

  get paymentMethod(): PaymentMethod {
    return this.userForm.value.paymentMethod;
  }

  changeQuantity(line: CartLine, delta: number): void {
    this.cart.changeQuantity(line.id, delta);
  }

  setQuantity(line: CartLine, event: any): void {
    this.cart.setQuantity(line.id, event.target.value);
  }

  remove(line: CartLine): void {
    this.cart.remove(line.id);
  }

  continueShopping(): void {
    this.router.navigate(['/admin']);
  }

  /**
   * One order for the whole cart. CheckoutService handles the difference between
   * COD and paying online — from here it is the same call either way.
   */
  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (this.userForm.invalid || !this.lines.length) {
      return;
    }

    this.submitbtn = true;
    const buyer = this.userForm.value;

    const request: CreateOrderRequest = {
      customerName: buyer.name,
      customerEmail: buyer.email,
      customerPhone: buyer.phone,
      address: buyer.address,
      pincode: buyer.pincode,
      paymentMethod: buyer.paymentMethod,
      items: this.lines.map(line => this.toOrderItem(line))
    };

    const outcome = await this.checkout.checkout(request);

    this.submitbtn = false;
    this.handleOutcome(outcome);
  }

  private toOrderItem(line: CartLine): OrderItemRequest {
    return {
      productId: line.id,
      productName: line.productName,
      pack: line.pack || '',
      duration: line.IsKit && line.duration ? line.duration : '',
      isKit: line.IsKit,
      unitPrice: line.price,
      quantity: line.quantity,
      includeItems: line.IsKit && line.Include?.length ? line.Include.join(', ') : ''
    };
  }

  private handleOutcome(outcome: CheckoutOutcome): void {
    switch (outcome.status) {
      case 'paid':
      case 'placed':
        // "Continue Shopping" should actually continue shopping — send them home.
        orderSuccessAlert({ orderNumber: outcome.orderNumber, paymentMethod: this.paymentMethod })
          .then(() => this.continueShopping());
        this.resetAfterOrder();
        break;

      case 'unconfirmed':
        // Money has left the customer's account — this must not read as a failure.
        brandAlert('Payment received', outcome.message, 'info').then(() => this.continueShopping());
        this.resetAfterOrder();
        break;

      case 'cancelled':
        brandAlert('Payment cancelled', 'Your cart is still here whenever you are ready.', 'info');
        break;

      case 'failed':
        brandAlert('', outcome.message, 'error');
        break;
    }
  }

  private resetAfterOrder(): void {
    this.cart.clear();
    this.submitted = false;
    this.userForm.reset({ paymentMethod: DEFAULT_PAYMENT_METHOD });
  }
}
