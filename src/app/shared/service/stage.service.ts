import { Injectable } from '@angular/core';
import {
  QuestionSearchRequestParams,
  CreateQuestionRequestParams,
  DeleteQuestionRequestParams,
  UpdateQuestionRequestParams,
  RecommendLogRequestParams,
  StepSearchRequestParams,
  StepDetailRequestParams,
  StepDeleteRequestParams,
} from '@shared/interface/stage';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  constructor(private http: HttpClient) {}

  /**
   * 查询所有阶段
   */
  getStages(): Observable<any> {
    return this.http.get(`api/stageNode/queryAllStage`);
  }

  /**
   * 根据阶段查询步骤
   * @param params StepSearchRequestParams
   */
  getSteps(params: StepSearchRequestParams): Observable<any> {
    return this.http.get(
      `api/stageNode/getPage?idStageNode=${params.idStageNode}&pageNo=${params.pageNo}&pageSize=${params.pageSize}`,
    );
  }

  /**
   * 根据步骤ID查询详细信息
   * @param params StepDetailRequestParams
   */
  getStepDetail(params: StepDetailRequestParams): Observable<any> {
    return this.http.get(`api/stageNode/getNodeById?id=${params.id}`);
  }

  /**
   * 删除步骤
   * @param params StepDeleteRequestParams
   */
  deleteStep(params: StepDeleteRequestParams): Observable<any> {
    return this.http.get(`api/stageNode/admin/deleteNode?idNode=${params.idNode}`);
  }

  /*==================================================*/

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
   * @param params RecommendLogRequestParams
   */
  recommendLog(params: RecommendLogRequestParams): Observable<any> {
    return this.http.get(`api/console/faq_recommend?question=${params.question}`);
  }
}
