import { Schema } from "joi"; // eslint-disable-line
import { parseTypesMap, requestProtocolsMap } from '../constants/shared';

export type ModeCorsType = 'cors' | 'no-cors';

export type ErrorsMap = { [key: string]: string } & {
  TIMEOUT_ERROR: string;
  REQUEST_DEFAULT_ERROR: string;
};

export interface IJSONPRCRequestParams extends IRequestParams {
  id: string;
  version: {
    jsonrpc: string;
  };
  body: {
    method: string;
    params?: string | number | Array<any> | Record<string, any>;
  };
}

export interface IRequestParams {
  headers?: { [key: string]: string };
  body?: any;
  mode?: ModeCorsType;
  method: string;
  endpoint: string;
  parseType?: keyof typeof parseTypesMap;
  queryParams?: { [key: string]: string };
  errorsMap: ErrorsMap;
  responseSchema: Schema;
}

export interface IResponse {
  error: boolean;
  errorText: string;
  data: Record<string, any> | null;
  additionalErrors: Record<string, any> | Array<any> | null;
}

export interface IRESTPureResponse {
  error: boolean;
  errorText: string;
  data: Record<string, any> | null;
  additionalErrors: Record<string, any> | Array<any> | null;
}

export interface IJSONRPCPureResponse {
  jsonrpc: string;
  result?: any;
  error?: {
    code: string;
    message: string;
    additionalErrors: Record<string, any> | Array<any> | null;
  };
  id: string | number;
}

export type QueryParamsType = { [key: string]: string | number };

export type RequestRacerParams = {
  request: Promise<IResponse>;
  fetchController?: any;
  errorsMap: ErrorsMap;
  requestProtocol: keyof typeof requestProtocolsMap;
  requestId?: string | number;
};

export type ParseResponseParams = {
  response: IRESTPureResponse | IJSONRPCPureResponse;
  parseType?: keyof typeof parseTypesMap;
  isResponseOk: boolean;
};

export type FormattedEndpointParams = {
  endpoint: string;
  queryParams?: QueryParamsType;
};

export type ErrorRestConstructorParams = {
  errorTextKey: string;
  errorsMap: { [key: string]: string };
};

export type ErrorConstructorParams = {
  errorTextKey: string;
  errorsMap: { [key: string]: string };
  id?: string | number;
};

export type FormatDataTypeValidatorParamsType = {
  responseData: any; // 'cause we dont know about the structure
  responseSchema: any; // 'cause we dont know about the schema
};

export type GetIsomorphicFetchReturnsType = {
  requestFetch: () => Promise<IResponse>;
  fetchController?: AbortController;
};

export type GetIsomorphicFetchParamsType = {
  endpoint: string;
  fetchParams: Pick<
    IRequestParams & Partial<IJSONPRCRequestParams>,
    'headers' | 'body' | 'mode' | 'method'
  >;
};

export type GetFetchBodyParamsType = {
  requestProtocol: keyof typeof requestProtocolsMap;
  body: any;
  method: string;
  version?: { jsonrpc: string };
  id?: string;
};

export type ExtendedIResponse = Pick<
  IResponse,
  'data' | 'error' | 'errorText'
> & { additionalErrors?: Record<string, any> | null };
