import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CreateOrderRequest, PaymentMethod } from 'src/app/_interface/payment';
import { brandAlert, orderSuccessAlert } from 'src/app/_shared/alert';
import { CheckoutOutcome, CheckoutService } from 'src/app/_services/checkout.service';
import { CatalogItem, Review, SiteDataService } from 'src/app/_services/site-data.service';
import { environment } from 'src/environments/environment';

/** While online payment is switched off, COD is the only method the form can hold. */
const DEFAULT_PAYMENT_METHOD: PaymentMethod = environment.paymentEnabled ? 'Razorpay' : 'COD';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  product: any;
  /** onSubmit() reads this — kept so the order payload is built exactly as before. */
  selectedProduct: any;

  gallery: string[] = [];
  activeImage = 0;

  // ---------------------------------------------------------- zoom lens
  zoomActive = false;
  lensX = 0;
  lensY = 0;
  /** The lens holds an oversized copy of the same <img>, shifted into place —
   *  object-fit: cover on both copies keeps the crop identical at any zoom level. */
  lensImgWidth = 0;
  lensImgHeight = 0;
  lensImgLeft = 0;
  lensImgTop = 0;
  private readonly lensSize = 160;
  private readonly zoomFactor = 2.5;

  private allCertifications: { title: string; image: string }[] = [];
  reviews: Review[] = [];
  expandedReviews = new Set<number>();

  userForm: FormGroup;
  submitted: boolean = false;
  submitbtn: boolean = false;
  quantity: any = 1;

  /** Online payment is off for now, so the template hides the picker and COD is the only option. */
  paymentEnabled = environment.paymentEnabled;

  @ViewChild('orderForm') orderForm?: ElementRef<HTMLElement>;

  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private checkout: CheckoutService,
    private siteData: SiteDataService
  ) {

    this.userForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', Validators.required],
      paymentMethod: [DEFAULT_PAYMENT_METHOD, Validators.required],
    });
  }

  ngOnInit(): void {
    // The catalog lives in assets/data/site-data.json (single source of truth).
    this.subs.add(this.route.params.subscribe((params: Params) => {
      const id = Number(params['id']);

      this.subs.add(this.siteData.getById(id).subscribe(item => {
        this.product = item;
        this.selectedProduct = item;
        this.gallery = this.buildGallery(item);
        this.activeImage = 0;
        window.scrollTo({ top: 0, behavior: 'auto' });
      }));

      // Only reviews written about this item (topped up with brand-level ones).
      this.subs.add(this.siteData.getReviewsForProduct(id).subscribe(list => {
        this.reviews = list;
        this.expandedReviews.clear();
      }));
    }));

    this.subs.add(this.siteData.getData().subscribe(site => {
      this.allCertifications = site.certifications;
    }));
  }

  /** Some products (e.g. capsules without an FSSAI listing) opt out of specific badges via hideCertifications. */
  get certifications(): { title: string; image: string }[] {
    const hidden: string[] = this.product?.hideCertifications || [];
    return this.allCertifications.filter(c => !hidden.includes(c.title));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** The extra shots are often the same image — only show ones that actually differ. */
  private buildGallery(item?: CatalogItem): string[] {
    if (!item) { return []; }
    const images = [item.imagePath, item.imagePath2, item.imagePath3].filter(Boolean) as string[];
    return images.filter((src, i) => images.indexOf(src) === i);
  }

  selectImage(index: number): void {
    this.activeImage = index;
  }

  // ---------------------------------------------------------- zoom lens

  /** Classic lens-follows-cursor magnifier: the lens shows the same image, scaled up and offset. */
  private updateLens(event: MouseEvent, stage: HTMLElement): void {
    const rect = stage.getBoundingClientRect();
    const half = this.lensSize / 2;

    const x = Math.min(Math.max(event.clientX - rect.left, half), rect.width - half);
    const y = Math.min(Math.max(event.clientY - rect.top, half), rect.height - half);

    this.lensX = x - half;
    this.lensY = y - half;
    this.lensImgWidth = rect.width * this.zoomFactor;
    this.lensImgHeight = rect.height * this.zoomFactor;
    this.lensImgLeft = -(x * this.zoomFactor - half);
    this.lensImgTop = -(y * this.zoomFactor - half);
  }

  onStageMouseMove(event: MouseEvent, stage: HTMLElement): void {
    this.updateLens(event, stage);
  }

  /**
   * Positioned immediately on entry (not just on the next mousemove) — a cursor
   * that lands on the image without an in-between move event otherwise left the
   * lens at its stale default position and size for its first frame, which read
   * as a blank/plain-white circle.
   */
  onStageEnter(event: MouseEvent, stage: HTMLElement): void {
    this.updateLens(event, stage);
    this.zoomActive = true;
  }

  onStageLeave(): void {
    this.zoomActive = false;
  }

  /** "Relieves Gas, Acidity & Constipation" -> chips, mirroring the reference layout. */
  get benefits(): string[] {
    const source = this.product?.careFor || '';
    return source.split(/,|&/).map((s: string) => s.trim()).filter(Boolean);
  }

  /** Kits store their conditions tab-separated. */
  get conditions(): string[] {
    const source = this.product?.usefor || '';
    return source.split(/\t|,/).map((s: string) => s.trim()).filter(Boolean);
  }

  private static readonly CONDITION_META: Record<string, { icon: string; tone: string }> = {
    'GAS': { icon: 'fa-wind', tone: 'sky' },
    'ACIDITY': { icon: 'fa-fire', tone: 'amber' },
    'CONSTIPATION': { icon: 'fa-toilet', tone: 'teal' },
    'PILES': { icon: 'fa-band-aid', tone: 'rose' },
    'FISSURE': { icon: 'fa-notes-medical', tone: 'violet' },
    'FISTULA': { icon: 'fa-stethoscope', tone: 'indigo' },
    'ERECTILE DYSFUNCTION MEN PROBLEMS': { icon: 'fa-bolt', tone: 'gold' },
  };

  /** Distinct icon + colour per condition so the tags read at a glance instead of blurring together. */
  conditionMeta(condition: string): { icon: string; tone: string } {
    return ProductDetailsComponent.CONDITION_META[condition.toUpperCase()] || { icon: 'fa-leaf', tone: 'green' };
  }

  /** How many of the shown reviews are actually about this item. */
  get ownReviewCount(): number {
    const id = Number(this.product?.id);
    return this.reviews.filter(r => (r.productIds || []).includes(id)).length;
  }

  starStates(rating: number): boolean[] {
    const rounded = Math.round(rating || 0);
    return [1, 2, 3, 4, 5].map(i => i <= rounded);
  }

  toggleReview(index: number): void {
    this.expandedReviews.has(index)
      ? this.expandedReviews.delete(index)
      : this.expandedReviews.add(index);
  }

  isReviewExpanded(index: number): boolean {
    return this.expandedReviews.has(index);
  }

  // ------------------------------------------------------------------ order

  get uf() { return this.userForm.controls; }

  get total(): number {
    const qty = Number(this.userForm.value.quantity) || 1;
    return qty * Number(this.product?.price || 0);
  }

  changeQuantity(delta: number): void {
    const current = Number(this.userForm.value.quantity) || 1;
    const next = Math.min(10, Math.max(1, current + delta));
    this.userForm.get('quantity')?.setValue(next);
    this.quantity = next;
  }

  updateQuantity(event: any): void {
    this.quantity = event.target.value;
  }

  /** Buy Now no longer opens a modal — it reveals the order form on this page. */
  scrollToOrder(): void {
    this.orderForm?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  get paymentMethod(): PaymentMethod {
    return this.userForm.value.paymentMethod;
  }

  /**
   * Buying straight from the product page goes through the same CheckoutService
   * the cart uses — one item instead of several, but the same order, the same
   * payment window and the same server-side signature check.
   */
  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (this.userForm.invalid || !this.selectedProduct) {
      return;
    }

    this.submitbtn = true;
    const form = this.userForm.value;
    const isKit = !!this.selectedProduct.IsKit;

    const request: CreateOrderRequest = {
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      address: form.address,
      pincode: form.pincode,
      paymentMethod: form.paymentMethod,
      items: [{
        productId: Number(this.selectedProduct.id),
        productName: this.selectedProduct.productName,
        pack: this.selectedProduct.pack || '',
        duration: isKit && this.selectedProduct.duration ? this.selectedProduct.duration : '',
        isKit,
        unitPrice: Number(this.selectedProduct.price),
        quantity: Number(form.quantity),
        includeItems: isKit && Array.isArray(this.selectedProduct.Include)
          ? this.selectedProduct.Include.join(', ')
          : ''
      }]
    };

    const outcome = await this.checkout.checkout(request);

    this.submitbtn = false;
    this.handleOutcome(outcome);
  }

  private handleOutcome(outcome: CheckoutOutcome): void {
    switch (outcome.status) {
      case 'paid':
      case 'placed':
        // "Continue Shopping" should actually continue shopping — send them home.
        orderSuccessAlert({ orderNumber: outcome.orderNumber, paymentMethod: this.paymentMethod })
          .then(() => this.goHome());
        this.resetForm();
        break;

      case 'unconfirmed':
        // Money has left the customer's account — this must not read as a failure.
        brandAlert('Payment received', outcome.message, 'info').then(() => this.goHome());
        this.resetForm();
        break;

      case 'cancelled':
        brandAlert('Payment cancelled', 'Your details are still here whenever you are ready.', 'info');
        break;

      case 'failed':
        brandAlert('', outcome.message, 'error');
        break;
    }
  }

  private goHome(): void {
    this.router.navigate(['/admin']);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  resetForm(): void {
    this.submitted = false;
    this.submitbtn = false;
    this.userForm.reset({ quantity: 1, paymentMethod: DEFAULT_PAYMENT_METHOD });
    this.quantity = 1;
  }
}
