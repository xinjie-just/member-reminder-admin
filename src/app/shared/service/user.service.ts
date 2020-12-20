import { Injectable, Inject } from '@angular/core';
import { ACLService } from '@delon/acl';
import { HttpClient } from '@angular/common/http';
import {
  LoginRequestParams,
  DeleteUserRequestParams,
  UserSearchRequestParams,
  AddUserRequestParams,
  UpdatePasswordRequestParams,
  ResetPasswordRequestParams,
  UserUpdateRealNameRequestParams,
  UserUpdateRoleRequestParams,
} from '@shared/interface/user';
import { Observable } from 'rxjs';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private acl: ACLService,
    private http: HttpClient,
    @Inject(DA_SERVICE_TOKEN) private service: ITokenService,
  ) {
    this.acl.setFull(true); // 标识当前用户为全量（即不受限），调用接口时不需要验证是否登录
  }

  /**
   * 登录
   * @param params LoginequestParams
   */
  login(params: LoginRequestParams): Observable<any> {
    return this.http.post(`api/user/phoneLogin`, params);
  }

  /**
   * 退出登录
   */
  logout(): Observable<any> {
    return this.http.get(`api/user/logout`);
  }

  /**
   * 获取登录的用户信息
   */
  getUserInfo() {
    const userInfo = {
      id: this.service.get().id,
      name: this.service.get().name,
      account: this.service.get().account,
      role: this.service.get().role,
      token: this.service.get().token,
    };
    return userInfo;
  }

  /**
   * 获取用户列表
   * @param params UserSearchRequestParams
   */
  getUers(params: UserSearchRequestParams): Observable<any> {
    return this.http.get(
      `api/user/getPage?pageNo=${params.pageNo}&pageSize=${params.pageSize}&userName=${params.userName}`,
    );
  }

  /**
   * 创建新用户
   * @param params AddUserRequestParams
   */
  createUser(params: AddUserRequestParams): Observable<any> {
    return this.http.post(`api/user/add`, params);
  }

  /**
   * 删除用户
   * @param params DeleteUserRequestParams
   */
  deleteUser(params: DeleteUserRequestParams): Observable<any> {
    return this.http.get(`api/user/admin/deleteUser?idUser=${params.idUser}`);
  }

  /**
   * 修改用户密码，只能修改自己的密码
   * @param params UpdatePasswordRequestParams
   */
  updatePassword(params: UpdatePasswordRequestParams): Observable<any> {
    return this.http.post(`api/user/modifySelfPassword`, params);
  }

  /**
   * 重置密码，只有管理员可以重置用户密码
   * @param params ResetPasswordRequestParams
   */
  resetPassword(params: ResetPasswordRequestParams): Observable<any> {
    return this.http.get(`api/user/admin/resetPassword?idUser=${params.idUser}`);
  }

  /**
   * 修改用户姓名
   * @param params UserUpdateRealNameRequestParams
   */
  updateRealName(params: UserUpdateRealNameRequestParams): Observable<any> {
    return this.http.get(`api/user/resetPassword?idUser=${params.idUser}&realName=${params.realName}`);
  }

  /**
   * 修改用户角色
   * @param params UserUpdateRoleRequestParams
   */
  updateRole(params: UserUpdateRoleRequestParams): Observable<any> {
    return this.http.get(`api/user/setUserRole?idUser=${params.idUser}&idRole=${params.idRole}`);
  }
}
