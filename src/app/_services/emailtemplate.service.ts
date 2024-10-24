import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Email } from '../interfaces/email';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EmailtemplateService {

  constructor(private http: HttpClient) { }
  
  getEmailtemplateData():Observable<any>{    
    return this.http.get(API_URL+'email/getallemailtemplate',httpOptions);
  }

  editEmailTemplateById(id:any): Observable<any> {
    return this.http.get(API_URL + 'email/getemailtemplatebyid?id='+id);
  }

  insertUpdateEmailTempalte(Email:Email): Observable<any> {
    
    return this.http.post(API_URL + 'email/insertupdateemailtemplate',Email, httpOptions);
  }

  
  changeEmailstatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{   

    return this.http.get(API_URL+'email/changeemailstatus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }
  
  
}
