export interface UserRequestParams {
  query: string;
  pos: number;
  cnt: number;
}

export interface UserResponseDataParams {
  total: number;
  pos: number;
  cnt: number;
  results: UserInfoParams[];
}

export interface UserInfoParams {
  id: number;
  account: string;
  name: string;
  role: string;
  last_update_time: string;
  disabled?: boolean;
}

export interface LoginRequestParams {
  phone: string;
  password: string;
}

export interface CreateUserRequestParams {
  role: string;
  name: string;
  account: string;
  password: string;
}

export interface DeleteUserRequestParams {
  dst_id: number;
}

export interface UpdateUserRequestParams {
  dst_id?: number; // patch 方式，id 与 其它字段分开
  password: string;
}
