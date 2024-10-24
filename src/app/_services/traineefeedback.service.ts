import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Traineefeedbackoption } from '../interfaces/traineefeedbackoption';
import { Traineefeedbacktype } from '../interfaces/traineefeedbacktype';
import { Auditorfeedbackoption } from 'src/app/interfaces/auditorfeedbackoption';
const API_URL = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TraineefeedbackService {

  constructor(private http: HttpClient) { }

  getFeedbacktype(search:string): Observable<any> {
    return this.http.get(API_URL + 'traineefeedback/gettraineefeedbacktype?search='+search, httpOptions);
  }
  insertupdatefeedbackType(FeedbackType: Traineefeedbacktype): Observable<any> {
    return this.http.post(API_URL + 'traineefeedback/insertupdatetraineefeedbacktype', FeedbackType, httpOptions);
  }
  deleteFeedbacktype(id:number,userid:number):Observable<any>{    
    return this.http.get(API_URL+'traineefeedback/deletetraineefeedbacktype?id='+id+'&userid='+userid,httpOptions);
  }
  insertUpdateTraineeFeedbackoption(feedbackoption: Traineefeedbackoption): Observable<any> {
    return this.http.post(API_URL + 'traineefeedback/insertupdatetraineefeedbackoption', feedbackoption, httpOptions);
  }
  
  getTraineeFeedbackoption(feedbackid: number, search: string, pageno: number, pagesize: number): Observable<any> {
    return this.http.get(API_URL + 'traineefeedback/gettraineefeedbackoption?feedbackid=' + feedbackid + '&search=' + search + '&pageno=' + pageno + '&pagesize=' + pagesize, httpOptions);
  }

  changeFeedbackoptionstatus(id: number, type: number, flag: boolean, userid: number): Observable<any> {
    return this.http.get(API_URL + 'traineefeedback/changetraineefeedbackoption?id=' + id + '&type=' + type + '&flag=' + flag + '&userid=' + userid, httpOptions);
  }

  insertUpdateAuditorFeedbackoption(feedbackoption: Auditorfeedbackoption): Observable<any> {
    return this.http.post(API_URL + 'traineemaster/insertupdateauditorfeedbackoption', feedbackoption, httpOptions);
  }

  getAuditorFeedbackoption(search: string, pageno: number, pagesize: number): Observable<any> {
    return this.http.get(API_URL + 'traineemaster/getauditorfeedbackoption?search=' + search + '&pageno=' + pageno + '&pagesize=' + pagesize, httpOptions);
  }

  changeAuditorFeedbackoptionstatus(id: number, type: number, flag: boolean, userid: number): Observable<any> {
    return this.http.get(API_URL + 'traineemaster/changeauditorfeedbackoption?id=' + id + '&type=' + type + '&flag=' + flag + '&userid=' + userid, httpOptions);
  }
  
}
