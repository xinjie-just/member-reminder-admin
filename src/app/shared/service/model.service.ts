import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DeleteModelRequestParams,
  ModelSearchRequestParams,
  OnlineModelRequestParams,
  CreateModelRequestParams,
} from '@shared/interface/model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  constructor(private http: HttpClient) {}

  /**
   * 模型搜索
   * @param params ModelSearchRequestParams
   */
  getModels(params: ModelSearchRequestParams): Observable<any> {
    return this.http.get(
      `api/console/model_list?state=${params.state}&title=${params.title}&pos=${params.pos}&cnt=${params.cnt}`,
    );
  }

  /**
   * 删除模型
   * @param params DeleteModelRequestParams
   */
  deleteModel(params: DeleteModelRequestParams): Observable<any> {
    return this.http.delete(`api/console/model_delete/${params.model_id}`);
  }

  /**
   * 模型上线
   * @param params OnlineModelRequestParams
   */
  onlineModel(model_id: number, params: OnlineModelRequestParams): Observable<any> {
    return this.http.patch(`api/console/model_online/${model_id}`, params);
  }

  /**
   * 新增模型(模型训练)
   * @param params CreateModelRequestParams
   */
  createModel(params: CreateModelRequestParams): Observable<any> {
    return this.http.post(`api/console/model_add`, params);
  }
}
