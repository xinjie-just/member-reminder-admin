export interface RoleSearchRequestParams {
  roleName?: string;
  pageSize: number;
  pageNo: number;
}

export interface RoleSearchResponseDataParams {
  page: RoleSearchResponsePageParams;
}

export interface RoleSearchResponsePageParams {
  records: RoleSearchResponseRecordsParams[];
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

export interface RoleSearchResponseRecordsParams {
  idRole: number;
  roleName: string;
  dataState: number;
}

export interface DeleteRoleRequestParams {
  idRole: number;
}

export interface RoleAddRequestParams {
  roleName: string;
}

export interface RoleUpdateRequestParams {
  idRole: number;
  roleName: string;
}
