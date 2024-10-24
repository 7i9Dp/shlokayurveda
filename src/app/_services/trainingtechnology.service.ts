import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Trainingtechnology } from '../interfaces/trainingtechnology';
const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TrainingtechnologyService {

  constructor(private http: HttpClient) { }
  insertUpdateTrainingTechnology(technology:Trainingtechnology): Observable<any> {
    return this.http.post(API_URL + 'traineemaster/insertupdatetrainingtechnology',technology, httpOptions);
  }
  getTrainingTechnologyPagination(search:string,pageno:number,pagesize:number):Observable<any>{    
    return this.http.get(API_URL+'traineemaster/gettrainingtechnology?search='+search+'&pageno='+pageno+'&pagesize='+pagesize,httpOptions);
  }
  changeTrainingTechnologytatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{ 
    return this.http.get(API_URL+'traineemaster/changeTrainingTechnologyStatus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }
  getTrainingTechnology(candidateid:number,search:string):Observable<any>{    
    return this.http.get(API_URL+'traineemaster/v2/gettrainingtechnology?candidateid='+candidateid+'&search='+search,httpOptions);
  }
}
