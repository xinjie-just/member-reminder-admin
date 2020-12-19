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
