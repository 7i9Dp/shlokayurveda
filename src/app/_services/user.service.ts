import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from '../_interface/users';
//import { UserProfile } from '../interfaces/userprofile';
//import { Users } from '../interfaces/users';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUserById(id:number):Observable<any>{
    return this.http.get(API_URL+'users/getUserbyid?userid='+id,httpOptions);
  }

  deleteUser(uid:number,type:any,flag:any,updatedby:any):Observable<any>{
    debugger
    return this.http.delete(API_URL+'users/changeuserstatus?uid='+uid+'&type='+type+'&flag='+flag+'&updatedby='+updatedby,httpOptions);
  }

  changePassword(userid:number,password:string):Observable<any>{
    return this.http.put(API_URL+'users/changepassword?userid='+userid+'&password='+password,httpOptions);
  }

  getalluser(search:string):Observable<any>{    
    return this.http.get(API_URL+'users/getalluser?search='+search,httpOptions);
  }
  
  insertUpdateUser(user:Users): Observable<any> {
    debugger
    return this.http.post(API_URL + 'users/insertupdateuser',user, httpOptions);
  }

  changeUserstatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'users/changeuserstatus?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  getAssignuser():Observable<any>{    
    return this.http.get(API_URL+'feedback/getassignuser',httpOptions);
  }

  getModule(search:string):Observable<any>{    
    return this.http.get(API_URL+'role/getmodule?search='+search,httpOptions);
  }

  getAlluserPagination(search: string,pageno:number,pagesize:number,oderby:string): Observable<any> {
    debugger
    return this.http.get(API_URL + 'users/v2/getalluser?search=' + search+'&pageno='+pageno+'&pagesize='+pagesize+'&oderby='+oderby, httpOptions);
  }

  getUsermaster(): Observable<any> {
    debugger
    return this.http.get(API_URL+'users/getusermasterdata');
  }
}
