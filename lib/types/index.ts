/* eslint-disable max-classes-per-file */

import {
  ICacheMap,
  parseTypesMap,
  requestProtocolsMap,
  TRACING_ERRORS,
} from '@/constants';
import {
  CacheRequestParamsType,
  GetRequestCacheParamsType,
} from '@/utils/browser-api-cache/_types';

export type ErrorTracingType =
  | null
  | typeof TRACING_ERRORS[keyof typeof TRACING_ERRORS];

export type ModeCorsType = 'cors' | 'no-cors';

export type QueryParamsType = {
  [key: string]: string | number | Array<any> | boolean;
};

export interface IResponse<
  DataType = any,
  HeadersType = Record<string, string>,
  AdditionalErrorsType = Record<string, any>,
> {
  error: boolean;
  errorText: string;
  data: DataType;
  additionalErrors: AdditionalErrorsType | null;
  code: number;
  headers: HeadersType;
}

// types for browser cache
export type BrowserCacheParamsType = Omit<
  CacheRequestParamsType<IResponse>,
  'request'
> &
  GetRequestCacheParamsType;

export type CacheParamsType = {
  endpoint: string;
  method: Pick<RequestInit, 'method'>;
  requestBody: Pick<RequestInit, 'body'>;
  requestHeaders: Record<string, string>;
  requestCookies: string;
  fullEndpoint: string;
};
export interface ICache {
  getFromCache: (params: CacheParamsType) => Promise<IResponse | null>;
  setToCache: (params: CacheParamsType & { response: IResponse }) => void;
}

export type ResponseValidateType = {
  response: any;
  schema: any;
  prevId?: string;
};

export type ExtraValidationCallbackType = (
  options: ResponseValidateType,
) => boolean;

export type TranslateFunctionType = (
  key: string,
  options?: Record<string, any> | null,
) => string;

export type ArrayFormatType = 'bracket' | 'index' | 'comma' | 'none';

export type ProgressCallbackParams = ({
  total,
  current,
}: {
  total: number;
  current: number;
}) => void;

export type ProgressOptionsType = {
  onLoaded?: (total: number) => void;
  onProgress?: ProgressCallbackParams;
};

export type CustomSelectorDataType = (
  responseData: any,
  selectData?: string,
) => any;

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

export type SetResponseTrackCallback = (
  options: SetResponseTrackCallbackOptions,
) => void;

export type SetResponseTrackOptions = {
  callback: SetResponseTrackCallback;
  name: string;
};

export type ExtraVerifyRetryCallbackType = (params: {
  formattedResponseData: IResponse;
}) => boolean;

export interface IRequestParams extends RequestInit {
  headers?: Record<string, string>;
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
  cacheIsDisabled?: boolean;
  middlewaresAreDisabled?: boolean;
  proxyPersistentOptionsAreDisabled?: boolean;
  pureJsonFileResponse?: boolean;
  extraVerifyRetry?: ExtraVerifyRetryCallbackType;
  retryTimeInterval?: number;
  retryIntervalNonIncrement?: boolean;
  requestCache?: ICache;
  ignoreResponseIdCompare?: boolean;
  notRetryWhenOffline?: boolean;
  browserCacheParams?: BrowserCacheParamsType | null;
}

export type IJSONPRCRequestBodyParams = {
  method?: string;
  params?: string | number | Array<any> | Record<string, any>;
};
export interface IJSONPRCRequestParams extends IRequestParams {
  id: string;
  version: {
    jsonrpc: string;
  };
  body?: IJSONPRCRequestBodyParams | Array<IJSONPRCRequestBodyParams>;
  responseSchema?: any | Array<any>;
}

export type PersistentFetchParamsType = Pick<
  IRequestParams & Partial<IJSONPRCRequestParams>,
  'headers' | 'body' | 'mode' | 'method'
>;

export type PersistentFetchOptionsCallback = (
  params: RequestInit &
    Pick<IRequestParams, 'headers' | 'endpoint' | 'parseType'>,
) => PersistentFetchParamsType;

