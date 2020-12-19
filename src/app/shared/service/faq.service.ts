import { Injectable } from '@angular/core';
import {
  QuestionSearchRequestParams,
  CreateQuestionRequestParams,
  DeleteQuestionRequestParams,
  UpdateQuestionRequestParams,
  RecommendAnswerRequestParams,
} from '@shared/interface/faq';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  /**
   * 问题搜索
   * @param params QuestionSearchRequestParams
   */
  getQuestions(params: QuestionSearchRequestParams): Observable<any> {
    return this.http.get(`api/console/faq_search_list?query=${params.query}&pos=${params.pos}&cnt=${params.cnt}`);
  }

  /**
   * 创建问题
   * @param params CreateQuestionRequestParams
   */
  createQuestion(params: CreateQuestionRequestParams): Observable<any> {
    return this.http.post(`api/console/faq_add`, params);
  }

  /**
   * 删除问题
   * @param params DeleteQuestionRequestParams
   */
  deleteQuestion(params: DeleteQuestionRequestParams): Observable<any> {
    return this.http.delete(`api/console/faq_delete/${params.faq_id}`);
  }

  /**
   * 修改问题
   * @param params UpdateQuestionRequestParams
   */
  updateQuestion(id: number, params: UpdateQuestionRequestParams): Observable<any> {
    return this.http.patch(`api/console/faq_modify/${id}`, params);
  }

  /**
   * 推荐答案
   * @param params RecommendAnswerRequestParams
   */
  recommendAnswer(params: RecommendAnswerRequestParams): Observable<any> {
    return this.http.get(`api/console/faq_recommend?question=${params.question}`);
  }
}
