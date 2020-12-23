import { Injectable } from '@angular/core';
import {
  StepSearchRequestParams,
  StepDetailRequestParams,
  StepDeleteRequestParams,
  StepAddOrUpdateRequestParams,
  QueryReminderByNodeRequestParams,
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
    if (params.idStageNode) {
      return this.http.get(
        `api/stageNode/getPage?idStageNode=${params.idStageNode}&pageNo=${params.pageNo}&pageSize=${params.pageSize}`,
      );
    } else {
      return this.http.get(`api/stageNode/getPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}`);
    }
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

  /**
   * 新增或修改步骤
   * @param params StepAddOrUpdateRequestParams
   */
  addOrUpdateStep(params: StepAddOrUpdateRequestParams): Observable<any> {
    return this.http.post(`api/stageNode/saveNode`, params);
  }

  /**
   * 根据步骤ID查询该步骤所有提醒事项，用于添加提醒配置时，选择了一个步骤联动出来所有该步骤的提醒事项
   * @param params QueryReminderByNodeRequestParams
   */
  queryReminderByStep(params: QueryReminderByNodeRequestParams): Observable<any> {
    return this.http.get(`api/stageNode/queryReminderByNode?idNode=${params.idNode}`);
  }
}
