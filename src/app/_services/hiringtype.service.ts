import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HiringType } from '../interfaces/hiringtype';

const API_URL =environment.apiURL;
@Injectable({
  providedIn: 'root'
})
export class HiringtypeService {

  constructor(private http: HttpClient) { }
  
  insertUpdateHiringType(hiringtype:HiringType): Observable<any> {
     return this.http.post(API_URL + 'HiringType/addupdatehiringtype',hiringtype);
    }
    
  ListOfHiringTypesGet(search:string): Observable<any> {
    return this.http.get(API_URL+'HiringType/gethiringtypedata?search='+search); //change
  }
     
  changehiringtypestatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'HiringType/hiringtypedeleteisactive?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid);
  }
}
