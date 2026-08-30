import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = environment.apiURL; // ends with a trailing slash, e.g. https://.../api/

export const ADMIN_TOKEN_KEY = 'admin-token';
export const ADMIN_USER_KEY = 'admin-user';

/**
 * All calls the standalone admin panel makes. Login is anonymous; everything else sends
 * the admin JWT as a Bearer token — the API's [Authorize] rejects anything without it.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) { }

  private authHeaders() {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    };
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(API + 'auth/adminlogin', { Email: email, Password: password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getDashboard(start: string, end: string): Observable<any> {
    return this.http.get(`${API}admin/dashboard?start=${start}&end=${end}`, this.authHeaders());
  }

  getRevenue(start: string, end: string, grouping: string): Observable<any> {
    return this.http.get(`${API}admin/dashboard/revenue?start=${start}&end=${end}&grouping=${grouping}`, this.authHeaders());
  }

  /** Per-product sales + returns for the period. */
  getProductPerformance(start: string, end: string): Observable<any> {
    return this.http.get(`${API}admin/dashboard/products?start=${start}&end=${end}`, this.authHeaders());
  }

  getReports(start: string, end: string, method: string, status: string): Observable<any> {
    let url = `${API}admin/reports?start=${start}&end=${end}`;
    if (method) { url += `&method=${encodeURIComponent(method)}`; }
    if (status) { url += `&status=${encodeURIComponent(status)}`; }
    return this.http.get(url, this.authHeaders());
  }

  getOrders(start: string, end: string): Observable<any> {
    return this.http.get(`${API}admin/orders?start=${start}&end=${end}`, this.authHeaders());
  }

  getOrder(orderId: number | string): Observable<any> {
    return this.http.get(`${API}admin/orders/${orderId}`, this.authHeaders());
  }

  getReturns(start: string, end: string): Observable<any> {
    return this.http.get(`${API}admin/returns?start=${start}&end=${end}`, this.authHeaders());
  }

  // payload: { orderId, refundStatus, reason, items: [{ orderItemId, returnedQuantity, returnedAmount }] }
  createReturn(payload: any): Observable<any> {
    return this.http.post(`${API}admin/returns`, payload, this.authHeaders());
  }
}
