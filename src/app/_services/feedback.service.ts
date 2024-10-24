import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feedbackoption } from '../interfaces/feedbackoption';
import { FeedbackReview } from '../interfaces/feedbackreview';
import { FeedbackType } from '../interfaces/feedbacktype';
import { JobOffer } from '../interfaces/JobOffer';

const API_URL = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  getFeedbacktype(search: string): Observable<any> {
    return this.http.get(API_URL + 'feedback/getfeedbacktype?search=' + search, httpOptions);
  }

  getFeedbackoption(feedbackid: number, search: string, pageno: number, pagesize: number): Observable<any> {
    return this.http.get(API_URL + 'feedback/getfeedbackoption?feedbackid=' + feedbackid + '&search=' + search + '&pageno=' + pageno + '&pagesize=' + pagesize, httpOptions);
  }

  insertUpdateFeedbackoption(feedbackoption: Feedbackoption): Observable<any> {
    return this.http.post(API_URL + 'feedback/insertupdatefeedbackoption', feedbackoption, httpOptions);
  }

  changeFeedbackoptionstatus(id: number, type: number, flag: boolean, userid: number): Observable<any> {
    return this.http.get(API_URL + 'feedback/changefeedbackoption?id=' + id + '&type=' + type + '&flag=' + flag + '&userid=' + userid, httpOptions);
  }

  getFeedbackreviewlist(assingid: number, iscompleted: number, search: string, pageno: number, pagesize: number): Observable<any> {
    return this.http.get(API_URL + 'feedback/getassignreviewlist?assingid=' + assingid + '&iscompleted=' + iscompleted + '&search=' + search + '&pageno=' + pageno + '&pagesize=' + pagesize, httpOptions);
  }

  getReviewFeedbackSubmit(feedbacktypeid: number, candidateid: number, assingid: number): Observable<any> {
    return this.http.get(API_URL + 'feedback/getfeedbackreview?feedbacktypeid=' + feedbacktypeid + '&candidateid=' + candidateid + '&assingid=' + assingid, httpOptions);
  }

  feedbackreviewSumbit(FeedbackReview: FeedbackReview): Observable<any> {
    return this.http.post(API_URL + 'feedback/insertupdatefeedbackreview', FeedbackReview, httpOptions);
  }

  insertupdatefeedbackType(FeedbackType: FeedbackType): Observable<any> {
    return this.http.post(API_URL + 'feedback/insertupdatefeedbacktype', FeedbackType, httpOptions);
  }

  insertupdateskillforfeedbacktype(userid:number,skillset: string,skillset1: string,cid:number): Observable<any> {
    return this.http.post(API_URL + 'feedback/insertupdateskillforfeedbacktype?userid=' + userid + '&skillset=' + skillset + '&skillset1=' + skillset1 + '&cid=' + cid, httpOptions);
  }

  deleteFeedbacktype(id: number, userid: number): Observable<any> {
    return this.http.get(API_URL + 'feedback/deletefeedbacktype?id=' + id + '&userid=' + userid, httpOptions);
  }

  getTechnicalRoundReport(campusid: number, feedbacktype: number, Userid: number, iscompleted: number, search: string, pageno: number, pagesize: number, excel: boolean): Observable<any> {
    return this.http.get(API_URL + 'feedback/getnextrounddata?campusid=' + campusid + '&feedbacktype=' + feedbacktype + '&Userid=' + Userid + '&iscompleted=' + iscompleted + '&search=' + search + '&pageno=' + pageno + '&pagesize=' + pagesize + '&export=' + excel, httpOptions);
  }

  updateCandidateSelection(candidateid: number, selectcandidate: number, submitedby: number): Observable<any> {
    return this.http.get(API_URL + 'feedback/updatefinalcandidateselection?candidateid=' + candidateid + '&selectcandidate=' + selectcandidate + '&submitedby=' + submitedby, httpOptions);
  }

  deleteInterviewStatus(id: number, userid: number): Observable<any> {
    return this.http.get(API_URL + 'feedback/deleteinterviewstatus?id=' + id + '&userid=' + userid, httpOptions);
  }



  //My Services
  insertUpdateinterviewSchedule(file: any,id: string,candidateid:string,interviewerid:string,typeofinterviewid:string,interviewdatetime:string,interviewtype:string,createdby:string,requiredtest:string,tdescription:string,remarks:string,isactive:string,interviewdocuments:string): Observable<any> {
    
    const formData = new FormData();          //jobid:string,
    formData.append("file", file);
    formData.append("id", id);
    // formData.append("jobid", jobid); 
    formData.append("candidateid", candidateid);
    formData.append("interviewerid", interviewerid);
    formData.append("typeofinterviewid", typeofinterviewid);
    formData.append("interviewtype", interviewtype);
    formData.append("interviewdatetime", interviewdatetime);
    formData.append("remarks", remarks);
    formData.append("requiredtest", requiredtest);
    formData.append("tdescription", tdescription);
    formData.append("createdby", createdby);
    formData.append("isactive", isactive);
    formData.append("interviewdocuments", interviewdocuments);
    return this.http.post(API_URL + 'InterviewSchedule/addupdateinterviewschedule', formData)
  }
 
  getintereviewschedulalist(isadmin:boolean,userid:number, search: string, pageno: number, pagesize: number): Observable<any> {
    //, orderBy:string
    return this.http.get(API_URL + 'InterviewSchedule/getinterviewscheduledata?isadmin='+isadmin+'&userid='+userid+'&search=' + search + '&pageno=' + pageno + '&pagesize=' + pagesize , httpOptions); //+ '&orderBy'+ orderBy 
  }

  getInterviewmaster(): Observable<any> {
    
    return this.http.get(API_URL+'InterviewSchedule/getinterviewmasterdata');
  }


  changeinterviewschedulestatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{   
    return this.http.get(API_URL+'InterviewSchedule/InterviewScheduledeleteisactive?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid);
  }

  //jobofferlistdropdown
  getJobOfferlist(): Observable<any> {
    return this.http.get(API_URL+'JobOffer/getjobofferdata');
  }
  getInterviewerDropdown(divisionid:any): Observable<any> {
    return this.http.get(API_URL+'InterviewSchedule/getinterviewerdata?divisionid='+divisionid);
  }
  insertUpdateJobOffer(joboffer:JobOffer): Observable<any> {
    
    return this.http.post(API_URL + 'JobOffer/insertupdatejoboffer', joboffer);
  }
}
