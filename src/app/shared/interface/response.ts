export interface ResponseParams {
  code?: number;
  message?: string;
  data?: any;
}

export interface MenuObj {
  text?: string;
  link?: string;
  group?: boolean;
  icon?: string;
  disabled?: boolean;
  children?: MenuObj[];
}
