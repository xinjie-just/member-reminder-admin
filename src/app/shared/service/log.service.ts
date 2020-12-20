import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogSearchRequestParams } from '@shared/interface/log';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private http: HttpClient) {}

  /**
   * 获取业务日志
   */
  getLogs(params: LogSearchRequestParams): Observable<any> {
    return this.http.get(`api/system/bizLogPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}`);
  }
}
