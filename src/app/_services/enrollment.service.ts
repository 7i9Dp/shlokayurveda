import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assignbuddy } from '../interfaces/assignbuddy';
import { Technologyupdate } from '../interfaces/technologyupdate';

import { Traineeenrollment } from '../interfaces/traineeenrollment';
import { Traineefeedback } from '../interfaces/traineefeedback';
const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private http: HttpClient) { }
  insertUpdatetrainee(trainee:Traineeenrollment): Observable<any> {
    return this.http.post(API_URL + 'trainee/inserttraineeenrollment',trainee, httpOptions);
  }
  getTraineeMasterData(uid:number):Observable<any>{    
    return this.http.get(API_URL+'trainee/gettraineemasterdata?uid='+uid,httpOptions);
  }
  getSelectedEnrollData(search:string,pageno:number,pagesize:number):Observable<any>{    
    return this.http.get(API_URL+'trainee/getselectedenrolldata?search='+search+'&pageno='+pageno+'&pagesize='+pagesize,httpOptions);
  }

  getSelectedEnrollData_V2(search:string,status:number,pageno:number,pagesize:number,startdate:string,enddate:string,oderby:string,technology:number,exports:boolean):Observable<any>{    
    return this.http.get(API_URL+'trainee/v2/getselectedenrolldata?search='+search+'&status='+status+'&pageno='+pageno+'&pagesize='+pagesize+'&startdate='+startdate+'&enddate='+enddate+'&oderby='+oderby+'&technology='+technology+'&exports='+exports,httpOptions);
  }

  

  changeTraineeEnrollstatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{ 
    return this.http.get(API_URL+'trainee/changetraineeenrollstatus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  getTraineeInfo(uid:number):Observable<any>{    
    return this.http.get(API_URL+'trainee/gettraineeinformation?userid='+uid,httpOptions);
  }

  getAssignBuddy():Observable<any>{    
    return this.http.get(API_URL+'trainee/getAssignBuddy',httpOptions);
  }

  insertUpdateAssignBuddy(assign:Assignbuddy): Observable<any> {
    return this.http.post(API_URL + 'trainee/insertAssignBuddy',assign, httpOptions);
  }
  getAssignTopicStatus(uid:number,techid:number):Observable<any>{
    return this.http.get(API_URL+'traineemaster/getassignedtopicsstatus?candidateid='+uid+'&techid='+techid,httpOptions);
  }
  assigntopic( id: number, iscompleted: number): Observable<any> {
    return this.http.post(API_URL+'traineemaster/updateassigntopic?id='+id+'&iscompleted='+iscompleted, httpOptions);
  }
  getFeedback():Observable<any>{    
    return this.http.get(API_URL+'traineefeedback/getfeedback',httpOptions);
  }
  feedbackreviewSumbit(FeedbackReview: Traineefeedback): Observable<any> {
    return this.http.post(API_URL + 'traineefeedback/insertupdatetraineefeedbackreview', FeedbackReview, httpOptions);
  }
  getFeedbackRating(uid:number):Observable<any>{    
    return this.http.get(API_URL+'traineefeedback/getfeedbackrating?userid='+uid,httpOptions);
  }
  getchechassignbuddy(Uid:number,RMVTid:number):Observable<any>{
    return this.http.get(API_URL+'trainee/checkassignbuddy?Uid='+Uid+'&RMVTid='+RMVTid,httpOptions);
  }
  getAssignQuizByUser(uid:number):Observable<any>{    
    return this.http.get(API_URL+'traineefeedback/getassignquiztraineebyuser?userid='+uid,httpOptions);
  }
  getTechnicaltestByCandidateId(candidateid:number,technologyid:number):Observable<any>{    
    return this.http.get(API_URL+'traineefeedback/gettechnicaltesttraineebycandidatetechnology?candidateid='+candidateid+'&technologyid='+technologyid,httpOptions);
  } 
  removebuddy(id:number):Observable<any>{    
    return this.http.get(API_URL+'traineefeedback/removebuddy?id='+id,httpOptions);
  }

  Addfeedbackuser(feedbackuser:Assignbuddy): Observable<any> {
    return this.http.post(API_URL + 'trainee/addfeedbackuser',feedbackuser, httpOptions);
  }

  getFeedbackuser(uid:number):Observable<any>{    
    return this.http.get(API_URL+'trainee/getfeedbackuser?uid='+uid,httpOptions);
  }

  getupdatetechology(uid:number):Observable<any>{    
    return this.http.get(API_URL+'trainee/gettechnology?uid='+uid,httpOptions);
  }
  InsertUpdateTechnology(trainee:Technologyupdate): Observable<any> {
    return this.http.post(API_URL + 'trainee/UpdateTechnology',trainee, httpOptions);
  }

  getbuddyfeedback(uid:number,buddyid:number,technologyid:number):Observable<any>{    
    return this.http.get(API_URL+'report/getfeedbackratingbudyy?uid='+uid+'&buddyid='+buddyid+'&technologyid='+technologyid,httpOptions);
  }

  getrolepermission(uid:number):Observable<any>{  
    return this.http.get(API_URL+'trainee/getRolePermission?uid='+uid,httpOptions);
  }

  getfeedbackrole(uid:number):Observable<any>{ 
    return this.http.get(API_URL+'trainee/getFeedbackRole?uid='+uid,httpOptions);
  }
  getSelectedEnrollData_V4(search:string,status:number,pageno:number,pagesize:number,startdate:string,enddate:string,oderby:string,technology:number,rstatus:number,ruid:number,exports:boolean):Observable<any>{   
    debugger 
    return this.http.get(API_URL+'trainee/v4/getselectedenrolldata?search='+search+'&status='+status+'&pageno='+pageno+'&pagesize='+pagesize+'&startdate='+startdate+'&enddate='+enddate+'&oderby='+oderby+'&technology='+technology+'&rstatus='+rstatus+'&ruid='+ruid+'&exports='+exports,httpOptions);
  }

  getTraineeInfo_v2(uid:number,rstatus:number,ruid:number):Observable<any>{   
    return this.http.get(API_URL+'trainee/v2/gettraineeinformation?userid='+uid+'&rstatus='+rstatus+'&ruid='+ruid,httpOptions);
  }

  getroleTraineeinformation(uid:number):Observable<any>{  
    return this.http.get(API_URL+'trainee/getRoleTraineeInformation?uid='+uid,httpOptions);
  }
}
