import { parseTypesMap } from './_constants/shared';

export type ModeCorsType = 'cors' | 'no-cors';

export type ErrorsMap = { [key: string]: string } & {
  TIMEOUT_ERROR: string;
  REQUEST_DEFAULT_ERROR: string;
};

export interface IRequestParams {
  endpoint: string;
  headers?: { [key: string]: string };
  body?: string | FormData;
  mode?: ModeCorsType;
  parseType?: keyof typeof parseTypesMap;
  queryParams?: { [key: string]: string };
  method?: string;
  errorsMap: ErrorsMap;
}

export interface IBaseResponse {
  error: boolean;
  errorText: string;
  data: any;
}

export type QueryParamsType = { [key: string]: string | number };

export type RequestRacerParams = {
  request: Promise<IBaseResponse>;
  fetchController: any;
  errorsMap: ErrorsMap;
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

export type ErrorTextParams = {
  errorText: string;
  errorsMap: { [key: string]: string };
};
