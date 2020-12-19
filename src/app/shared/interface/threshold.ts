export interface FaqReadScoreRequestParams {
  score_id?: number;
  score: number;
}

export interface ThresholdInfoResponse {
  answer_type: string;
  create_time: string;
  score: number;
  score_id: number;
  update_time: string;
}
