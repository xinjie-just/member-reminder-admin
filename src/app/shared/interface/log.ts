export interface OperationLogSearchRequestParams {
  pageNo: number;
  pageSize: number;
}

export interface LogSearchResponseDataParams {
  page: LogSearchResponsePageParams;
}

export interface LogSearchResponsePageParams {
  records: LogSearchResponseRecordsParams[];
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

export interface LogSearchResponseRecordsParams {
  idLog: number;
  idUser: number;
  realName: string;
  content: string;
  logTime: string;
}

// 定时任务
export interface TimingTaskSearchRequestParams {
  pageNo: number;
  pageSize: number;
}

export interface TimingTaskSearchRecordsParams {
  id: number;
  taskDesc: string;
  startTime: string;
  endTime: string;
  exception: string;
  dataState: number;
}

export interface RemindTaskSearchRequestParams {
  executed?: number; // 是否执行
  idNode?: number; //所在步骤
  pageNo: number;
  pageSize: number;
}

export interface RemindTaskSearchRecordsParams {
  id: number;
  idUser: number;
  userRealName: string;
  idNode: number;
  nodeName: string;
  idManageUser: number;
  manageUserRealName: string;
  remindType: number;
  reminder: any;
  content: any;
  planDate: number;
  actualTime: number;
  readTime: any;
  completionTime: any;
  result: any;
  dataState: number;
}
