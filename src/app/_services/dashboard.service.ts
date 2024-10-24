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
export class DashboardService {

  constructor(private http: HttpClient) { }

  // getAdminDashboardByUserId(): Observable<any> {
  //   return this.http.get(API_URL + 'dashboard/getadmindashboard', httpOptions);
  // }
  getAdminDashboardByUserId(divisionid:number,userid:number,timefilter:number,startdate:string,enddate:string): Observable<any> {
    return this.http.get(API_URL + 'dashboard/getadmindashboard?divisionid='+divisionid+'&userid='+userid+'&timefilter='+timefilter+'&startdate='+startdate+'&enddate='+enddate, httpOptions);
  }
  //spgetcountsforinterviewer getadmindashboardinterviewer
  getAdminDashboardByUserIdInterviewer(divisionid:number,userid:number,timefilter:number,startdate:String,enddate:String): Observable<any> {
    return this.http.get(API_URL + 'dashboard/getadmindashboardinterviewer?divisionid='+divisionid+'&userid='+userid+'&timefilter='+timefilter+'&startdate='+startdate+'&enddate='+enddate, httpOptions);
  }
  
//count for recruiter
  getDashboardByUserIdRecruiter(userid:number,divisionid:number,timefilter:number,startdate:String,enddate:String): Observable<any> { 
    return this.http.get(API_URL + 'dashboard/getdashboardrecruiter?divisionid='+divisionid+'&userid='+userid+'&timefilter='+timefilter+'&startdate='+startdate+'&enddate='+enddate ,httpOptions);
  }
}
