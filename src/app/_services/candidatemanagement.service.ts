import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CandidatemanagementService {

  constructor(private http: HttpClient) { }

  getcountry():Observable<any>{   
    return this.http.get(API_URL+'candidate/getcountry',httpOptions);
  }

  getstate(countryid:number):Observable<any>{   
    
    return this.http.get(API_URL+'candidate/getstate?countryid='+countryid,httpOptions);
  }

  getcity(stateid:number):Observable<any>{ 
     
    return this.http.get(API_URL+'candidate/getcity?stateid='+stateid,httpOptions);
  }

  getsource():Observable<any>{   
    return this.http.get(API_URL+'candidate/getsource',httpOptions);
  }

  getcandidatestatus():Observable<any>{  
    return this.http.get(API_URL+'candidate/getcandidatestatus',httpOptions);
  }

  getselectionstatus():Observable<any>{   
    return this.http.get(API_URL+'candidate/getselectionstatus',httpOptions);
  }

  getrecruiter():Observable<any>{   
    return this.http.get(API_URL+'candidate/getrecruiter',httpOptions);
  }

  getjobinfo():Observable<any>{   
    return this.http.get(API_URL+'candidate/getjobinfo',httpOptions);
  }

  insertUpdateCandidate(file: any, Eid:any,firstname:any,lastname:any,emailid:any,phoneno:any,gender:any,addressline1:any,addressline2:any,countryid:any,stateid:any,cityid:any,zipcode:any,position:any,expyears:any,expmonths:any,currentorg:any,source:any,currentctc:any,expectedctc:any,noticeperiod:any,recruiter:any,jobid:any,reasonforchange:any,isactive:any,createdby:any,cvdoc:any,uid:any):Observable<any> {
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("Eid", Eid);
    formData.append("uid", uid);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("emailid", emailid);
    formData.append("phoneno", phoneno);
    formData.append("gender",gender);
    formData.append("addressline1", addressline1);
    formData.append("addressline2", addressline2);
    formData.append("countryid", countryid);
    formData.append("stateid", stateid);
    formData.append("cityid", cityid);
    formData.append("zipcode",zipcode);
    formData.append("position", position);
    formData.append("expyears",expyears);
    formData.append("expmonths",expmonths);
    formData.append("currentorg", currentorg);
    formData.append("source", source);
    formData.append("currentctc", currentctc);
    formData.append("expectedctc", expectedctc);
    formData.append("noticeperiod", noticeperiod);
    formData.append("recruiter",recruiter);
    formData.append("jobid",jobid),
    formData.append("reasonforchange", reasonforchange);
    formData.append("isactive", isactive);
    formData.append("createdby", createdby);
    formData.append("cvdoc", cvdoc);
      return this.http.post(API_URL + 'candidate/insertupdatecandidate', formData)
  }

  insertQuickCandidate(firstname:any,lastname:any,emailid:any,phoneno:any,gender:any,jobid:any,recruiter:any,isactive:any,createdby:any,skillsetdatalist:any,musthavedatalist:any):Observable<any> {
    
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("emailid", emailid);
    formData.append("phoneno", phoneno);
    formData.append("gender",gender);
    formData.append("jobid",jobid);
    formData.append("recruiter",recruiter);
    formData.append("isactive",isactive);
    formData.append("createdby", createdby);
    formData.append("skillsetdatalist", JSON.stringify(skillsetdatalist));
    formData.append("musthavedatalist", JSON.stringify(musthavedatalist));
      return this.http.post(API_URL + 'candidate/insertupdatecandidate', formData)
  }


  insertUpdateRecruiter(uid:number,recruiter:number): Observable<any> {
    return this.http.get(API_URL + 'candidate/insertupdaterecruiter?uid='+uid+'&recruiter='+recruiter, httpOptions);
  }

  getmasterReport(year:any): Observable<any> {
    return this.http.get(API_URL+'candidatereport/getdivisionmonthwisereport?year='+year);
  }

  getRegistercandidateReportPagination(search:string,pageno:number,pagesize:number,exe:boolean,oderby:string,jobid:number):Observable<any>{   
    return this.http.get(API_URL+'candidatereport/getjobreport?search='+search+'&pageno='+pageno+'&pagesize='+pagesize+'&export='+exe+'&oderby='+oderby+'&jobid='+jobid,httpOptions);
  }
  getreportdatafiltered(link : any,timefilter:any,startdate:String,enddate:String):Observable<any>{
    return this.http.get(API_URL + 'candidatereport/getreportdatafiltered?link='+link+'&timefilter='+timefilter+'&startdate='+startdate+'&enddate='+enddate,httpOptions)
  }

  getinterviewtype():Observable<any>{   
    return this.http.get(API_URL+'candidate/getinterviewtype',httpOptions);
  }

  getgoodtohavemasthave(inetrtypeid:string):Observable<any>{   
    debugger
    return this.http.get(API_URL+'candidate/getgoodtohavemusthave?inetrviewtypeid='+inetrtypeid,httpOptions);
  }
}
