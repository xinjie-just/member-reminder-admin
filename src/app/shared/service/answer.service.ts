import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnswerTransform } from '@shared/interface/answer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  constructor(private http: HttpClient) {}

  /**
   * 获取阅读理解问答结果是否转换
   */
  getAnswerTransform(): Observable<any> {
    return this.http.get(`api/console/rc_answer_status`);
  }

  /**
   * 修改阅读理解问答结果是否转换
   * @param params FaqReadScoreRequestParams
   */
  updateAnswerTransform(params: AnswerTransform): Observable<any> {
    return this.http.patch(`api/console/modify_rc_answer_status`, params);
  }
}
