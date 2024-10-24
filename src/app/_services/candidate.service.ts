import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  constructor(private http: HttpClient) { }
  
  getRegistercandidate(search:string,campustype:number,campusid:number):Observable<any>{    
    return this.http.get(API_URL+'users/registercandidate?search='+search+'&campustype='+campustype+'&campusid='+campusid,httpOptions);
  }

  // getRegistercandidatePagination(search:string,campustype:number,campusid:number,technologyid:number,selectionflag:number,pageno:number,pagesize:number,exe:boolean):Observable<any>{    
  //   return this.http.get(API_URL+'users/v2/registercandidate?search='+search+'&campustype='+campustype+'&campusid='+campusid+'&technologyid='+technologyid+'&selectionflag='+selectionflag+'&pageno='+pageno+'&pagesize='+pagesize+'&export='+exe,httpOptions);
  // }
  getRegistercandidatePagination(search:string,campustype:number,campusid:number,technologyid:number,selectionflag:number,pageno:number,pagesize:number,exe:boolean,oderby:string,recruiterid:number,jobid:number,sourceid:number,divisionid:number,userid:number,timefilter:number,startdate:String,enddate:String):Observable<any>{   
    return this.http.get(API_URL+'users/v2/registercandidate?search='+search+'&campustype='+campustype+'&campusid='+campusid+'&technologyid='+technologyid+'&selectionflag='+selectionflag+'&pageno='+pageno+'&pagesize='+pagesize+'&export='+exe+'&oderby='+oderby+'&recruiterid='+recruiterid+'&jobid='+jobid+'&sourceid='+sourceid+'&divisionid='+divisionid+'&userid='+userid+'&timefilter='+timefilter+'&startdate='+startdate+'&enddate='+enddate,httpOptions);
  }
  changeCandidatestatus(id:number,flag:boolean,type:number,userid:number):Observable<any>{    
    return this.http.put(API_URL+'users/changecandidatestatus?id='+id+'&flag='+flag+'&type='+type+'&userid='+userid,null);
  }

  assignQuiz(id: number, uid: number, quizid: number, expireddate: string,createdby:number): Observable<any> {
    return this.http.post(API_URL + 'quiz/assignquiz', {
      id,
      uid,
      quizid,
      expireddate,
      createdby
    }, httpOptions);
  }

  // assignQuizCampus(quizid: number, campusid: number, technologyid: number,createdby:number): Observable<any> {
  //   return this.http.post(API_URL + 'quiz/assignquizcampus', {
  //     quizid,
  //     campusid,
  //     technologyid,
  //     createdby
  //   }, httpOptions);
  // }

  assignQuizCampus(quizid: string, campusid: string, technologyid: number, createdby: number): Observable<any> {
    const body = {
        quizid: parseInt(quizid),
        campusid: parseInt(campusid),
        technologyid,
        createdby
    };
    return this.http.post(API_URL + 'quiz/assignquizcampus', body, httpOptions);
}

  getCampus():Observable<any>{    
    return this.http.get(API_URL+'master/getregcampus',httpOptions);
  }

  getCampusInactive():Observable<any>{    
    return this.http.get(API_URL+'master/getcampus',httpOptions);
  }

  getTechnology():Observable<any>{    
    return this.http.get(API_URL+'master/getregtechnology',httpOptions);
  }

  updateUsertechnology(uid:number,technologyid:number,campustype:number,campusid:number,updatedby:number):Observable<any>{    
    return this.http.put(API_URL+'users/updateusertechnology?uid='+uid+'&technologyid='+technologyid+'&campustype='+campustype+'&campusid='+campusid+'&updatedby='+updatedby,httpOptions);
  }

  candidateDetails(uid:number):Observable<any>{    
    return this.http.get(API_URL+'profile/getcandidatedetail?userid='+uid,httpOptions);
  }

  assignFeedbackreview(id: number, assignedid: number, feedbacktypeid: number,candidateid:number,interviewdatetime:string,createdby:number): Observable<any> {
    return this.http.post(API_URL + 'feedback/assignfeedbackreview', {
      id,
      assignedid,
      feedbacktypeid,
      candidateid,
      interviewdatetime,
      createdby
    }, httpOptions);
  }
  getcaniddtaereport(search:string,campustype:number,campusid:number,technologyid:number,selectionflag:number,pageno:number,pagesize:number,exe:boolean,oderby:string,recruiterid:number,jobid:number,sourceid:number,divisionid:number,userid:number,timefilter:number,startdate:String,enddate:String):Observable<any>{   
    return this.http.get(API_URL+'candidatereport/getcandidatereport?search='+search+'&campustype='+campustype+'&campusid='+campusid+'&technologyid='+technologyid+'&selectionflag='+selectionflag+'&pageno='+pageno+'&pagesize='+pagesize+'&export='+exe+'&oderby='+oderby+'&recruiterid='+recruiterid+'&jobid='+jobid+'&sourceid='+sourceid+'&divisionid='+divisionid+'&userid='+userid+'&timefilter='+timefilter+'&startdate='+startdate+'&enddate='+enddate,httpOptions);
  }


  getregularization():Observable<any>{    
    return this.http.get(API_URL+'attendance/getregularization',httpOptions);
  }

  getcandidateattendance(uid:number):Observable<any>{    
    return this.http.get(API_URL+'attendance/getcandidateattendance?uid='+uid,httpOptions);
  }

  updateregularization(id:number,createdby:number): Observable<any> {
    return this.http.get(API_URL+'attendance/v2/regularattendandce?id='+id+'&createdby='+createdby, httpOptions);
  }
}
