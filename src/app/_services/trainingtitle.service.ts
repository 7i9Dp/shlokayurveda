import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Trainingtitle } from '../interfaces/trainingtitle';
const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TrainingtitleService {

  constructor(private http: HttpClient) { }
  insertUpdateTrainingTitle(title:Trainingtitle): Observable<any> {
    return this.http.post(API_URL + 'traineemaster/insertupdatetitle',title, httpOptions);
  }
  getTrainingTitlePagination(search:string,pageno:number,pagesize:number):Observable<any>{    
    return this.http.get(API_URL+'traineemaster/gettrainingtitle?search='+search+'&pageno='+pageno+'&pagesize='+pagesize,httpOptions);
  }

  changeTrainingTitlestatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{ 
    return this.http.get(API_URL+'traineemaster/changeTrainingTitlestatus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }
}
