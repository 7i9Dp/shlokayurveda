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
export class TicketreportService {

  constructor(private http: HttpClient) { }

  getTicketReport(StartDate:string,EndDate:string,timefilter:any,year:any):Observable<any>{   
    debugger 
    return this.http.get(API_URL+'TicketReport/getticketreportdata?StartDate='+StartDate+'&EndDate='+EndDate+'&timefilter='+timefilter+'&year='+year,httpOptions);
  }
  
}


 

  
 
