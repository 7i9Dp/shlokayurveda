import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { Locationmanagement } from '../interfaces/locationmanage';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LocationmanagementService {


  
  constructor(private http: HttpClient) { }

  getLocation(search:string):Observable<any>{    
    return this.http.get(API_URL+'location/getlocation?search='+search,httpOptions);
  }

  // insertUpdateLocation(location:Locationmanagement): Observable<any> {
  //   return this.http.post(API_URL + 'location/insertupdatelocation',location, httpOptions);
  // }

  changeLocationstatus(locationid:number,type:number,flag:boolean,userid:number):Observable<any>{   

    return this.http.get(API_URL+'location/changelocationstatus?locationid='+locationid+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }
}