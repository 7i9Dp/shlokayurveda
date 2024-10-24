import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Education } from '../interfaces/education';
import { UserProfile } from '../interfaces/userprofile';
import { Workexpirence } from '../interfaces/workexpirence';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfileById(id:number):Observable<any>{    
    return this.http.get(API_URL+'profile/getProfilebyid?userid='+id,httpOptions);
  }

  profileUpdate(UserProfile:UserProfile): Observable<any> {
    return this.http.put(API_URL + 'profile/updaterofile',UserProfile, httpOptions);
  }

  getEducationById(id:number):Observable<any>{    
    return this.http.get(API_URL+'profile/geteducation?userid='+id,httpOptions);
  }

  educationUpdate(Education:Education): Observable<any> {
    return this.http.post(API_URL + 'profile/updateeducation',Education, httpOptions);
  }

  getWorkExpById(id:number):Observable<any>{    
    return this.http.get(API_URL+'profile/getworkexperience?userid='+id,httpOptions);
  }

  workExpUpdate(Workexpirence:Workexpirence): Observable<any> {
    return this.http.post(API_URL + 'profile/updateworkexperience',Workexpirence, httpOptions);
  }

  getCountry(search:string):Observable<any>{    
    return this.http.get(API_URL+'master/getcountry?search='+search,httpOptions);
  }

  getState(countryid: number, search: string): Observable<any> {
    return this.http.get(API_URL + 'master/getstate?countryid=' + countryid + '&search=' + search, httpOptions);
  }

  getCity(countryid:number,stateid: number, search: string): Observable<any> {
    return this.http.get(API_URL + 'master/getcity?countryid='+countryid+'&stateid=' + stateid + '&search=' + search, httpOptions);
  }
}
