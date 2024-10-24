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
export class FileuploadService {

  constructor(private http: HttpClient) { }

  uploadFile(file: any, uid: string, type: string, ismultiple: string, createdby: string): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uid", uid);
    formData.append("type", type);
    formData.append("ismultiple", ismultiple);
    formData.append("createdby", createdby);
    return this.http.post(API_URL + 'document/uploadfile', formData)
  }

  
  getDocumentById(id:number):Observable<any>{    
    return this.http.get(API_URL+'document/getdocument?userid='+id,httpOptions);
  }
}
