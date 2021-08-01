/* eslint-disable max-classes-per-file */

import {
  ICacheMap,
  parseTypesMap,
  requestProtocolsMap,
  TRACING_ERRORS,
} from '@/constants';

export type ErrorTracingType =
  | null
  | typeof TRACING_ERRORS[keyof typeof TRACING_ERRORS];

export type ModeCorsType = 'cors' | 'no-cors';

export type TranslateFunctionType = (
  key: string,
  options?: Record<string, any> | null,
) => string;

export type SetResponseTrackCallbackOptions = {
  endpoint: string;
  method: Pick<RequestInit, 'method'>;
  requestBody: Pick<RequestInit, 'body'>;
  requestHeaders: Record<string, string>;
  requestCookies: string;
  response: Response;
  responseBody: any; // because we dont know about response body type yet
  formattedResponse: IResponse;
  responseHeaders: Record<string, string>;
  responseCookies: string;
  error: boolean;
  errorType: ErrorTracingType;
  code: number;
};

export type PersistentFetchOptionsCallback = () => PersistentFetchParamsType;
export type SetResponseTrackCallback = (
  options: SetResponseTrackCallbackOptions,
) => void;
export type SetResponseTrackOptions = {
  callback: SetResponseTrackCallback;
  name: string;
};

export type TraceBaseRequestParamsType = {
  traceRequestCallback?: SetResponseTrackCallback;
  response: Response | null;
  requestError?: boolean;
  validationError?: boolean;
  responseError?: boolean;
  requestBody: Pick<RequestInit, 'body'>;
  requestHeaders: Record<string, string>;
  requestCookies: string;
  responseBody: any; // because we dont know about response body type yet
  formattedResponse: IResponse;
  endpoint: string;
  method: Pick<RequestInit, 'method'>;
  code: number;
  tracingDisabled?: boolean;
};

export type AdditionalErrors = Record<string, any>;

export type IJSONPRCRequestBodyParams = {
  method?: string;
  params?: string | number | Array<any> | Record<string, any>;
};

export type IJSONPRCRequestFormattedBodyParams = IJSONPRCRequestBodyParams & {
  id: string;
  jsonrpc: string;
};

export interface IJSONPRCRequestParams extends IRequestParams {
  id: string;
  version: {
    jsonrpc: string;
  };
  body?: IJSONPRCRequestBodyParams | Array<IJSONPRCRequestBodyParams>;
  responseSchema?: any | Array<any>;
}

export type FormatResponseRESTDataOptionsType = {
  isErrorTextStraightToOutput?: boolean;
  translateFunction?: TranslateFunctionType;
  statusCode: number;
  responseHeaders: Record<string, string>;
} & IRESTPureResponse;

export type FormatResponsePureRESTDataOptionsType = {
  isErrorTextStraightToOutput?: boolean;
  translateFunction?: TranslateFunctionType;
  statusCode: number;
  data: any; // data here is pure response parsed data
  responseHeaders: Record<string, string>;
};

export type FormatResponseJSONRPCDataOptionsType = {
  isErrorTextStraightToOutput?: boolean;
  translateFunction?: TranslateFunctionType;
  statusCode: number;
  responseHeaders: Record<string, string>;
} & IJSONRPCPureResponse;

export type ResponseValidateType = {
  response: any;
  schema: any;
  prevId?: string;
};

export type ExtraValidationCallbackType = (
  options: ResponseValidateType,
) => boolean;

export type CacheType =
  | 'default'
  | 'force-cache'
  | 'no-cache'
  | 'no-store'
  | 'only-if-cached'
  | 'reload';

export type ProgressCallbackParams = ({
  total,
  current,
}: {
  total: number;
  current: number;
}) => void;

export const cacheMap: ICacheMap = {
  default: 'default',
  forceCache: 'force-cache',
  noCache: 'no-cache',
  noStore: 'no-store',
  onlyIfCached: 'only-if-cached',
  reload: 'reload',
};

export type CustomSelectorDataType = (
  responseData: any,
  selectData?: string,
) => any;

