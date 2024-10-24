import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Technology } from '../interfaces/technology';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  constructor(private http: HttpClient) { }
  
  getTechnology(search:string):Observable<any>{    
    return this.http.get(API_URL+'master/gettechnology?search='+search,httpOptions);
  }
  getJob():Observable<any>{    
    return this.http.get(API_URL+'master/getregtechnology',httpOptions);
  }
  insertUpdateTechnology(technology:Technology): Observable<any> {
    return this.http.post(API_URL + 'master/insertupdatetechnology',technology, httpOptions);
  }

  changeTechnologystatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'master/changetechnology?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  getTechnologyReg():Observable<any>{    
    return this.http.get(API_URL+'master/getregtechnology',httpOptions);
  }
}
