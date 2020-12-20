export interface LogSearchRequestParams {
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