export type FetchMethodType =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'UPDATE'
  | 'DELETE';

export interface IRequestParams extends RequestInit {
  headers?: { [key: string]: string };
  body?: any;
  endpoint: string;
  parseType?: keyof typeof parseTypesMap;
  queryParams?: QueryParamsType;
  translateFunction?: TranslateFunctionType;
  responseSchema?: any;
  isErrorTextStraightToOutput?: boolean;
  extraValidationCallback?: ExtraValidationCallbackType;
  customTimeout?: number;
  isBatchRequest?: boolean;
  abortRequestId?: string;
  arrayFormat?: ArrayFormatType;
  progressOptions?: ProgressOptionsType;
  customSelectorData?: CustomSelectorDataType;
  selectData?: string;
  retry?: number;
  traceRequestCallback?: SetResponseTrackCallback;
  tracingDisabled?: boolean;
  pureJsonFileResponse?: boolean;
  extraVerifyRetry?: ExtraVerifyRetryCallbackType;
  retryTimeInterval?: number;
  retryIntervalNonIncrement?: boolean;
}

export interface IResponse {
  error: boolean;
  errorText: string;
  data: any;
  additionalErrors: Record<string, any> | null;
  code: number;
  headers: Record<string, string>;
}

export type IUtilResponse<DataType> = Omit<IResponse, 'data'> & {
  data: DataType;
};

export type BatchResponseType = Array<IResponse>;

export interface IRESTPureResponse {
  error: boolean;
  errorText: string;
  data: Record<string, any> | null;
  additionalErrors: AdditionalErrors | null;
}

export type JSONRPCErrorType = {
  code: string;
  message: string;
  data: {
    err: string;
    trKey: string;
    errors?: Record<string, any>;
  };
};

export interface IJSONRPCPureResponse {
  jsonrpc: string;
  result?: any;
  error?: JSONRPCErrorType;
  id: string | number;
}

export type QueryParamsType = {
  [key: string]: string | number | Array<any> | boolean;
};

export type RequestRacerParams = {
  request: Promise<IResponse>;
  fetchController?: any;
  requestId?: string | number;
  isErrorTextStraightToOutput?: boolean;
  translateFunction?: TranslateFunctionType;
  customTimeout?: number;
};

export type ProgressOptionsType = {
  onLoaded?: (total: number) => void;
  onProgress?: ProgressCallbackParams;
};

export type ParseResponseParams = {
  response: Response;
  parseType?: keyof typeof parseTypesMap;
  isResponseStatusSuccess: boolean;
  isStatusEmpty: boolean;
  isNotFound: boolean;
  progressOptions?: ProgressOptionsType;
};

export abstract class ResponseParser {
  public abstract parse: (data: Response, options?: Record<string, any>) => any;
}

export type ArrayFormatType = 'bracket' | 'index' | 'comma' | 'none';

export type FormattedEndpointParams = {
  endpoint: string;
  queryParams?: QueryParamsType;
  arrayFormat?: ArrayFormatType;
};

export type ErrorResponseFormatterConstructorParams = {
  errorTextKey: string;
  isErrorTextStraightToOutput?: boolean;
  errorTextData?: Record<string, any> | null;
  translateFunction?: TranslateFunctionType;
  statusCode: number;
};

export type FormatDataTypeValidatorParamsType = {
  responseData: any; // 'cause we dont know about the structure
  responseSchema: any; // 'cause we dont know about the schema
};

export type GetIsomorphicFetchReturnsType = {
  requestFetch: () => Promise<Response>;
  fetchController?: AbortController;
};

export type GetIsomorphicFetchParamsType = {
  endpoint: string;
  fetchParams: RequestInit & Pick<IRequestParams, 'headers'>;
  abortRequestId?: string;
};

export type GetFetchBodyParamsType = {
  requestProtocol: keyof typeof requestProtocolsMap;
  body: any;
  method: Pick<RequestInit, 'method'>;
  version?: { jsonrpc: string };
  id?: string;
  isBatchRequest?: boolean;
};

