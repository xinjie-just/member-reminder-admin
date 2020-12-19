import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DeleteRemindRequestParams,
  RemindSearchRequestParams,
  OnlineRemindRequestParams,
  CreateRemindRequestParams,
} from '@shared/interface/remind';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RemindService {
  constructor(private http: HttpClient) {}

  /**
   * 模型搜索
   * @param params RemindSearchRequestParams
   */
  getReminds(params: RemindSearchRequestParams): Observable<any> {
    return this.http.get(
      `api/console/model_list?state=${params.state}&title=${params.title}&pos=${params.pos}&cnt=${params.cnt}`,
    );
  }

  /**
   * 删除模型
   * @param params DeleteRemindRequestParams
   */
  deleteRemind(params: DeleteRemindRequestParams): Observable<any> {
    return this.http.delete(`api/console/model_delete/${params.model_id}`);
  }

  /**
   * 模型上线
   * @param params OnlineRemindRequestParams
   */
  onlineRemind(model_id: number, params: OnlineRemindRequestParams): Observable<any> {
    return this.http.patch(`api/console/model_online/${model_id}`, params);
  }

  /**
   * 新增模型(模型训练)
   * @param params CreateRemindRequestParams
   */
  createRemind(params: CreateRemindRequestParams): Observable<any> {
    return this.http.post(`api/console/model_add`, params);
  }
}
