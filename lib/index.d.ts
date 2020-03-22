import { parseTypesMap } from './_constants/shared';

export type ModeStringType = 'cors' | 'no-cors';

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

export type ErrorTextType = 'request-error' | 'forbidden' | 'timeout-error';

export type QueryParamsType = { [key: string]: string | number };

export type RequestRacerParams = {
  request: Promise<IBaseResponse>;
  fetchController: any;
};

export type ParseResponseParams = {
  response: IBaseResponse;
  parseType?: keyof typeof parseTypesMap;
  isResponseOk: boolean;
};

export type FormattedEndpointParams = {
  endpoint: string;
  queryParams?: QueryParamsType;
};
