// 查询所有阶段响应参数
export interface StageSearchResponseDataParams {
  idStage: number;
  previous: number;
  stageName: string;
  sort: number;
}

// 根据阶段查询步骤
export interface StepSearchRequestParams {
  idStageNode?: number;
  pageNo: number;
  pageSize: number;
}

// 查询步骤响应参数
export interface StepSearchResponseDataParams {
  page: StepSearchResponsePageParams;
}

export interface StepSearchResponsePageParams {
  records: StepSearchResponseRecordsParams[];
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

export interface StepSearchResponseRecordsParams {
  idNode: number;
  type: number;
  parentId: number;
  previous: number;
  name: string;
  nodeBizType: number;
  duration: number;
  isBeginPreNode: number;
  sort: number;
  dataState: number;
}

// 根据步骤ID查询详情
export interface StepDetailRequestParams {
  id: number;
}

export interface StepDetailResponseDataParams {
  idNode: number;
  type: number;
  parentId: number;
  previous: number;
  name: string;
  nodeBizType: number;
  duration: number;
  isBeginPreNode: number;
  sort: number;
  dataState: number;
}

// 删除步骤
export interface StepDeleteRequestParams {
  idNode: number;
}

// 新增或修改步骤
export interface StepAddOrUpdateRequestParams {
  idNode?: number;
  type: number;
  parentId: number;
  previous: number;
  name: string;
  nodeBizType: number;
  duration: number;
  isBeginPreNode: number;
  sort: number;
  dataState?: number;
}

export interface QueryReminderByNodeRequestParams {
  idNode: number;
}

export interface QueryReminderByNodeResposeDataParams {
  idReminder: number;
  idNode: number;
  content: string;
  dataState: number;
}

// 为步骤新增或修改提醒事项
export interface ReminderSaveRequestParams {
  content: string;
  idNode: number;
  idReminder?: number;
}

// 删除提醒事项
export interface ReminderDeleteRequestParams {
  idReminder: number;
}
