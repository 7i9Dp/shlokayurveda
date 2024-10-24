import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Type } from 'src/app/interfaces/type';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PracticaltypeService {

  constructor(private http: HttpClient) { }

  getPracticalType(paginationid:number,search:string,pageno:number,pagesize:number):Observable<any>{    
    return this.http.get(API_URL+'traineemaster/gettype?paginationid='+paginationid+'&search='+search+'&pageno='+pageno+'&pagesize='+pagesize,httpOptions);
  }

  insertUpdateType(type:Type): Observable<any> {
    return this.http.post(API_URL + 'traineemaster/insertupdateType',type, httpOptions);
  }

  changeTypestatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{ 
    return this.http.get(API_URL+'traineemaster/changeTypeStatus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

}
