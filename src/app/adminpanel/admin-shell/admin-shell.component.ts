import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from '../../_services/admin.service';

/**
 * The persistent chrome for every admin page: branded left sidebar (Dashboard, Returns,
 * Reports), top bar and a projected content area. Pages use it as
 *   <app-admin-shell active="dashboard" title="Dashboard"> ...page... </app-admin-shell>
 */
@Component({
  selector: 'app-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['../adminpanel.shared.css', './admin-shell.component.css']
})
export class AdminShellComponent {
  /** Which nav item to highlight: 'dashboard' | 'returns' | 'reports'. */
  @Input() active = '';
  @Input() title = '';

  sidebarOpen = false;
  adminName = 'Administrator';
  adminEmail = '';

  constructor(private router: Router) {
    try {
      const user = JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || '{}');
      this.adminName = user.name || 'Administrator';
      this.adminEmail = user.email || '';
    } catch {
      // Corrupt/missing user blob — fall back to defaults, nothing to do.
    }
  }

  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar(): void { this.sidebarOpen = false; }

  logout(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    this.router.navigate(['/login']);
  }
}
