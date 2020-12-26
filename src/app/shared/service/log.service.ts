import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AddTempTaskRequestParams,
  OperationLogSearchRequestParams,
  RemindTaskSearchRequestParams,
  TimingTaskSearchRequestParams,
} from '@shared/interface/log';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private http: HttpClient) {}

  /**
   * 获取业务操作日志
   */
  getOperationLogs(params: OperationLogSearchRequestParams): Observable<any> {
    return this.http.get(`api/system/admin/bizLogPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}`);
  }

  /**
   * 获取定时任务日志
   */
  getTimingLogs(params: TimingTaskSearchRequestParams): Observable<any> {
    return this.http.get(`api/system/admin/scheduleTaskPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}`);
  }

  /**
   * 获取提醒任务日志
   */
  getRemindLogs(params: RemindTaskSearchRequestParams): Observable<any> {
    if (params.idNode) {
      return this.http.get(
        `api/system/admin/remindTaskPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}&idNode=${params.idNode}&executed=${params.executed}`,
      );
    } else {
      return this.http.get(
        `api/system/admin/remindTaskPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}&executed=${params.executed}`,
      );
    }
  }

  /**
   * 新增临时提醒任务
   * @param params AddTempTaskRequestParams
   */
  addTempTask(params: AddTempTaskRequestParams): Observable<any> {
    return this.http.get(
      `api/system/addTempTask?idRole=${params.idRole}&content=${params.content}&remindDate=${params.remindDate}`,
    );
  }
}