export type GetPreparedResponseDataParams = {
  response: any;
  translateFunction?: TranslateFunctionType;
  protocol: keyof typeof requestProtocolsMap;
  isErrorTextStraightToOutput?: boolean;
  parseType: keyof typeof parseTypesMap;
  statusCode: number;
  isBatchRequest?: boolean;
  responseSchema?: any;
  body?: Array<IJSONPRCRequestFormattedBodyParams>;
  isNotFound: boolean;
  isPureFileRequest?: boolean;
  responseHeaders: Record<string, string>;
};

export type GetCompareIdsParams = { requestId: string; responceId: string };

export type GetIsSchemaResponseValidParams = {
  data: any;
  error: boolean;
  schema: any;
};

export abstract class ResponseFormatter {
  public abstract getFormattedResponse: () => IResponse;
}

export type PersistentFetchParamsType = Pick<
  IRequestParams & Partial<IJSONPRCRequestParams>,
  'headers' | 'body' | 'mode' | 'method'
>;

export type FormatResponseParamsType = {
  parseType: keyof typeof parseTypesMap;
  protocol: keyof typeof requestProtocolsMap;
  translateFunction?: TranslateFunctionType;
  isErrorTextStraightToOutput?: boolean;
  statusCode: number;
  responseHeaders: Record<string, string>;
  data: any | Blob | string | Array<IJSONRPCPureResponse>;
  error?: boolean | JSONRPCErrorType;
  isBatchRequest?: boolean;
  responseSchema?: Array<any>;
  body?: Array<IJSONPRCRequestFormattedBodyParams>;
} & (Partial<Omit<IRESTPureResponse, 'error'>> &
  Partial<Omit<IJSONRPCPureResponse, 'error'>>);

export type GetFormatValidateMethodParams = {
  protocol: keyof typeof requestProtocolsMap;
  extraValidationCallback?: ExtraValidationCallbackType;
  responseSchema?: any | Array<any>;
};

export type IDType = string;

export type GetFormattedErrorTextResponseParams = {
  errorDictionaryParams: ErrorResponseFormatterConstructorParams;
  statusCode: number;
  responseHeaders: Record<string, string>;
};

export type FormatValidateParams = {
  response: any;
  schema: any;
  prevId?: string;
  isResponseStatusSuccess?: boolean;
  isStatusEmpty?: boolean;
  isBatchRequest?: boolean;
  isPureFileRequest?: boolean;
};

export type FormatValidateParamsMethod = (
  options: FormatValidateParams,
) => boolean;

export type RestResponseValidParams = {
  response: IRESTPureResponse;
  parseType?: keyof typeof parseTypesMap;
};

export type FormatValidateParamsMehod = (
  options: FormatValidateParams,
) => boolean;

export type GetFormattedHeadersParamsType = {
  isPureFileRequest?: boolean;
  body: JSON | FormData;
  headers?: {
    [key: string]: any;
  };
};

export type AbortListenersParamsType = {
  fetchController: AbortController;
  abortRequestId: string;
};

export type GetFilteredDefaultErrorMessageParamsType = {
  response: Response;
  isErrorTextStraightToOutput?: boolean;
};

export type ExtendedResponse = Omit<Response, 'body'> & { body: any };

export type SetResponseParams = {
  pureResponse: ExtendedResponse;
  responseBody: any;
};

export type DependencyType = {
  name: string;
  value: any;
};

export type StatusValidatorParamsType = {
  requestProtocol: keyof typeof requestProtocolsMap;
  isBatchRequest?: boolean;
  isPureFileRequest: boolean;
  status: number;
};

export type StatusValidatorMethodParamsType = Omit<
  StatusValidatorParamsType,
  'requestProtocol'
>;

export type StatusValidatorMethodOutputType = () => boolean;

export type ExtraVerifyRetryCallbackType = (params: {
  formattedResponseData: IResponse;
}) => boolean;

export abstract class Formatter<DataType, FormatType> {
  public abstract getFormattedValue: (data: DataType) => FormatType;
}
