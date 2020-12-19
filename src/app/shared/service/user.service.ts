import { Injectable, Inject } from '@angular/core';
import { ACLService } from '@delon/acl';
import { HttpClient } from '@angular/common/http';
import {
  UserRequestParams,
  CreateUserRequestParams,
  LoginRequestParams,
  DeleteUserRequestParams,
  UpdateUserRequestParams,
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

  get userName(): string {
    return localStorage.getItem('userName') || '';
  }

  set userName(userName: string) {
    localStorage.setItem('userName', userName);
  }

  get userRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  set userRole(userRole: string) {
    localStorage.setItem('userRole', userRole);
  }

  get userId(): string {
    return localStorage.getItem('userId') || '';
  }

  set userId(userId: string) {
    localStorage.setItem('userId', userId);
  }

  /**
   * 获取用户列表
   * @param params UserRequestParams
   */
  getUers(params: UserRequestParams): Observable<any> {
    return this.http.get(`api/console/get_user_list?query=${params.query}&pos=${params.pos}&cnt=${params.cnt}`);
  }

  /**
   * 创建新用户
   * @param params CreateUserRequestParams
   */
  createUser(params: CreateUserRequestParams): Observable<any> {
    return this.http.post(`api/console/add_user`, params);
  }

  /**
   * 删除用户
   * @param params DeleteUserRequestParams
   */
  deleteUser(params: DeleteUserRequestParams): Observable<any> {
    return this.http.delete(`api/console/delete_user/${params.dst_id}`);
  }

  /**
   * 修改用户密码
   * @param params UpdateUserRequestParams
   */
  updateUser(dst_id: number, params: UpdateUserRequestParams): Observable<any> {
    return this.http.patch(`api/console/modify_user/${dst_id}`, params);
  }
}
