import { Schema } from "joi"; // eslint-disable-line
import { parseTypesMap, requestProtocolsMap } from "../constants/shared";

export type ModeCorsType = "cors" | "no-cors";

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
  requestProtocol: keyof typeof requestProtocolsMap;
  id?: string | number;
}

export interface IRESTResponse {
  error: boolean;
  errorText: string;
  data: Record<string, any> | null;
  additionalErrors: Record<string, any> | Array<any> | null;
}

export interface IJSONRPCResponse {
  jsonrpc: string;
  result?: any;
  error?: { [key: string]: string };
  id: string | number;
}

export type QueryParamsType = { [key: string]: string | number };

export type RequestRacerParams = {
  request: Promise<IRESTResponse | IJSONRPCResponse>;
  fetchController?: any;
  errorsMap: ErrorsMap;
  requestProtocol: keyof typeof requestProtocolsMap;
  idOfRequest?: string | number;
};

export type ParseResponseParams = {
  response: IRESTResponse | IJSONRPCResponse;
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

export type ErrorJSONRPCConstructorParams = {
  errorTextKey: string;
  errorsMap: { [key: string]: string };
  id?: string | number;
};
