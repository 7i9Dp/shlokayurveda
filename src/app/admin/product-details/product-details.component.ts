import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductModel } from 'src/app/_interface/product';
import { ProductBookingService } from 'src/app/_services/productbooking.service';
import { CatalogItem, Review, SiteDataService } from 'src/app/_services/site-data.service';
import Swal from 'sweetalert2';

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

  certifications: { title: string; image: string }[] = [];
  reviews: Review[] = [];
  expandedReviews = new Set<number>();

  userForm: FormGroup;
  submitted: boolean = false;
  submitbtn: boolean = false;
  products: ProductModel;
  ID: any;
  quantity: any = 1;

  @ViewChild('orderForm') orderForm?: ElementRef<HTMLElement>;

  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ProductBookingService: ProductBookingService,
    private siteData: SiteDataService
  ) {

    this.userForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', Validators.required],
    });

    this.products = {
      id: 0,
      productid: 0,
      productname: '',
      pack: '',
      quantity: 0,
      email: '',
      phone: '',
      name: '',
      address: '',
      pincode: '',
      include: '',
      price: 0,
      oldPrice: 0,
      usefor: '',
      duration: '',
      total: 0,
      IsKit: false
    };
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
      this.certifications = site.certifications;
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** imagePath2 is often the same shot — only show it when it actually differs. */
  private buildGallery(item?: CatalogItem): string[] {
    if (!item) { return []; }
    const images = [item.imagePath, item.imagePath2].filter(Boolean) as string[];
    return images.filter((src, i) => images.indexOf(src) === i);
  }

  selectImage(index: number): void {
    this.activeImage = index;
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

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    else {
      this.submitbtn = true;
      this.products.id = this.ID || 0;
      this.products.productid = this.selectedProduct.id;
      this.products.productname = this.selectedProduct.productName;

      // pack + IsKit go on every order — the home page modal always sent them
      // for plain products, and that path now runs through this form.
      this.products.IsKit = this.selectedProduct.IsKit;
      if (this.selectedProduct.pack) {
        this.products.pack = this.selectedProduct.pack;
      }

      if (this.selectedProduct.IsKit) {
        if (this.selectedProduct.duration) {
          this.products.duration = this.selectedProduct.duration;
        }
        if (this.selectedProduct.usefor) {
          this.products.usefor = this.selectedProduct.usefor;
        }
        if (this.selectedProduct.Include && Array.isArray(this.selectedProduct.Include)) {
          const include = this.selectedProduct.Include.join(', ');
          this.products.include = include;
        }
      }
      this.products.quantity = this.userForm.value.quantity;
      this.products.email = this.userForm.value.email;
      this.products.phone = this.userForm.value.phone;
      this.products.name = this.userForm.value.name;
      this.products.address = this.userForm.value.address;
      this.products.pincode = this.userForm.value.pincode;
      this.products.price = this.selectedProduct.price;
      this.products.total = Number(this.userForm.value.quantity) * Number(this.selectedProduct.price);

      this.ProductBookingService.insertProduct(this.products).subscribe(
        res => {
          if (res.isSuccess) {
            Swal.fire('', res.returnMessage, 'success');
          }
          else {
            Swal.fire('', res.returnMessage, 'error');
          }
          this.resetForm();
        },
        err => {
          Swal.fire('', err.error.message, 'error');
        }
      );
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.submitbtn = false;
    this.userForm.reset();
    this.quantity = 1;
    this.userForm.get('quantity')?.setValue(1);
  }
}
