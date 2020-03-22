export type ModeStringType = 'cors' | 'no-cors';

export const parseTypesMap: IParseTypesMap = {
  json: 'json',
  blob: 'blob',
};

export interface IRequestParams {
  endpoint: string;
  headers?: { [key: string]: string };
  body?: string | FormData;
  mode?: ModeStringType;
  parseType?: keyof typeof parseTypesMap;
  queryParams?: { [key: string]: string };
  method?: string;
}

export interface IBaseResponse {
  error: boolean;
  errorText: string;
  data: any;
}

export interface IParseTypesMap {
  json: 'json';
  blob: 'blob';
}

export type ErrorTextType = 'request-error' | 'forbidden' | 'timeout-error';
