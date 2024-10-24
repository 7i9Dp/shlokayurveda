import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { State } from '../interfaces/state';

const API_URL = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(private http: HttpClient) { }

  getState(countryid: number, search: string): Observable<any> {
    return this.http.get(API_URL + 'master/getstate?countryid=' + countryid + '&search=' + search, httpOptions);
  }

  insertUpdateState(state: State): Observable<any> {
    return this.http.post(API_URL + 'master/insertupdatestate', state, httpOptions);
  }

  deleteState(id: number, userid: number): Observable<any> {
    return this.http.delete(API_URL + 'master/deletestate?id=' + id + '&userid=' + userid, httpOptions);
  }

  getStatePagination(countryid:number,search: string,pageno:number,pagesize:number): Observable<any> {
    return this.http.get(API_URL + 'master/v2/getstate?countryid='+countryid+'&search=' + search+'&pageno='+pageno+'&pagesize='+pagesize, httpOptions);
  }
}
