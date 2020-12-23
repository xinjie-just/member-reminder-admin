export interface RemindSearchRequestParams {
  idNode?: number; // 步骤ID
  pageNo: number;
  pageSize: number;
}

// 获取用户信息响应参数
export interface RemindSearchResponseDataParams {
  page: RemindSearchResponsePageParams;
}

export interface RemindSearchResponsePageParams {
  records: RemindSearchResponseRecordsParams[];
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

export interface RemindSearchResponseRecordsParams {
  id: number;
  idNode: number;
  idRole: number;
  remindType: number;
  idReminder: number;
  content: string;
  remindBatchNum: number;
  remindTimes: number;
  remindLeadDay: number;
  intervalDuration: number;
  dataState: number;
  stageName: string;
  nodeName: string;
  reminder: string;
  roleName: string;
}

// 删除提醒配置请求参数
export interface DeleteRemindRequestParams {
  idConfig: number;
}

// 根据ID查询提醒配置
export interface RemindDetailSearchRequestParams {
  id: number;
}

//新增或修改提醒配置
export interface addOrUpdateRemindRequestParams {
  id?: number;
  content: string;
  idNode: number;
  idReminder: number;
  idRole: number;
  intervalDuration: number;
  remindBatchNum: number;
  remindLeadDay: number;
  remindTimes: number;
  remindType: number;
}
