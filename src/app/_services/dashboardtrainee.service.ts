import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DashboardtraineeService {

  constructor(private http: HttpClient) { }

  getAdminTraineeDashboardByUserId(rstatus:number,ruid:number): Observable<any> {
    return this.http.get(API_URL + 'dashboardtrainee/getadmintraineedashboard?rstatus='+rstatus+'&ruid='+ruid, httpOptions);
  }

}
