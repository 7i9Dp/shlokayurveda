import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { source } from '../interfaces/source';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SourceserviceService {

  constructor(private http: HttpClient) { }

  getSource(search:string):Observable<any>{    
    
    return this.http.get(API_URL+'source/getsource?search='+search,httpOptions);
  }

  insertUpdateSource(source:source): Observable<any> {
    return this.http.post(API_URL + 'Source/insertupdateSource',source, httpOptions);
  }

  changeSourcestatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{   

    return this.http.get(API_URL+'source/changesourcestatus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }
}
