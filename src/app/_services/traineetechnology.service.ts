import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TraineetechnologyService {

  constructor(private http: HttpClient) { }

  getTechnologyReg(technologyid:number):Observable<any>{    
    return this.http.get(API_URL+'master/getregtechnologytrainee?technologyid=' + technologyid ,httpOptions);
  }

}
