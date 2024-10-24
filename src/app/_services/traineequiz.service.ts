import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TraineeQuestion } from '../interfaces/traineequestion';
import { TraineeQuiz } from '../interfaces/TraineeQuiz';
const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class TraineequizService {

  constructor(private http: HttpClient) { }

  insertUpdateQuiz(traineequiz:TraineeQuiz): Observable<any> {
    return this.http.post(API_URL + 'TraineeQuiz/insertupdatetraineequiz',traineequiz, httpOptions);
  }

  getQuiz(search:string):Observable<any>{    
    return this.http.get(API_URL+'TraineeQuiz/gettraineequizdata?search='+search,httpOptions);
  }

  deleteQuiz(id:number,userid:number):Observable<any>{    
    return this.http.delete(API_URL+'TraineeQuiz/deletetraineequiz?id='+id+'&userid='+userid,httpOptions);
  }

  changestatusQuiz(id:number,flag:boolean,type:number,userid:number):Observable<any>{    
    return this.http.put(API_URL+'TraineeQuiz/changetraineequizstatus?id='+id+'&flag='+flag+'&type='+type+'&userid='+userid,httpOptions);
  }

  getQuestionTraineePagination(qid:number,search:string,pageno:number,pagesize:number):Observable<any>{    
    return this.http.get(API_URL+'TraineeQuiz/v2/getquestiontraineedetails?quizId='+qid+'&search='+search+'&pageno='+pageno+'&pagesize='+pagesize,httpOptions);
  }

  insertUpdateQuestion(traineequestion:TraineeQuestion): Observable<any> {
    return this.http.post(API_URL + 'TraineeQuiz/insertupdatequestion',traineequestion, httpOptions);
  }

  getQuestionById(questionid:number):Observable<any>{    
    return this.http.get(API_URL+'TraineeQuiz/getquestiontraineebyid?questionid='+questionid,httpOptions);
  }

  deleteQuestion(id:number,userid:number):Observable<any>{    
    return this.http.delete(API_URL+'TraineeQuiz/deletquestiontrainee?id='+id+'&userid='+userid,httpOptions);
  }

  changestatusQuestion(id:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.put(API_URL+'TraineeQuiz/inactivequestiontrainee?id='+id+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  uploadQuestion(file: any, quizid: string, uid: string, type: string, ismultiple: string, createdby: string): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uid", uid);
    formData.append("quizid", quizid);
    formData.append("type", type);
    formData.append("ismultiple", ismultiple);
    formData.append("createdby", createdby);
    return this.http.post(API_URL + 'TraineeQuiz/uploadbulkquestiontrainee', formData)
  }

  getquizbyavialquestion():Observable<any>{
    return this.http.get(API_URL+'TraineeQuiz/getquiztrainee',httpOptions);
  }
  

}
