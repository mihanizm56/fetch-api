import { Schema } from "joi"; // eslint-disable-line
import { parseTypesMap, requestProtocolsMap } from '../constants/shared';

export type ModeCorsType = 'cors' | 'no-cors';

export type ErrorsMap = {
  [key: string]: {
    [key: string]: string;
  };
} & {
  TIMEOUT_ERROR: {
    ru: string;
  };
  REQUEST_DEFAULT_ERROR: {
    ru: string;
  };
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

export type FormatResponseRESTDataOptionsType = {
  errorsMap: ErrorsMap;
  locale: string;
  isErrorTextStraightToOutput?: boolean;
} & IRESTPureResponse;

export type FormatResponseJSONRPCDataOptionsType = {
  errorsMap: ErrorsMap;
  locale: string;
  isErrorTextStraightToOutput?: boolean;
} & IJSONRPCPureResponse;

export type ResponseValidateType = {
  response: any;
  schema: Schema;
  prevId?: string;
};

export type ExtraValidationCallback = ({
  response,
  schema,
  prevId,
}: ResponseValidateType) => boolean;

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
  locale?: string;
  isErrorTextStraightToOutput?: boolean;
  extraValidationCallback?: ExtraValidationCallback;
}

export type ComplexRequestParams = Omit<
  IRequestParams,
  'method' | 'requestProtocol' | 'parseType'
> & {
  body: any;
};

export type SimpleRequestParams = Omit<
  IRequestParams,
  'method' | 'requestProtocol' | 'parseType'
>;

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

export type JSONRPCErrorType = {
  code: string;
  message: string;
  data: {
    err: string;
    trKey: string;
  };
};

export interface IJSONRPCPureResponse {
  jsonrpc: string;
  result?: any;
  error?: JSONRPCErrorType;
  id: string | number;
}

export type QueryParamsType = { [key: string]: string | number };

export type RequestRacerParams = {
  request: Promise<IResponse>;
  fetchController?: any;
  errorsMap: ErrorsMap;
  requestId?: string | number;
  locale: string;
  isErrorTextStraightToOutput?: boolean;
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

export type ErrorConstructorParams = {
  errorTextKey: string;
  errorsMap: ErrorsMap;
  locale: string;
  isErrorTextStraightToOutput?: boolean;
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

export type GetCompareIdsParams = { requestId: string; responceId: string };

export type GetIsSchemaResponseValidParams = {
  data: any;
  error: boolean;
  schema: Schema;
};

export type GetIsJSONRPCFormatResponseValidParams = {
  response: IJSONRPCPureResponse;
  prevId: string | number;
};

export abstract class ResponseFormatter {
  public abstract getFormattedResponse: () => IResponse;
}

export type FormatResponseParamsType = {
  locale: string;
  errorsMap: ErrorsMap;
  protocol: keyof typeof requestProtocolsMap;
  isErrorTextStraightToOutput?: boolean;
} & IRESTPureResponse &
  IJSONRPCPureResponse;

export interface IFormatResponseFactory {
  createFormatter: (params: FormatResponseParamsType) => ResponseFormatter;
}

export type GetFormatValidateMethodParams = {
  protocol: keyof typeof requestProtocolsMap;
  extraValidationCallback?: ExtraValidationCallback;
};
