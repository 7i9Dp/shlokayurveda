import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import Swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  forgotpassowrdForm: FormGroup;
  submitted = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  returnUrl: string;
  sflag: boolean = false;
  fflag: boolean = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private formBuilder: FormBuilder, private router: Router) {
    this.forgotpassowrdForm = this.formBuilder.group({
      emailid: ['', Validators.required]
    });

    this.returnUrl = '/admin';
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }

  get f() { return this.forgotpassowrdForm.controls; }

  forgotpassword() {
    this.submitted = true;
    if (this.forgotpassowrdForm.invalid) {
      return;
    }
    else {
     
          $("#loaderdiv").modal('show');
          this.authService.forgotpassword(this.forgotpassowrdForm.value.emailid).subscribe(
            data => {
              if (data.isSuccess) {
                Swal.fire('Thank you...', data.returnMessage, 'success');
                // this.errorMessage = data.returnMessage;
                // this.sflag=true;
                // this.fflag=false;
              }
              else {
                Swal.fire('', data.returnMessage, 'error');
                // this.errorMessage = data.returnMessage;
                // this.fflag=true;
                // this.sflag=false;
              }
              $("#loaderdiv").modal('hide');
              this.resetForm();
            },
            err => {
              $("#loaderdiv").modal('hide');
              Swal.fire('', err.error.message, 'error');
              // this.errorMessage = err.error.message;
              // this.fflag=true;
              // this.sflag=false;
              this.isLoginFailed = true;
            }
          );
    }
  }

  resetForm() {
    this.submitted = false;
    this.forgotpassowrdForm = this.formBuilder.group({
      emailid: ['', Validators.required]
    });
  }
}
