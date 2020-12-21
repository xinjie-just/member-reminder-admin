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

/*=================================*/

export interface QuestionSearchRequestParams {
  query: string;
  pos: number;
  cnt: number;
}

export interface QuestionSearchResponseDataParams {
  total: number;
  pos: number;
  cnt: number;
  results: QuestionInfoParams[];
}

export interface QuestionInfoParams {
  faq_id: number;
  question: string;
  answer: string;
  editor: string;
  create_time: string;
  update_time: string;
}

export interface CreateQuestionRequestParams {
  question: string;
  answer: string;
}

export interface DeleteQuestionRequestParams {
  faq_id: number;
}

export interface UpdateQuestionRequestParams {
  faq_id?: number; // patch 方式，id 与 其它字段分开
  question: string;
  answer: string;
}

export interface RecommendLogRequestParams {
  question: string;
}
