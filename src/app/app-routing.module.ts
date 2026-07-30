import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  //{ path: 'login', component: LoginComponent, title: 'Booking - Login' },
  { path: 'forgot', component: ForgotComponent, title: 'Booking - Forgot Password' },
  //{ path: 'admin',canActivate: [AuthGuard], loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  //,canActivate: [AuthGuard]
  // The login route is commented out, so unknown URLs must fall back to the
  // storefront — redirecting to /login left the router with nothing to match.
  { path: '**', redirectTo: '/admin' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
