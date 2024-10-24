import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Technicaltest } from '../interfaces/technicaltest';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TechnicaltestService {

  constructor(private http: HttpClient) { }

  getTechnicaltest(search:string,pageno:number,pagesize:number):Observable<any>{    
    return this.http.get(API_URL+'technical/gettechnicaltest?search='+search+'&pageno='+pageno+'&pagesize='+pagesize,httpOptions);
  }

  insertUpdateTechnicaltest(technicaltest:Technicaltest): Observable<any> {
    return this.http.post(API_URL + 'technical/insertupdatetechnicaltest',technicaltest, httpOptions);
  }

  getTechnicaltestById(id:number):Observable<any>{    
    return this.http.get(API_URL+'technical/gettechnicaltestbyid?id='+id,httpOptions);
  }

  changeTechnicalteststatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'technical/changetechnicalteststatus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  getActivetechnicaltest(): Observable<any> {
    return this.http.get(API_URL + 'technical/getactivetechnicaltest', httpOptions);
  }
  
  assignTechnicalTest(candidateid: number, technicaltestid: number, assignby: number,followupby:number,followupdate:string,): Observable<any> {
    return this.http.post(API_URL + 'technical/assigntechnicaltest', {
      candidateid,
      technicaltestid,
      assignby,
      followupby,
      followupdate,
    }, httpOptions);
  }

  getTechnicalFeedbackreviewlist(assingid: number, iscompleted: number, search: string, pageno: number, pagesize: number): Observable<any> {
    return this.http.get(API_URL + 'technical/getassigntechnicalreviewlist?assingid=' + assingid + '&iscompleted=' + iscompleted + '&search=' + search + '&pageno=' + pageno + '&pagesize=' + pagesize, httpOptions);
  }

  updatePracticalFeedback(id:number,selectiontype:number,followupcomment:string,userid:number):Observable<any>{    
    return this.http.get(API_URL+'technical/updatepracticalfeedback?id='+id+'&selectiontype='+selectiontype+'&followupcomment='+followupcomment+'&userid='+userid,httpOptions);
  }
}
