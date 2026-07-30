import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CatalogItem, SiteDataService } from 'src/app/_services/site-data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

  year = new Date().getFullYear();

  products: CatalogItem[] = [];
  kits: CatalogItem[] = [];
  contact = { phones: [] as string[], whatsapp: '', email: '', address: '' };

  private subs = new Subscription();

  constructor(private router: Router, private siteData: SiteDataService) { }

  ngOnInit(): void {
    this.subs.add(this.siteData.getData().subscribe(data => {
      // One entry per distinct product name — the 30/60 count variants of the
      // same capsule would otherwise show up twice in the footer list.
      const seen = new Set<string>();
      this.products = data.products.filter(p => {
        if (seen.has(p.productName)) { return false; }
        seen.add(p.productName);
        return true;
      });
      this.kits = data.kits;
      this.contact = data.contact;
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  goToItem(item: CatalogItem): void {
    this.router.navigate(['/admin/product-details', item.id]);
  }

  scrollToSection(sectionId: string): void {
    this.router.navigate(['/admin']).then(() => {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }

  selectPolicy(policy: string): void {
    sessionStorage.setItem('selectedPolicy', policy);
    this.router.navigate(['/admin/info-page']);
  }
}
