export interface ModelSearchRequestParams {
  state: number;
  title: string;
  pos: number;
  cnt: number;
}

export interface ModelSearchResponseDataParams {
  total: number;
  pos: number;
  cnt: number;
  results: ModelInfoParams[];
}

export interface ModelInfoParams {
  model_id: number;
  title: string;
  abstract: string;
  state: number;
  inuse: number; // 上架状态，0-未上架 1-已经上架
  create_time: string;
}

export interface CreateModelRequestParams {
  title: string;
  model_id: number;
  epoch: number;
  learning_rate: number;
  batch_size: number;
  batch_accumulation: number;
}

export interface DeleteModelRequestParams {
  model_id: number;
}

export interface OnlineModelRequestParams {
  model_id?: number; // patch 方式，id 与 其它字段分开
}
