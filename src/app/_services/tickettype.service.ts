import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tickettype } from '../_interface/tickettype';

const API_URL = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TickettypeService {

  constructor(private http: HttpClient) { }

  getTicketType(search:string,pageIndex:number,pageSize:number):Observable<any>{   
    debugger 
    return this.http.get(API_URL+'TicketType/gettickettypedata?search='+search+'&pageIndex='+pageIndex+'&pageSize='+pageSize,httpOptions);
  }

  insertUpdateTicketType(tickettype:Tickettype): Observable<any> {
    debugger
    return this.http.post(API_URL + 'TicketType/insertupdatetickettype',tickettype, httpOptions);
  }

  changeTicketTypetatus(tickettypeid:number,type:number,flag:boolean,userid:number):Observable<any>{   
    debugger
    return this.http.get(API_URL+'TicketType/changetickettypestatus?tickettypeid='+tickettypeid+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

}

  
 

 