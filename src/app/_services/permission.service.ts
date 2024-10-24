import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

  getMenu(uid:number,projectid:number):Observable<any>{    
    return this.http.get(API_URL+'role/getmenu?uid='+uid+'&projectid='+projectid,httpOptions);
  }

  getUserPhoto(uid:number):Observable<any>{
    return this.http.get(API_URL+'users/getuserphoto?userid='+uid,httpOptions);
  }
}
