import { Injectable } from '@angular/core';
import {
  RoleSearchRequestParams,
  DeleteRoleRequestParams,
  RoleAddRequestParams,
  RoleUpdateRequestParams,
} from '@shared/interface/role';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}
  /**
   * 角色搜索
   * @param params RoleSearchRequestParams
   */
  getRoles(params: RoleSearchRequestParams): Observable<any> {
    if (params.roleName) {
      return this.http.get(
        `api/role/getPage?roleName=${params.roleName}&pageNo=${params.pageNo}&pageSize=${params.pageSize}`,
      );
    } else {
      return this.http.get(`api/role/getPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}`);
    }
  }

  /**
   * 删除角色
   * @param params DeleteRoleRequestParams
   */
  deleteRole(params: DeleteRoleRequestParams): Observable<any> {
    return this.http.get(`api/role/admin/deleteById?idRole=${params.idRole}`);
  }

  /**
   * 新增角色
   * @param params RoleAddRequestParams
   */
  addeRole(params: RoleAddRequestParams): Observable<any> {
    return this.http.post(`api/role/save`, params);
  }

  /**
   * 修改角色
   * @param params RoleUpdateRequestParams
   */
  updateRole(params: RoleUpdateRequestParams): Observable<any> {
    return this.http.post(`api/role/save`, params);
  }
}
