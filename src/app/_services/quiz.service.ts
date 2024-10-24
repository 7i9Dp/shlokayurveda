import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Question } from '../interfaces/question';
import { Quiz } from '../interfaces/quiz';

const API_URL =environment.apiURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }
  
  getQuiz(search:string):Observable<any>{    
    return this.http.get(API_URL+'quiz/getquizdata?search='+search,httpOptions);
  }
  
  insertUpdateQuiz(quiz:Quiz): Observable<any> {
    return this.http.post(API_URL + 'quiz/insertupdatequiz',quiz, httpOptions);
  }

  deleteQuiz(id:number,userid:number):Observable<any>{    
    return this.http.delete(API_URL+'quiz/deletequiz?id='+id+'&userid='+userid,httpOptions);
  }

  getQuestion(qid:number,search:string):Observable<any>{    
    return this.http.get(API_URL+'quiz/getquestiondetails?quizId='+qid+'&search='+search,httpOptions);
  }

  getQuestionPagination(qid:number,search:string,pageno:number,pagesize:number):Observable<any>{    
    return this.http.get(API_URL+'quiz/v2/getquestiondetails?quizId='+qid+'&search='+search+'&pageno='+pageno+'&pagesize='+pagesize,httpOptions);
  }

  getQuestionById(questionid:number):Observable<any>{    
    return this.http.get(API_URL+'quiz/getquestionbyid?questionid='+questionid,httpOptions);
  }

  insertUpdateQuestion(question:Question): Observable<any> {
    return this.http.post(API_URL + 'quiz/insertupdatequestion',question, httpOptions);
  }

  deleteQuestion(id:number,userid:number):Observable<any>{    
    return this.http.delete(API_URL+'quiz/deletquestion?id='+id+'&userid='+userid,httpOptions);
  }

  changestatusQuestion(id:number,flag:boolean,userid:number):Observable<any>{    
    return this.http.put(API_URL+'quiz/inactivequestion?id='+id+'&flag='+flag+'&userid='+userid,httpOptions);
  }

  getQuizReport(campusid:number,quizid:number,equation:number,marks:number,search:string):Observable<any>{    
    return this.http.get(API_URL+'quiz/getquizsubmissionreport?campusid='+campusid+'&quizid='+quizid+'&equation='+equation+'&marks='+marks+'&search='+search,httpOptions);
  }

  changestatusQuiz(id:number,flag:boolean,type:number,userid:number):Observable<any>{    
    return this.http.put(API_URL+'quiz/changequizstatus?id='+id+'&flag='+flag+'&type='+type+'&userid='+userid,httpOptions);
  }

  getAssignquizlist(quizid:number,campusid:number,technologyid:number,search:string):Observable<any>{    
    return this.http.get(API_URL+'quiz/getassignquiz?quizid='+quizid+'&campusid='+campusid+'&technologyid='+technologyid+'&search='+search,httpOptions);
  }

  getAssignquizlistPagination(quizid:number,campusid:number,technologyid:number,search:string,pageno:number,pagesize:number):Observable<any>{    
    return this.http.get(API_URL+'quiz/v2/getassignquiz?quizid='+quizid+'&campusid='+campusid+'&technologyid='+technologyid+'&search='+search+'&pageno='+pageno+'&pagesize='+pagesize,httpOptions);
  }

  uploadQuestion(file: any, quizid: string, uid: string, type: string, ismultiple: string, createdby: string): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uid", uid);
    formData.append("quizid", quizid);
    formData.append("type", type);
    formData.append("ismultiple", ismultiple);
    formData.append("createdby", createdby);
    return this.http.post(API_URL + 'quiz/uploadbulkquestion', formData)
  }  

  getCampus():Observable<any>{    
    return this.http.get(API_URL+'master/getregcampus',httpOptions);
  }

  getQuizSubmissionDetails(assignid:number,uid:number):Observable<any>{    
    return this.http.get(API_URL+'quiz/getquizsubmissiondetails?assignid='+assignid+'&userid='+uid,httpOptions);
  }

  getAppearQuizReport(campusid:number,quizid:number,equation:number,marks:number,completed:number,search:string):Observable<any>{    
    return this.http.get(API_URL+'quiz/getappearquizreport?campusid='+campusid+'&quizid='+quizid+'&equation='+equation+'&marks='+marks+'&completed='+completed+'&search='+search,httpOptions);
  }

  updatedEligible(clid:string,updatedby:number):Observable<any>{    
    return this.http.put(API_URL+'quiz/updateeligible?clid='+clid+'&updatedby='+updatedby,httpOptions);
  }

  getEligiblecandidateReport(campusid:number,quizid:number,search:string):Observable<any>{    
    return this.http.get(API_URL+'quiz/geteligiblecandidate?campusid='+campusid+'&quizid='+quizid+'&search='+search,httpOptions);
  }

  getFinalcandidateReport(campusid:number,quizid:number,search:string):Observable<any>{    
    return this.http.get(API_URL+'quiz/getcandidateresult?campusid='+campusid+'&quizid='+quizid+'&search='+search,httpOptions);
  }

  getAllCampus():Observable<any>{    
    return this.http.get(API_URL+'master/getallcampus',httpOptions);
  }

  getFinalcandidateReportV2(campusid:number,quizid:string,search:string):Observable<any>{    
    return this.http.get(API_URL+'quiz/v2/getcandidateresult?campusid='+campusid+'&quizid='+quizid+'&search='+search,httpOptions);
  }
}
