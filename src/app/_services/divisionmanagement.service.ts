import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Division } from '../interfaces/division';



const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DivisionmanagementService {

  constructor(private http: HttpClient) { }

  getDivision(search:string):Observable<any>{    
    return this.http.get(API_URL+'division/getdivision?search='+search,httpOptions);
  }
  
  insertUpdateDivision(division:Division): Observable<any> {
    return this.http.post(API_URL + 'division/insertupdatedivision',division, httpOptions);
  }
  
  changeDivisionstatus(divisionid:number,type:number,flag:boolean,userid:number):Observable<any>{   
    return this.http.get(API_URL+'division/changedivisionstatus?divisionid='+divisionid+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }
  
  getcountry():Observable<any>{   
    return this.http.get(API_URL+'division/getcountry',httpOptions);
  }

  getstate(countryid:number):Observable<any>{   
    return this.http.get(API_URL+'division/getstate?countryid='+countryid,httpOptions);
  }
}
