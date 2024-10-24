import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {TraineeTechnicaltest} from 'src/app/interfaces/traineetechnicaltest';
import { Observable } from 'rxjs';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TraineetechnicaltestService {

  constructor(private http: HttpClient) { }

  insertUpdateTechnicaltest(technicaltest:TraineeTechnicaltest): Observable<any> {
    return this.http.post(API_URL + 'traineetechnical/insertupdatetechnicaltesttrainee',technicaltest, httpOptions);
  }

  getTechnicaltest(typeid:number,search:string,pageno:number,pagesize:number):Observable<any>{    
    return this.http.get(API_URL+'traineetechnical/gettechnicaltesttrainee?typeid='+typeid+'&search='+search+'&pageno='+pageno+'&pagesize='+pagesize,httpOptions);
  }

  changeTechnicalteststatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'traineetechnical/changetechnicalteststatustrainee?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  getTechnicaltestById(id:number):Observable<any>{    
    return this.http.get(API_URL+'traineetechnical/gettechnicaltesttraineebyid?id='+id,httpOptions);
  }

  getTechnicaltestbytechid(typeid:number,trainingtechnologyid:number):Observable<any>{    
    return this.http.get(API_URL+'traineetechnical/getTechnicaltestbytechid?typeid='+typeid+'&trainingtechnologyid='+trainingtechnologyid,httpOptions);
  }

  updatePracticalEvaluation(id:number,obtainmarks:number,comments:string,userid:number):Observable<any>{    
    return this.http.get(API_URL+'traineetechnical/updatepracticalevaluation?id='+id+'&obtainmarks='+obtainmarks+'&comments='+comments+'&userid='+userid,httpOptions);
  }

}
