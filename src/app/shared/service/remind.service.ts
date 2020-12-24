import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  addOrUpdateRemindRequestParams,
  DeleteRemindRequestParams,
  lockRemindRequestParams,
  RemindDetailSearchRequestParams,
  RemindSearchRequestParams,
  unlockRemindRequestParams,
} from '@shared/interface/remind';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RemindService {
  constructor(private http: HttpClient) {}

  /**
   * 删除提醒配置
   * @param params DeleteRemindRequestParams
   */
  deleteRemind(params: DeleteRemindRequestParams): Observable<any> {
    return this.http.get(`api/remindConfig/admin/deleteConfig?idConfig=${params.idConfig}`);
  }

  /**
   *  根据步骤ID分页查询提醒配置
   * @param params RemindSearchRequestParams
   */
  getReminds(params: RemindSearchRequestParams): Observable<any> {
    if (params.idNode) {
      return this.http.get(
        `api/remindConfig/getPage?idNode=${params.idNode}&pageNo=${params.pageNo}&pageSize=${params.pageSize}`,
      );
    } else {
      return this.http.get(`api/remindConfig/getPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}`);
    }
  }

  /**
   *  根据ID查询提醒配置
   * @param params RemindDetailSearchRequestParams
   */
  getRemind(params: RemindDetailSearchRequestParams): Observable<any> {
    return this.http.get(`api/remindConfig/getById?id=${params.id}`);
  }

  /**
   *  新增或修改提醒配置
   * @param params addOrUpdateRemindRequestParams
   */
  addOrUpdateRemind(params: addOrUpdateRemindRequestParams): Observable<any> {
    return this.http.post(`api/remindConfig/saveNodeRemindConfig`, params);
  }

  /**
   *  提醒配置锁定
   * @param params lockRemindRequestParams
   */
  lockRemind(params: lockRemindRequestParams): Observable<any> {
    return this.http.get(`api/remindConfig/admin/lockConfig?idConfig=${params.idConfig}`);
  }

  /**
   *  提醒配置解锁
   * @param params unlockRemindRequestParams
   */
  unlockRemind(params: unlockRemindRequestParams): Observable<any> {
    return this.http.get(`api/remindConfig/admin/unlockConfig?idConfig=${params.idConfig}`);
  }
}
