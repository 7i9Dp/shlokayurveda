import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { CartService } from 'src/app/_services/cart.service';
import { CatalogItem, Category, SiteDataService } from 'src/app/_services/site-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  kits: CatalogItem[] = [];
  products: CatalogItem[] = [];

  /** Which desktop mega-menu is open: 'kits' | 'products' | null */
  openMenu: string | null = null;

  drawerOpen = false;
  /** Expanded accordion sections inside the mobile drawer. */
  openSections = new Set<string>();

  searchOpen = false;
  searchTerm = '';
  searchResults: CatalogItem[] = [];

  scrolled = false;
  cartCount = 0;

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  private subs = new Subscription();

  constructor(
    private router: Router,
    private siteData: SiteDataService,
    private cart: CartService,
    private host: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    this.subs.add(this.siteData.getData().subscribe(data => {
      this.categories = data.categories;
      this.kits = data.kits;
      this.products = data.products;
    }));

    this.subs.add(this.cart.items.subscribe(
      lines => this.cartCount = lines.reduce((sum, l) => sum + l.quantity, 0)
    ));

    // Any navigation closes whatever is open — otherwise the drawer stays
    // over the new page and the body scroll lock never gets released.
    this.subs.add(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => this.closeAll())
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.unlockBody();
  }

  // ---------------------------------------------------------------- menus

  kitsOf(categoryKey: string): CatalogItem[] {
    return this.kits.filter(k => k.category === categoryKey);
  }

  toggleMenu(menu: string, event?: Event): void {
    event?.stopPropagation();
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  openMenuOn(menu: string): void {
    this.openMenu = menu;
  }

  closeMenu(): void {
    this.openMenu = null;
  }

  // --------------------------------------------------------------- drawer

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
    this.searchOpen = false;
    this.drawerOpen ? this.lockBody() : this.unlockBody();
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.openSections.clear();
    this.unlockBody();
  }

  toggleSection(key: string): void {
    this.openSections.has(key) ? this.openSections.delete(key) : this.openSections.add(key);
  }

  isSectionOpen(key: string): boolean {
    return this.openSections.has(key);
  }

  // --------------------------------------------------------------- search

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    this.openMenu = null;
    if (this.searchOpen) {
      this.drawerOpen = false;
      this.unlockBody();
      setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    } else {
      this.clearSearch();
    }
  }

  closeSearch(): void {
    this.searchOpen = false;
    this.clearSearch();
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.siteData.search(term).subscribe(res => this.searchResults = res.slice(0, 10));
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
  }

  goToItem(item: CatalogItem): void {
    this.closeAll();
    this.router.navigate(['/admin/product-details', item.id]);
  }

  /** Enter in the search box jumps straight to the single best match. */
  submitSearch(): void {
    if (this.searchResults.length) {
      this.goToItem(this.searchResults[0]);
    }
  }

  // ------------------------------------------------------------ navigation

  goHome(): void {
    this.closeAll();
    this.router.navigate(['/admin']).then(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  goToCart(): void {
    this.closeAll();
    this.router.navigate(['/admin/cart']);
  }

  /** Profile icon near the cart — opens the standalone admin login at /login. */
  goToAdminLogin(): void {
    this.closeAll();
    this.router.navigate(['/login']);
  }

  /** Used by About Us / Contact Us — both live on the home page. */
  scrollToSection(sectionId: string): void {
    this.closeAll();
    this.router.navigate(['/admin']).then(() => {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    });
  }

  scrollToContact(): void {
    this.scrollToSection('contact-us');
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // ---------------------------------------------------------------- events

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.openMenu = null;
      if (this.searchOpen) { this.closeSearch(); }
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeAll();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 8;
  }

  private closeAll(): void {
    this.openMenu = null;
    this.drawerOpen = false;
    this.openSections.clear();
    this.searchOpen = false;
    this.clearSearch();
    this.unlockBody();
  }

  private lockBody(): void {
    document.body.style.overflow = 'hidden';
  }

  private unlockBody(): void {
    document.body.style.overflow = '';
  }
}
