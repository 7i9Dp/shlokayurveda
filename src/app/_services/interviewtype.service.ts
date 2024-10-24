import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InterviewType } from '../interfaces/interviewtype';

const API_URL =environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class InterviewtypeService {

  constructor(private http: HttpClient) { }

  insertUpdateInterviewType(interviewtype:InterviewType): Observable<any> {
     return this.http.post(API_URL + 'InterviewType/addupdateinterviewtype',interviewtype);
    }
    
  ListOfInterviewTypesGet(search:string): Observable<any> {
    return this.http.get(API_URL+'InterviewType/getinterviewtypedata?search='+search); //change
  }
     
  changeinterviewtypestatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'InterviewType/interviewtypedeleteisactive?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid);
  }
}
