import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { DashboardComponent } from './adminpanel/dashboard/dashboard.component';
import { ReportsComponent } from './adminpanel/reports/reports.component';
import { ReturnsComponent } from './adminpanel/returns/returns.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },

  // Standalone admin login.
  { path: 'login', component: LoginComponent, title: 'Admin Login - Shlok Ayurveda' },
  { path: 'forgot', component: ForgotComponent, title: 'Booking - Forgot Password' },

  // Admin panel. These specific paths are registered BEFORE the storefront's catch-all
  // 'admin' route below so they win the match — /admin/dashboard resolves here, while
  // /admin/cart, /admin/product-details/:id, etc. still fall through to the storefront.
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AdminGuard], title: 'Dashboard - Shlok Ayurveda' },
  { path: 'admin/returns', component: ReturnsComponent, canActivate: [AdminGuard], title: 'Returns - Shlok Ayurveda' },
  { path: 'admin/reports', component: ReportsComponent, canActivate: [AdminGuard], title: 'Reports - Shlok Ayurveda' },

  // Customer storefront (mounted at /admin — pre-existing).
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },

  // Unknown URLs fall back to the storefront.
  { path: '**', redirectTo: '/admin' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
