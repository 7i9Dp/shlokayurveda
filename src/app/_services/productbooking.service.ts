import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../_interface/product';
import { contactusModel } from '../admin/homepage/homepage.component';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductBookingService {

  constructor(private http: HttpClient) { }

  insertProduct(product:ProductModel): Observable<any> {
    return this.http.post(API_URL + 'Product/insertproductDetails',product, httpOptions);
  }

  insertContactUSDetails(contactus:contactusModel): Observable<any> {
    return this.http.post(API_URL + 'Product/insertCustomerDetails',contactus, httpOptions);
  }

}
