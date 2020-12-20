// 获取用户信息请求参数
export interface UserSearchRequestParams {
  userName?: string;
  pageSize: number;
  pageNo: number;
}

// 获取用户信息响应参数
export interface UserSearchResponseDataParams {
  page: UserSearchResponsePageParams;
}

export interface UserSearchResponsePageParams {
  records: UserSearchResponseRecordsParams[];
  total: number;
  size: number;
  current: number;
  orders?: any[];
  optimizeCountSql?: boolean;
  hitCount?: boolean;
  countId?: number;
  maxLimit?: number;
  searchCount?: boolean;
  pages?: number;
}

export interface UserSearchResponseRecordsParams {
  idUser: number;
  idRole: number;
  phoneNum: string;
  openId: any;
  realName: string;
  startTime: string;
  lastLoginTime: string;
  dataState: number;
}

export interface LoginRequestParams {
  phone: string;
  password: string;
}

// 添加用户
export interface AddUserRequestParams {
  idRole: number;
  idUser?: number;
  phoneNum: string;
  realName: string;
}

// 根据用户ID删除用户
export interface DeleteUserRequestParams {
  idUser: number;
}

// 根据用户ID重置密码为手机号后6位
export interface ResetPasswordRequestParams {
  idUser: number;
}

// 用户自己修改密码
export interface UpdatePasswordRequestParams {
  phone?: string;
  idUser: number;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// 修改用户姓名
export interface UserUpdateRealNameRequestParams {
  idUser: number;
  realName: string;
}

// 修改用户角色
export interface UserUpdateRoleRequestParams {
  idUser: number;
  idRole: number;
}

// 登录的用户信息
export interface CurrentUserInfo {
  lastLoginTime: string;
  phone: string;
  realName: string;
  roleId: number;
  startTime: string;
  token: string;
  userId: number;
  userState: number;
}
