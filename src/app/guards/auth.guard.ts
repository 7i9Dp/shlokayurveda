// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private router: Router) { }

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

//     if (this.isLoggedIn()) {
//       return true;
//     }
//     // navigate to login page as user is not authenticated      
//     this.router.navigate(['/login']);
//     return false;
//   }

//   public isLoggedIn(): boolean {
//     let status = false;
//     if (localStorage.getItem('isLoggedIn') == "true") {
//       status = true;
//     }
//     else {
//       status = false;
//     }
//     return status;
//   }
  
// }

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth : AuthService, private router : Router) {

  }

  canActivate(){
    if(localStorage.getItem('isSuccess')=="true")
    {
    return true;
    }
    else
    {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
