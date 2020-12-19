export interface DocumentSearchRequestParams {
  query: string;
  pos: number;
  cnt: number;
}

export interface DocumentSearchResponseDataParams {
  total: number;
  pos: number;
  cnt: number;
  results: DocumentInfoParams[];
}

export interface DocumentInfoParams {
  doc_id: number;
  title: string;
  abstract: string;
  uploader: string;
  create_time: string;
  update_time: string;
}

export interface DeleteDocumentRequestParams {
  doc_id: number;
}

export interface LabelQuestionRequestParams {
  doc_id: number;
  pos: number;
  cnt: number;
}

export interface LabelQuestionResponseDataParams {
  total: number;
  pos: number;
  cnt: number;
  results: LabelQuestionInfoParams[];
}

export interface LabelQuestionInfoParams {
  faq_id: number;
  questions: LabelQuestionInfoQuestionsParams[];
  answer: string;
  start: number;
  end: number;
  editor: string;
  create_time: string;
  update_time: string;
  isOpen?: boolean; // 前端添加，非接口返回
}

export interface LabelQuestionInfoQuestionsParams {
  rc_question_id: number;
  question: string;
  answer: string;
  editor: string;
  create_time: string;
  update_time: string;
  question_type: number[];
}

export interface DocInfoRequestParams {
  doc_id: number;
}

export interface LabelRequestParams {
  doc_id: number;
  questions: LabelRequestQuestionParams[];
  answer: string;
  start: number;
  end: number;
}

export interface LabelRequestQuestionParams {
  question?: string;
  question_type?: number[];
}

export interface UpdateLabelQuestionRequestParams {
  question_id?: number; // patch 方式，id 与 其它字段分开
  question: string;
  question_type: number[];
}

export interface DeleteLabelRequestParams {
  faq_id: number;
}

export interface DeleteLabelQuestionRequestParams {
  question_id: number;
}

export interface ListOfControlObject {
  id: number;
  questionTypeInstance: string;
  questionInstance: string;
}

export interface QuestionTypeOptionsObject {
  value: number;
  label: string;
  children?: QuestionTypeOptionsObject[];
  isLeaf?: boolean;
}

export interface RowSelectedTextInfo {
  txtStart: number;
  txtEnd: number;
  answer: string;
}

export interface KeywordResponseParams {
  is_success: boolean;
}
