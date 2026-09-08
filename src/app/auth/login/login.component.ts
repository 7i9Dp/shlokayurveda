import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from 'src/app/_services/admin.service';

/**
 * Standalone admin login at /login. Single admin user; credentials are validated
 * server-side against appsettings.json and, on success, the API returns a JWT that every
 * subsequent /admin/* call carries.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private admin: AdminService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Already signed in — skip straight to the dashboard.
    if (localStorage.getItem(ADMIN_TOKEN_KEY)) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  get f() { return this.loginForm.controls; }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.admin.login(this.f['email'].value, this.f['password'].value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.isSuccess) {
          const token = res.value || (res.data && res.data.token);
          localStorage.setItem(ADMIN_TOKEN_KEY, token);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(res.data || {}));
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = (res && res.returnMessage) || 'Invalid email or password.';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to sign in right now. Please check your connection and try again.';
      }
    });
  }
}
