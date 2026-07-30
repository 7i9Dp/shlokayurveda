import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

export interface CatalogItem {
  id: number;
  productName: string;
  shortName?: string;
  category?: string;
  imagePath: string;
  imagePath2?: string;
  pack?: string;
  price: string;
  oldPrice?: string | null;
  careFor?: string;
  usefor?: string;
  duration?: string;
  Include?: string[];
  rating?: number;
  users?: string;
  IsKit: boolean;
}

export interface Category {
  key: string;
  name: string;
  image: string;
  kitIds: number[];
  productIds: number[];
}

export type ReviewLang = 'en' | 'hi' | 'gu';

export interface Review {
  name: string;
  rating: number;
  date: string;
  review: string;
  /** Language the review is written in — each review is single-language. */
  lang: ReviewLang;
  /** Which catalog items this review is about. Empty = brand-level feedback. */
  productIds: number[];
}

export interface SiteData {
  brand: { name: string; tagline: string; logo: string };
  contact: { phones: string[]; whatsapp: string; email: string; address: string };
  certifications: { title: string; image: string }[];
  banners: { image: string; alt: string }[];
  categories: Category[];
  kits: CatalogItem[];
  products: CatalogItem[];
  advantages: { title: string; text: string };
  reviews: Review[];
}

/**
 * Single source of truth for the storefront. Everything the site renders
 * (kits, products, categories, reviews, banners, contact details) comes from
 * assets/data/site-data.json so a content change never means a code change.
 */
@Injectable({ providedIn: 'root' })
export class SiteDataService {

  private readonly data$: Observable<SiteData>;

  constructor(private http: HttpClient) {
    this.data$ = this.http
      .get<SiteData>('assets/data/site-data.json')
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));
  }

  getData(): Observable<SiteData> {
    return this.data$;
  }

  getProducts(): Observable<CatalogItem[]> {
    return this.data$.pipe(map(d => d.products));
  }

  getKits(): Observable<CatalogItem[]> {
    return this.data$.pipe(map(d => d.kits));
  }

  getReviews(): Observable<Review[]> {
    return this.data$.pipe(map(d => d.reviews));
  }

  /**
   * Reviews written about one specific item, newest-looking first. Brand-level
   * reviews (delivery, packaging, service) are appended only to top up a thin
   * list, so a product page never looks empty but always leads with its own.
   */
  getReviewsForProduct(id: number, minimum = 6): Observable<Review[]> {
    return this.data$.pipe(map(d => {
      const own = d.reviews.filter(r => (r.productIds || []).includes(Number(id)));
      if (own.length >= minimum) { return own; }
      const brand = d.reviews.filter(r => !(r.productIds || []).length);
      return [...own, ...brand.slice(0, minimum - own.length)];
    }));
  }

  getCategories(): Observable<Category[]> {
    return this.data$.pipe(map(d => d.categories));
  }

  /** Kits + products in one list — used by search and by product-details lookups. */
  getCatalog(): Observable<CatalogItem[]> {
    return this.data$.pipe(map(d => [...d.kits, ...d.products]));
  }

  getById(id: number): Observable<CatalogItem | undefined> {
    return this.getCatalog().pipe(map(items => items.find(i => Number(i.id) === Number(id))));
  }

  /** Kits belonging to a category, in menu order. */
  getKitsByCategory(key: string): Observable<CatalogItem[]> {
    return this.data$.pipe(map(d => d.kits.filter(k => k.category === key)));
  }

  /** Case-insensitive match over name, pack, category and "care for" text. */
  search(term: string): Observable<CatalogItem[]> {
    const q = (term || '').trim().toLowerCase();
    return this.getCatalog().pipe(
      map(items => {
        if (!q) { return []; }
        return items.filter(i =>
          [i.productName, i.shortName, i.pack, i.careFor, i.usefor, i.category]
            .filter(Boolean)
            .some(field => String(field).toLowerCase().includes(q))
        );
      })
    );
  }
}