export type SetResponsePersistentParamsOptions = {
  callback: PersistentFetchOptionsCallback;
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

export type IJSONPRCRequestFormattedBodyParams = IJSONPRCRequestBodyParams & {
  id: string;
  jsonrpc: string;
};

export interface IRESTPureResponse {
  error: boolean;
  errorText: string;
  data: Record<string, any> | null;
  additionalErrors: AdditionalErrors | null;
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

export type GetFetchParamsType = {
  params: RequestInit &
    Pick<IRequestParams, 'headers' | 'endpoint' | 'parseType'>;
  proxyPersistentOptionsAreDisabled?: boolean;
};

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

export type FormatResponseJSONRPCDataOptionsType = {
  isErrorTextStraightToOutput?: boolean;
  translateFunction?: TranslateFunctionType;
  statusCode: number;
  responseHeaders: Record<string, string>;
} & IJSONRPCPureResponse;

export type CacheType =
  | 'default'
  | 'force-cache'
  | 'no-cache'
  | 'no-store'
  | 'only-if-cached'
  | 'reload';

export const cacheMap: ICacheMap = {
  default: 'default',
  forceCache: 'force-cache',
  noCache: 'no-cache',
  noStore: 'no-store',
  onlyIfCached: 'only-if-cached',
  reload: 'reload',
};

export type FetchMethodType =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'UPDATE'
  | 'DELETE';

export type IUtilResponse<DataType> = Omit<IResponse, 'data'> & {
  data: DataType;
};

export type BatchResponseType = Array<IResponse>;

export type RequestRacerParams = {
  request: Promise<IResponse>;
  fetchController?: any;
  requestId?: string | number;
  isErrorTextStraightToOutput?: boolean;
  translateFunction?: TranslateFunctionType;
  customTimeout?: number;
};

export type ParseResponseParams = {
  response: Response;
  parseType?: keyof typeof parseTypesMap;
  isResponseStatusSuccess: boolean;
  isStatusEmpty: boolean;
  isNotFound: boolean;
  progressOptions?: ProgressOptionsType;
  requestProtocol: keyof typeof requestProtocolsMap;
};

export abstract class ResponseParser {
  public abstract parse: (data: Response) => any;
}

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
  userAbortedRequest?: boolean;
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
  fetchParams: RequestInit &
    Pick<IRequestParams, 'headers' | 'endpoint' | 'parseType'>;
  abortRequestId?: string;
  proxyPersistentOptionsAreDisabled?: boolean;
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
  ignoreResponseIdCompare?: boolean;
};

export type GetMiddlewareCombinedResponseParamsType = {
  response: IResponse;
  endpoint: string;
  method: Pick<RequestInit, 'method'>;
  middlewaresAreDisabled?: boolean;
  retryRequest: (
    additionalParams: Partial<IRequestParams>,
  ) => Promise<IResponse>;
  pureRequestParams: {
    response: Response | null;
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
  };
};

export type IMiddleware = (
  params: Omit<
    GetMiddlewareCombinedResponseParamsType,
    'middlewaresAreDisabled'
  >,
) => Promise<IResponse>;

export type GetResponseFromCacheParamsType = CacheParamsType & {
  cacheIsDisabled?: boolean;
  cacheNoStore?: boolean;
  requestCache?: ICache;
};

export type SetResponseFromCacheParamsType = GetResponseFromCacheParamsType & {
  response: IResponse;
};

export type GetCompareIdsParams = { requestId: string; responceId: string };

export type GetIsSchemaResponseValidParams = {
  data: any;
  error: boolean;
  schema: {
    validate: (
      data: any,
      params: {
        allowUnknown: boolean;
        abortEarly: boolean;
        [key: string]: any;
      },
    ) => {
      error: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
};

export type MiddlewareParams = {
  middleware: IMiddleware;
  name: string;
};

export type CacheParams = {
  cache: ICache;
  name: string;
};

export type GetTimeoutExceptionParamsType = {
  fetchController?: any;
  requestId?: string | number;
  isErrorTextStraightToOutput?: boolean;
  translateFunction?: TranslateFunctionType;
  customTimeout?: number;
};

export abstract class ResponseFormatter {
  public abstract getFormattedResponse: () => IResponse;
}

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
  ignoreResponseIdCompare?: boolean;
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
  userAbortedRequest?: boolean;
};

export type FormatValidateParams = {
  response: any;
  schema: any;
  prevId?: string;
  isResponseStatusSuccess?: boolean;
  isStatusEmpty?: boolean;
  isBatchRequest?: boolean;
  isPureFileRequest?: boolean;
  ignoreResponseIdCompare?: boolean;
  requestBody: Pick<RequestInit, 'body'>;
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

export abstract class Formatter<DataType, FormatType> {
  public abstract getFormattedValue: (data: DataType) => FormatType;
}
