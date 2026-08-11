import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CatalogItem } from './site-data.service';

export interface CartLine {
  id: number;
  productName: string;
  imagePath: string;
  /** Pack size for products, course length for kits — whichever the item has. */
  variant: string;
  price: number;
  oldPrice: number | null;
  quantity: number;
  IsKit: boolean;
  /** Kept so checkout can build the exact same order payload as before. */
  pack?: string;
  duration?: string;
  usefor?: string;
  Include?: string[];
}

const STORAGE_KEY = 'sa_cart';
const MAX_QTY = 10;

/**
 * Client-side cart backed by localStorage. No API involved yet — checkout still
 * posts through the existing order endpoint, one call per line.
 */
@Injectable({ providedIn: 'root' })
export class CartService {

  private lines$ = new BehaviorSubject<CartLine[]>(this.read());

  /** Stream of cart lines — header badge and cart page both subscribe to this. */
  get items(): Observable<CartLine[]> {
    return this.lines$.asObservable();
  }

  get snapshot(): CartLine[] {
    return this.lines$.value;
  }

  get count(): number {
    return this.lines$.value.reduce((sum, line) => sum + line.quantity, 0);
  }

  get subtotal(): number {
    return this.lines$.value.reduce((sum, line) => sum + line.price * line.quantity, 0);
  }

  /** Adds an item, or bumps the quantity if it is already in the cart. */
  add(item: CatalogItem, quantity = 1): void {
    const lines = [...this.lines$.value];
    const existing = lines.find(l => l.id === Number(item.id));

    if (existing) {
      existing.quantity = Math.min(MAX_QTY, existing.quantity + quantity);
    } else {
      lines.push({
        id: Number(item.id),
        productName: item.productName,
        imagePath: item.imagePath,
        variant: item.duration || item.pack || '',
        price: Number(item.price),
        oldPrice: item.oldPrice ? Number(item.oldPrice) : null,
        quantity: Math.min(MAX_QTY, Math.max(1, quantity)),
        IsKit: !!item.IsKit,
        pack: item.pack,
        duration: item.duration,
        usefor: item.usefor,
        Include: item.Include
      });
    }

    this.commit(lines);
  }

  setQuantity(id: number, quantity: number): void {
    const lines = this.lines$.value.map(line =>
      line.id === id
        ? { ...line, quantity: Math.min(MAX_QTY, Math.max(1, Number(quantity) || 1)) }
        : line
    );
    this.commit(lines);
  }

  changeQuantity(id: number, delta: number): void {
    const line = this.lines$.value.find(l => l.id === id);
    if (line) { this.setQuantity(id, line.quantity + delta); }
  }

  remove(id: number): void {
    this.commit(this.lines$.value.filter(line => line.id !== id));
  }

  clear(): void {
    this.commit([]);
  }

  has(id: number): boolean {
    return this.lines$.value.some(line => line.id === Number(id));
  }

  /**
   * Brings stored lines back in line with the live catalog. Carts sit in
   * localStorage for as long as the browser keeps them, so a price change would
   * otherwise reach checkout as a stale amount — and the API rejects those rather
   * than quietly charging something the cart never displayed. Items that have left
   * the catalog are dropped for the same reason.
   *
   * Returns what changed so the caller can tell the customer.
   */
  syncWithCatalog(catalog: CatalogItem[]): { repriced: boolean; removed: string[] } {
    const removed: string[] = [];
    let repriced = false;

    if (!catalog.length) {
      return { repriced, removed };
    }

    const byId = new Map(catalog.map(item => [Number(item.id), item]));

    const lines = this.lines$.value.reduce<CartLine[]>((kept, line) => {
      const current = byId.get(line.id);

      if (!current) {
        removed.push(line.productName);
        return kept;
      }

      const price = Number(current.price);
      const oldPrice = current.oldPrice ? Number(current.oldPrice) : null;

      if (price !== line.price) {
        repriced = true;
      }

      kept.push({ ...line, price, oldPrice, productName: current.productName });
      return kept;
    }, []);

    if (repriced || removed.length) {
      this.commit(lines);
    }

    return { repriced, removed };
  }

  private commit(lines: CartLine[]): void {
    this.lines$.next(lines);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Private mode / quota — the cart still works for this session.
    }
  }

  private read(): CartLine[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
