import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }
  login(Username: string, Password: string): Observable<any> {
    debugger
    return this.http.post(API_URL + 'auth/adminlogin', {
      Username,
      Password
    }, httpOptions);
  }

  forgotpassword(emailid: string): Observable<any> {
    return this.http.get(API_URL + 'auth/sysforgotpassword?emailid='+emailid, httpOptions);
  }
}
