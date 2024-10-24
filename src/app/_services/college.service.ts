import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { College } from '../interfaces/college';

const API_URL = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CollegeService {
  constructor(private http: HttpClient) { }

  getCollege(search: string): Observable<any> {
    return this.http.get(API_URL + 'college/getcollege?search=' + search, httpOptions);
  }

  insertUpdateCollege(college: College): Observable<any> {
    return this.http.post(API_URL + 'college/insertupdatecollege', college, httpOptions);
  }

  deleteCollege(id: number, userid: number): Observable<any> {
    return this.http.delete(API_URL + 'college/deletecollege?id=' + id + '&userid=' + userid, httpOptions);
  }
}
