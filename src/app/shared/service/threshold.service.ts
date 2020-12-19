import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FaqReadScoreRequestParams } from '@shared/interface/threshold';

@Injectable({
  providedIn: 'root',
})
export class ThresholdService {
  constructor(private http: HttpClient) {}

  /**
   * FAQ和阅读理解阈值获取
   */
  getFAQAndReadThreshold(): Observable<any> {
    return this.http.get(`api/console/faq_rc_score`);
  }

  /**
   * FAQ和阅读理解阈值更新
   * @param params FaqReadScoreRequestParams
   */
  updateFAQAndReadThreshold(params: FaqReadScoreRequestParams): Observable<any> {
    return this.http.patch(`api/console/faq_rc_score`, params);
  }
}
