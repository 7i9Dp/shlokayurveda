import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CloseJob } from '../interfaces/closejob';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class JobmanagementService {
  
  constructor(private http: HttpClient) { }

  insertUpdatejob(file: any, id: string, title: string, divisionid: string, locationid: string,hiringtypeid: string, vacancy: string, experience: string,budgetforposition: string, startdate: string, tentativedate: string,jobdescription: string, skillset: string, isactive: string, isclose: string, createdby: string,jobdoc:string): Observable<any> {
    debugger
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);
    formData.append("title", title);
    formData.append("divisionid", divisionid);
    formData.append("locationid", locationid);
    formData.append("hiringtypeid", hiringtypeid);
    formData.append("vacancy", vacancy);
    formData.append("experience", experience);
    formData.append("budgetforposition", budgetforposition);
    formData.append("startdate", startdate);
    formData.append("tentativedate", tentativedate);
    formData.append("jobdescription", jobdescription);
    formData.append("skillset", skillset);
    formData.append("isactive", isactive);
    formData.append("isclose", isclose);
    formData.append("createdby", createdby);
    formData.append("jobdoc", jobdoc);
    return this.http.post(API_URL + 'JobManagement/addupdateJob', formData)
  }
                                                        //,selectionflag:number
  ListOfJobsGet(search:string, pageno: number, pagesize: number, locationflag:number, divisionflag:number, jobcodeid:String): Observable<any> {                         
    return this.http.get(API_URL+'JobManagement/getjobmanagementdata?search='+search+'&pageno='+pageno+'&pagesize='+pagesize+'&locationflag='+locationflag+'&divisionflag='+divisionflag+'&jobcodeid='+jobcodeid); //+'&selectionflag='+selectionflag
  }
  
  changejobmanagementstatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'JobManagement/jobdeleteisactive?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid);
  }
  
  getJobmaster(): Observable<any> {
    return this.http.get(API_URL+'JobManagement/getjobmasterdata');
  }

  insertCloseJobDetails(CLoseJobDetails:CloseJob): Observable<any> {
    return this.http.post(API_URL + 'JobManagement/insertupdateclosejob', CLoseJobDetails);
  }

}
