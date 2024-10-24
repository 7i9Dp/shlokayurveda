import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Auditorfeedback } from '../interfaces/auditorfeedback';
import { Resourceallocation } from '../interfaces/resourceallocation';
import { dynamicreport } from '../interfaces/dynamicreport';
const API_URL = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class TraineereportService {

  constructor(private http: HttpClient) { }

  getAssignTopicReport(uid:number,technologyid:number,orderby:string):Observable<any>{
    return this.http.get(API_URL+'report/getassignedtopicsreports?candidateid='+uid+'&technologyid='+technologyid+'&orderby='+orderby,httpOptions);
  }

  getTask(uid:number,search:string,pageno:number,pagesize:number,exportexcel:boolean):Observable<any>{    
    return this.http.get(API_URL+'report/v2/gettask?candidateid='+uid+'&search='+search+'&pageno='+pageno+'&pagesize='+pagesize+'&export='+exportexcel,httpOptions);
  }

  gettraineeenrollreport(search:string,status:number,pageno:number,pagesize:number,startdate:string,enddate:string,oderby:string,mantor:number,title:number,technology:number,createddate:string,searchname:string,exports:boolean):Observable<any>{   
    return this.http.get(API_URL+'report/gettraineeenrollreport?search='+search+'&status='+status+'&pageno='+pageno+'&pagesize='+pagesize+'&startdate='+startdate+'&enddate='+enddate+'&oderby='+oderby+'&mantor='+mantor+'&title='+title+'&technology='+technology+'&createddate='+createddate+'&searchname='+searchname+'&exports='+exports,httpOptions);
  }

  getMentor():Observable<any>{    
    return this.http.get(API_URL+'report/getmentor',httpOptions);
  }

  getTechnology():Observable<any>{    
    return this.http.get(API_URL+'report/gettechnology',httpOptions);
  }

  getTitle():Observable<any>{    
    return this.http.get(API_URL+'report/gettitle',httpOptions);
  }

  getperformacereport(search:string,pageno:number,pagesize:number,oderby:string,mantor:number,title:number,checkper:string,exports:boolean):Observable<any>{  
    return this.http.get(API_URL+'report/getperformacereport?search='+search+'&pageno='+pageno+'&pagesize='+pagesize+'&oderby='+oderby+'&mantor='+mantor+'&title='+title+'&checkper='+checkper+'&exports='+exports,httpOptions);
  }

  //aditor 
  getauditorreport(search:string,pageno:number,pagesize:number,oderby:string,exports:boolean):Observable<any>{  
    return this.http.get(API_URL+'report/getauditorreport?search='+search+'&pageno='+pageno+'&pagesize='+pagesize+'&oderby='+oderby+'&exports='+exports,httpOptions);
  }

  getFeedback():Observable<any>{    
    return this.http.get(API_URL+'report/getauditorfeedbackoption',httpOptions);
  }

  auditorfeedbackreviewSumbit(FeedbackReview: Auditorfeedback): Observable<any> {
    return this.http.post(API_URL + 'report/insertauditorfeedback', FeedbackReview, httpOptions);
  }

  getFeedbackRating(candidateid:number):Observable<any>{    
    return this.http.get(API_URL+'report/getfeedbackrating?userid='+candidateid,httpOptions);
  }
  

  getresourceallocation(search:string,pageno:number,pagesize:number,oderby:string,rstatus:number,exports:boolean):Observable<any>{ 
    return this.http.get(API_URL+'report/getsesourceallocation?search='+search+'&pageno='+pageno+'&pagesize='+pagesize+'&oderby='+oderby+'&status='+rstatus+'&exports='+exports,httpOptions);
  }

  getUser():Observable<any>{    
    return this.http.get(API_URL+'trainee/getAssignBuddy',httpOptions);
  }

  insertUpdateResource(resource:Resourceallocation): Observable<any> {
    return this.http.post(API_URL + 'report/insertupdatetresourceallocation',resource, httpOptions);
  }

  changeResourcestatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{ 
    return this.http.get(API_URL+'report/changeresourcestatus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  getAttendance(year:number,month:number,search:string):Observable<any>{
    return this.http.get(API_URL+'attendance/getattendance?year='+year+'&month='+month+'&search='+search,httpOptions);
  }

  getAllAttendance(uid:number,attdate:string):Observable<any>{
    return this.http.get(API_URL+'attendance/getallattendance?candidateid='+uid+'&attdate='+attdate,httpOptions);
  }

  viewAttendance(uid:number,year:number,month:number):Observable<any>{
    return this.http.get(API_URL+'attendance/getattendance?candidateid='+uid+'&year='+year+'&month='+month,httpOptions);
  }

  insertupdatedynamicreport(report:dynamicreport): Observable<any> {
    return this.http.post(API_URL +'candidatereport/insertdynamicreportdata',report, httpOptions);
  }

  insertUpdateRecruiter(uid:number,recruiter:number): Observable<any> {
    return this.http.get(API_URL + 'candidate/insertupdaterecruiter?uid='+uid+'&recruiter='+recruiter, httpOptions);
  }

  getmasterReport(year:any): Observable<any> {
    return this.http.get(API_URL+'candidatereport/getdivisionmonthwisereport?year='+year);
  }

  getreportdata():Observable<any>{
    return this.http.get(API_URL +'candidatereport/getreportdata',httpOptions)
   }

   getreportdatafiltered(link : any,timefilter:any,startdate:String,enddate:String):Observable<any>{
    return this.http.get(API_URL + 'candidatereport/getreportdatafiltered?link='+link+'&timefilter='+timefilter+'&startdate='+startdate+'&enddate='+enddate,httpOptions)
  }
}
