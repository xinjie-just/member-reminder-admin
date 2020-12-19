import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogTransform } from '@shared/interface/log';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private http: HttpClient) {}

  /**
   * 获取阅读理解问答结果是否转换
   */
  getLogTransform(): Observable<any> {
    return this.http.get(`api/console/rc_answer_status`);
  }

  /**
   * 修改阅读理解问答结果是否转换
   * @param params StageReadScoreRequestParams
   */
  updateLogTransform(params: LogTransform): Observable<any> {
    return this.http.patch(`api/console/modify_rc_answer_status`, params);
  }
}
