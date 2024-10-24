import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Campus } from '../interfaces/campus';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CampusService {

  constructor(private http: HttpClient) { }
  
  getCampus(search:string):Observable<any>{    
    return this.http.get(API_URL+'master/getcampus?search='+search,httpOptions);
  }
  
  insertUpdateCampus(campus:Campus): Observable<any> {
    return this.http.post(API_URL + 'master/insertupdatecampus',campus, httpOptions);
  }

  changeCampusstatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'master/changecampus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  getRegCampus():Observable<any>{    
    return this.http.get(API_URL+'master/getregcampus',httpOptions);
  }

}
