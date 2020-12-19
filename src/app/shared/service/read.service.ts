import { Injectable } from '@angular/core';
import {
  DocumentSearchRequestParams,
  DeleteDocumentRequestParams,
  LabelQuestionRequestParams,
  DocInfoRequestParams,
  LabelRequestParams,
  DeleteLabelRequestParams,
  DeleteLabelQuestionRequestParams,
  UpdateLabelQuestionRequestParams,
} from '@shared/interface/read';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReadService {
  constructor(private http: HttpClient) {}
  /**
   * 文档搜索
   * @param params DocumentSearchRequestParams
   */
  getDocuments(params: DocumentSearchRequestParams): Observable<any> {
    return this.http.get(`api/console/rc_search_list?query=${params.query}&pos=${params.pos}&cnt=${params.cnt}`);
  }

  /**
   * 删除文档
   * @param params DeleteDocumentRequestParams
   */
  deleteDocument(params: DeleteDocumentRequestParams): Observable<any> {
    return this.http.delete(`api/console/rc_delete/${params.doc_id}`);
  }

  /**
   * 已标注文档问答列表
   * @param params LabelQuestionRequestParams
   */
  labelQuestion(params: LabelQuestionRequestParams): Observable<any> {
    return this.http.get(`api/console/rc_doc_tag_list?doc_id=${params.doc_id}&pos=${params.pos}&cnt=${params.cnt}`);
  }

  /**
   * 阅读理解文档信息
   * @param params DocInfoRequestParams
   */
  getDocInfo(params: DocInfoRequestParams): Observable<any> {
    return this.http.get(`api/console/rc_doc_info?doc_id=${params.doc_id}`);
  }

  /**
   * 阅读理解标注
   * @param params LabelRequestParams
   */
  label(params: LabelRequestParams): Observable<any> {
    return this.http.post(`api/console/rc_doc_tag`, params);
  }

  /**
   * 阅读理解标注修改（问题修改）
   * @param params UpdateLabelQuestionRequestParams
   */
  updateLabelQuestion(question_id: number, params: UpdateLabelQuestionRequestParams): Observable<any> {
    return this.http.patch(`api/console/modify_rc_doc_tag/${question_id}`, params);
  }

  /**
   * 阅读理解删除（问题删除）
   * @param params DeleteLabelQuestionRequestParams
   */
  deleteLabelQuestion(params: DeleteLabelQuestionRequestParams): Observable<any> {
    return this.http.delete(`api/console/delete_rc_doc_question/${params.question_id}`);
  }

  /**
   * 阅读理解删除（问题和答案整体删除）
   * @param params DeleteLabelRequestParams
   */
  deleteLabel(params: DeleteLabelRequestParams): Observable<any> {
    return this.http.delete(`api/console/delete_rc_doc_tag/${params.faq_id}`);
  }

  /**
   * 阅读理解关键词重新刷新接口
   */
  refreshKeyword(): Observable<any> {
    return this.http.get(`api/console/rc_keywords`);
  }
}
