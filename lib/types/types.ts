import { Schema } from "joi"; // eslint-disable-line
import { parseTypesMap } from '../constants/shared';

export type ModeCorsType = 'cors' | 'no-cors';

export type ErrorsMap = { [key: string]: string } & {
  TIMEOUT_ERROR: string;
  REQUEST_DEFAULT_ERROR: string;
};

export interface IRequestParams {
  headers?: { [key: string]: string };
  body?: any;
  mode?: ModeCorsType;
  method?: string;
  endpoint: string;
  parseType?: keyof typeof parseTypesMap;
  queryParams?: { [key: string]: string };
  errorsMap: ErrorsMap;
  responseSchema: Schema;
}

export interface IBaseResponse {
  error: boolean;
  errorText: string;
  data: Record<string, any> | null;
  additionalErrors: Record<string, any> | Array<any> | null;
}

export type QueryParamsType = { [key: string]: string | number };

export type RequestRacerParams = {
  request: Promise<IBaseResponse>;
  fetchController?: any;
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
  errorTextKey: string;
  errorsMap: { [key: string]: string };
};
