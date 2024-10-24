import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import Swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  returnUrl: string;
  isbtndisable: boolean = false;
  showPassword: boolean = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private formBuilder: FormBuilder, private router: Router, private cookieService: CookieService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberme: [false]
    });

    let rememberme = this.cookieService.get('rememberme');
    if (rememberme) {
      let username = this.cookieService.get('username');
      let password = this.cookieService.get('password');
      this.loginForm.controls["username"].setValue(username);
      this.loginForm.controls["password"].setValue(password);
      this.loginForm.controls["rememberme"].setValue(rememberme);
    }
    else {
      this.loginForm.controls["username"].setValue("");
      this.loginForm.controls["password"].setValue("");
      this.loginForm.controls["rememberme"].setValue(false);
    }

    this.returnUrl = '';
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      let isRportal = localStorage.getItem("isRportal");
      let isTportal = localStorage.getItem("isTportal");

      if (isRportal) {
        this.returnUrl = "/admin/";
      }
      else if (isTportal) {
        this.returnUrl = "/trainee/";
      }
      else {
        localStorage.clear();
        window.sessionStorage.clear();
      }

      this.redirectPage();
    }
  }

  get f() { return this.loginForm.controls; }

  login() {
    debugger
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.isbtndisable = true;

      if (this.loginForm.value.rememberme) {
        this.cookieService.set('username', this.loginForm.value.username);
        this.cookieService.set('password', this.loginForm.value.password);
        this.cookieService.set('rememberme', 'true');
      }
      else {
        this.cookieService.delete('username');
        this.cookieService.delete('password');
        this.cookieService.delete('rememberme');
      }

      //$("#loaderdiv").modal('show');
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
        data => {
          if (data.isSuccess) {
            debugger
            // localStorage.setItem('isRportal', "false");
            // localStorage.setItem('isTportal', "false");
            
            // if (data.userrole != null && data.userrole != '') {
            //   let userrole = data.userrole;
            //   let ArrRole = userrole.split(',');

            //   localStorage.removeItem('isAdmin');
            //   for (let i = 0; i < ArrRole.length; i++) {
            //     if (ArrRole[i].trim() == "Admin" || ArrRole[i].trim() == "admin") {
            //       localStorage.setItem('isAdmin', "true");
            //     }
            //   }
            // }

            localStorage.setItem('isSuccess', data.isSuccess);
            sessionStorage.setItem('isSuccess', data.isSuccess);

            localStorage.setItem('Username', data.data[0].name);
            localStorage.setItem('UserId', data.data[0].id);
            localStorage.setItem('lastlogin', data.data[0].lastlogin);
            localStorage.setItem('userrole', data.data[0].userrole);
            localStorage.setItem('userroleid', data.data[0].userroleid); 
            this.router.navigate(['/admin']);

            // if (data.moduleaccess != null && data.moduleaccess != '') {
            //   let accessModule = data.moduleaccess;
            //   let ArrModule = accessModule.split(',');
            //   if (ArrModule.length > 0) {
            //     if (ArrModule.length == 2) {
            //       localStorage.setItem('isModuleaccess', "true");
            //     }
            //     else {
            //       localStorage.setItem('isModuleaccess', "false");
            //     }
            //     ArrModule = ArrModule.sort();

            //     for (let i = 0; i < ArrModule.length; i++) {
            //       if (ArrModule[i].trim() == "1") {
            //         if (this.returnUrl == '') {
            //           this.returnUrl = "/admin/";
            //         }

            //         localStorage.setItem('isRportal', "true");
            //       }
            //       else if (ArrModule[i].trim() == "2") {
            //         if (this.returnUrl == '') {
            //           this.returnUrl = "/trainee/";
            //         }

            //         localStorage.setItem('isTportal', "true");
            //       }
            //     }
            //     this.tokenStorage.saveToken(data.token);
            //     this.tokenStorage.saveUser(data);
            //     this.isLoginFailed = false;
            //     this.isLoggedIn = true;
            //     window.localStorage.setItem("userroleid", data.userroleid);
            //     localStorage.setItem('isLoggedIn', "true");
            //     localStorage.setItem('userId', data.data);
            //     localStorage.setItem('lastlogin', data.lastlogin);
            //     this.redirectPage();
            //   }
            //   else {
            //     $("#loaderdiv").modal('hide');
            //     this.isbtndisable = false;
            //     Swal.fire('', "Your account has not been given portal permission. Kindly contact administrator.", 'error');
            //   }
            // }
            // else {
            //   $("#loaderdiv").modal('hide');
            //   this.isbtndisable = false;
            //   Swal.fire('', "Your account has not been given portal permission. Kindly contact administrator.", 'error');
            // }
          }
          else {
            // $("#loaderdiv").modal('hide');
            this.isbtndisable = false;
            Swal.fire('', data.returnMessage, 'error');
            //this.errorMessage = data.returnMessage;
            this.isLoginFailed = true;
          }

        },
        err => {
          // $("#loaderdiv").modal('hide');
          this.isbtndisable = false;
          Swal.fire('', err.error.message, 'error');
          //this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
    }
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

  redirectPage(): void {
    window.location.href = this.returnUrl;
  }
}
