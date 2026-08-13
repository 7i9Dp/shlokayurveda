import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ADMIN_TOKEN_KEY } from '../_services/admin.service';

/**
 * Gate for every /admin/* dashboard route. A missing token bounces to /login. This is a
 * UX convenience only — the API independently enforces authorization on each request, so a
 * forged localStorage flag buys nothing but a page that immediately fails its data calls.
 */
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    if (localStorage.getItem(ADMIN_TOKEN_KEY)) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
