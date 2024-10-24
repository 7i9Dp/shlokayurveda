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
export class TicketbookingService {

  constructor(private http: HttpClient) { }

   /*  Ticket Booking*/

  getTicketBooking(search:string,pageIndex:number,pageSize:number):Observable<any>{   
    return this.http.get(API_URL+'TicketBooking/getticketbookingdata?search='+search+'&pageIndex='+pageIndex+'&pageSize='+pageSize,httpOptions);
  }

  getTicketBookingforToday(date:string):Observable<any>{   
    debugger 
    return this.http.get(API_URL+'TicketBooking/getticketbookingdatafortoday?date='+date,httpOptions);
  }

  getTicketBookingforTodaybyId(ticketuniqueid:string):Observable<any>{   
    debugger 
    return this.http.get(API_URL+'TicketBooking/getticketbookingdatafortodaybyId?ticketuniqueid='+ticketuniqueid,httpOptions);
  }


  insertUpdateTicketBooking(tickettype:Tickettype): Observable<any> {
    debugger
    return this.http.post(API_URL + 'TicketBooking/insertupdateticketbooking',tickettype);
  }
  
  changeTicketTypetatus(tickettypeid:number,type:number,flag:boolean,userid:number):Observable<any>{   
    return this.http.get(API_URL+'TicketBooking/changetickettypestatus?tickettypeid='+tickettypeid+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }


}
