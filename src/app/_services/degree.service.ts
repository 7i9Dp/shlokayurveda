import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Degree } from '../interfaces/degree';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DegreeService {

  constructor(private http: HttpClient) { }
  
  getDegree(search:string):Observable<any>{    
    return this.http.get(API_URL+'master/getdegree?search='+search,httpOptions);
  }
  
  insertUpdateDegree(degree:Degree): Observable<any> {
    return this.http.post(API_URL + 'master/insertupdatedegree',degree, httpOptions);
  }

  deleteDegree(id:number,userid:number):Observable<any>{    
    return this.http.get(API_URL+'master/deletedegree?id='+id+'&userid='+userid,httpOptions);
  }
}
