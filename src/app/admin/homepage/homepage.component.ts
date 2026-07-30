import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/_services/cart.service';
import { ProductBookingService } from 'src/app/_services/productbooking.service';
import { CatalogItem, Category, Review, SiteDataService } from 'src/app/_services/site-data.service';
import Swal from 'sweetalert2';

export interface contactusModel {
  name: any;
  phone: any;
  email: any;
  address: any;
  concern: any;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy {

  /** Catalog (all from assets/data/site-data.json). */
  data: CatalogItem[] = [];
  kits: CatalogItem[] = [];
  categories: Category[] = [];
  certifications: { title: string; image: string }[] = [];
  banners: { image: string; alt: string }[] = [];
  advantages: { title: string; text: string } = { title: '', text: '' };
  contact = { phones: [] as string[], whatsapp: '', email: '', address: '' };

  reviews: Review[] = [];
  expandedReviews = new Set<number>();

  submitted: boolean = false;
  submitbtnc: boolean = false;
  contactForm: FormGroup;
  contactus: contactusModel;

  @ViewChild('reviewViewport') reviewViewport?: ElementRef<HTMLDivElement>;
  private reviewTimer: any;
  private reviewsPaused = false;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private ProductBookingService: ProductBookingService,
    private siteData: SiteDataService,
    private cart: CartService,
    private router: Router,
    private zone: NgZone
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', Validators.required],
      address: ['', Validators.required],
      concern: ['', Validators.required],
    });

    this.contactus = { name: '', phone: '', email: '', address: '', concern: '' };
  }

  ngOnInit(): void {
    this.subs.add(this.siteData.getData().subscribe(site => {
      this.data = site.products;
      this.kits = site.kits;
      this.categories = site.categories;
      this.certifications = site.certifications;
      this.banners = site.banners;
      this.advantages = site.advantages;
      this.contact = site.contact;
      this.reviews = site.reviews;
    }));
  }

  ngAfterViewInit(): void {
    this.startReviewAutoScroll();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.stopReviewAutoScroll();
  }

  /** Buy Now opens the full product page — the order form lives there now. */
  goToProduct(product: CatalogItem): void {
    this.router.navigate(['/admin/product-details', product.id]);
  }

  addToCart(product: CatalogItem): void {
    this.cart.add(product, 1);
  }

  isInCart(product: CatalogItem): boolean {
    return this.cart.has(product.id);
  }

  // ----------------------------------------------------------------- reviews

  /** Fixed five slots so stars line up across every card. */
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

  pauseReviews(): void {
    this.reviewsPaused = true;
  }

  resumeReviews(): void {
    this.reviewsPaused = false;
  }

  /**
   * Steps the review strip one card at a time and wraps back to the start,
   * so every review in the JSON gets shown, not just the first few.
   * Runs outside Angular — a scroll tick must not trigger change detection.
   */
  private startReviewAutoScroll(): void {
    this.zone.runOutsideAngular(() => {
      this.reviewTimer = setInterval(() => {
        const viewport = this.reviewViewport?.nativeElement;
        if (!viewport || this.reviewsPaused) { return; }

        const card = viewport.querySelector('.review-card') as HTMLElement | null;
        if (!card) { return; }

        const step = card.offsetWidth + 16;
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        const next = viewport.scrollLeft + step;

        viewport.scrollTo({
          left: next >= maxScroll - 4 ? 0 : next,
          behavior: 'smooth'
        });
      }, 3500);
    });
  }

  private stopReviewAutoScroll(): void {
    if (this.reviewTimer) {
      clearInterval(this.reviewTimer);
      this.reviewTimer = null;
    }
  }

  nudgeReviews(direction: -1 | 1): void {
    const viewport = this.reviewViewport?.nativeElement;
    if (!viewport) { return; }
    const card = viewport.querySelector('.review-card') as HTMLElement | null;
    const step = (card ? card.offsetWidth : viewport.clientWidth) + 16;
    viewport.scrollBy({ left: step * direction, behavior: 'smooth' });
  }

  // -------------------------------------------------------------- contact us

  get f() { return this.contactForm.controls; }

  onSubmitContactUs(): void {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    } else {
      this.submitbtnc = true;
      this.contactus.name = this.contactForm.value.name;
      this.contactus.phone = this.contactForm.value.phone;
      this.contactus.email = this.contactForm.value.email;
      this.contactus.address = this.contactForm.value.address;
      this.contactus.concern = this.contactForm.value.concern;
      this.ProductBookingService.insertContactUSDetails(this.contactus).subscribe(
        res => {
          if (res.isSuccess) {
            Swal.fire(
              'Thank you for reaching out!',
              'Your request has been submitted successfully. Our team will get in touch within 24 hours. Stay tuned!',
              'success'
            );
            this.resetContact();
          } else {
            Swal.fire('Error', res.returnMessage, 'error');
          }
        },
        err => {
          Swal.fire('Error', err.error.message, 'error');
        }
      );
    }
  }

  resetContact() {
    this.submitted = false;
    this.submitbtnc = false;
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      concern: ['', Validators.required],
    });
  }
}
