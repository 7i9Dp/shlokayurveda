import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SkillSet } from '../interfaces/skillset';

const API_URL = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class SkillsetService {

  constructor(private http: HttpClient) { }

  insertUpdategodtohave(skillset:SkillSet): Observable<any> {
    return this.http.post(API_URL + 'SkillSet/insertupdateSkillSet', skillset, httpOptions);
  }
  
  getGoodtoHave(search: string, pageno: number, pagesize: number): Observable<any> {
    return this.http.get(API_URL + 'SkillSet/getGoodTohave?search=' + search + '&pageno=' + pageno + '&pagesize=' + pagesize, httpOptions);
  }

  changeSkillsetStatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'SkillSet/changeGoodTohaveStatus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid);
  }

  getMustHave(search: string, pageno: number, pagesize: number): Observable<any> {
    return this.http.get(API_URL + 'SkillSet/getMusthave?search=' + search + '&pageno=' + pageno + '&pagesize=' + pagesize, httpOptions);
  }

  insertUpdateMustHave(skillset:SkillSet): Observable<any> {
    return this.http.post(API_URL + 'SkillSet/insertupdateMustHaveSkill', skillset, httpOptions);
  }

  changeMusthaveStatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'SkillSet/changeMusthaveStatus ?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid);
  }
}
