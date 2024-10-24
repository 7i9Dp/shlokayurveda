import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../interfaces/city';

const API_URL = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CityService {
  constructor(private http: HttpClient) { }

  getCity(countryid:number,stateid: number, search: string): Observable<any> {
    return this.http.get(API_URL + 'master/getcity?countryid='+countryid+'&stateid=' + stateid + '&search=' + search, httpOptions);
  }

  insertUpdateCity(city: City): Observable<any> {
    return this.http.post(API_URL + 'master/insertupdatecity', city, httpOptions);
  }

  deleteCity(id: number, userid: number): Observable<any> {
    return this.http.delete(API_URL + 'master/deletecity?id=' + id + '&userid=' + userid, httpOptions);
  }

  getCityPagination(countryid:number,stateid: number, search: string,pageno:number,pagesize:number): Observable<any> {
    return this.http.get(API_URL + 'master/v2/getcity?countryid='+countryid+'&stateid=' + stateid + '&search=' + search+'&pageno='+pageno+'&pagesize='+pagesize, httpOptions);
  }
}
