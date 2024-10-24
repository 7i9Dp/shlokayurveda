import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permission } from '../interfaces/permission';
import { Role } from '../interfaces/role';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http: HttpClient) { }
  
  getRole(search:string):Observable<any>{    
    return this.http.get(API_URL+'role/getrole?search='+search,httpOptions);
  }
  
  insertUpdateRole(role:Role): Observable<any> {
    return this.http.post(API_URL + 'role/insertupdaterole',role, httpOptions);
  }

  changeRolestatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'role/changeroleflag?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  getRolePermission(roleid:number,projectid:number):Observable<any>{    
    return this.http.get(API_URL+'role/getrolepermission?roleid='+roleid+'&projectid='+projectid,httpOptions);
  }

  updatePermission(id:number,roleid:number,menuid:number,type:number,flag:boolean,createdby:number):Observable<any>{    
    return this.http.get(API_URL+'role/updatepermission?id='+id+'&roleid='+roleid+'&menuid='+menuid+'&type='+type+'&flag='+flag+'&createdby='+createdby,httpOptions);
  }

  updatePermissionbunch(permission:Permission): Observable<any> {
    return this.http.post(API_URL + 'role/v2/updatepermission',permission, httpOptions);
  }
}
