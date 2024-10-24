import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TrainingTopic } from 'src/app/interfaces/trainingtopic';
import { AssignTopic } from 'src/app/interfaces/assigntopic';


const API_URL = environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TrainingtopicService {

  constructor(private http: HttpClient) { }

  insertUpdateTopic(topic: TrainingTopic): Observable<any> {
    return this.http.post(API_URL + 'traineemaster/insertupdatetopic', topic, httpOptions);
  }

  getTrainingTopics(trainingtechnologyid:number,search: string,pageno:number,pagesize:number): Observable<any> {
    return this.http.get(API_URL + 'traineemaster/gettopics?trainingtechnologyid='+trainingtechnologyid+'&search=' + search+'&pageno='+pageno+'&pagesize='+pagesize, httpOptions);
  }
  
  changeTopicstatus(id:number,type:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.get(API_URL+'traineemaster/changestatustopics?id='+id+'&type='+type+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  gettopic(trainingtechnologyid:number,candidateid:number,flag:number): Observable<any> {
    return this.http.get(API_URL + 'traineemaster/v2/gettopic?trainingtechnologyid=' + trainingtechnologyid +'&candidateid=' + candidateid +'&flag='+flag , httpOptions);
  }

  getsubtopic(topicid:number): Observable<any> {
    return this.http.get(API_URL + 'traineemaster/getsubtopic?topicid=' + topicid, httpOptions);
  }

  getassignedtopic(candidateid:number,trainingtechnologyid:number): Observable<any> {
    return this.http.get(API_URL + 'traineemaster/getassignedtopics?candidateid=' + candidateid+'&trainingtechnologyid='+ trainingtechnologyid, httpOptions);
  }

  assigntopic(assigntopic:AssignTopic): Observable<any> {
    return this.http.post(API_URL + 'traineemaster/insertassigntopic',assigntopic, httpOptions);
  }

  assignQuiz(id: number, uid: number, quizid: number, trainingtechnologyid:number,expireddate: string,createdby:number): Observable<any> {
    return this.http.post(API_URL + 'TraineeQuiz/assignquiztrainee', {
      id,
      uid,
      quizid,
      trainingtechnologyid,
      expireddate,
      createdby
    }, httpOptions);
  }

  assignTechnicalTest(candidateid: number, typeid:number,trainingtechnologyid:number,technicaltestid: number, startdate:string,enddate:string,assignby:number): Observable<any> {
    return this.http.post(API_URL + 'traineetechnical/assigntechnicaltesttrainee', {
      candidateid,
      typeid,
      trainingtechnologyid,
      technicaltestid,
      startdate,
      enddate,
      assignby,
    }, httpOptions);
  }

  uploadtopic(file: any, trainingtechnologyid: string, uid: string, type: string, ismultiple: string, createdby: string): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uid", uid);
    formData.append("trainingtechnologyid", trainingtechnologyid);
    formData.append("type", type);
    formData.append("ismultiple", ismultiple);
    formData.append("createdby", createdby);
    return this.http.post(API_URL + 'traineemaster/uploadbulktopics', formData)
  }
  
}
