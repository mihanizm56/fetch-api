import { parseTypesMap, requestProtocolsMap } from '../constants/shared';

export type ModeCorsType = 'cors' | 'no-cors';

export type TranslateFunction = (
  key: string,
  options?: Record<string, any> | null,
) => string;

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
  translateFunction?: TranslateFunction;
  statusCode: number;
} & IRESTPureResponse;

export type FormatResponseJSONRPCDataOptionsType = {
  isErrorTextStraightToOutput?: boolean;
  translateFunction?: TranslateFunction;
  statusCode: number;
} & IJSONRPCPureResponse;

export type ResponseValidateType = {
  response: any;
  schema: any;
  prevId?: string;
};

export type ExtraValidationCallback = ({
  response,
  schema,
  prevId,
}: ResponseValidateType) => boolean;

export type CacheType =
  | 'default'
  | 'force-cache'
  | 'no-cache'
  | 'no-store'
  | 'only-if-cached'
  | 'reload';

export interface IRequestParams {
  headers?: { [key: string]: string };
  body?: any;
  mode?: ModeCorsType;
  method?: string;
  endpoint: string;
  parseType?: keyof typeof parseTypesMap;
  queryParams?: QueryParamsType;
  translateFunction?: TranslateFunction;
  responseSchema?: any;
  isErrorTextStraightToOutput?: boolean;
  extraValidationCallback?: ExtraValidationCallback;
  customTimeout?: number;
  abortRequestId?: string;
  arrayFormat?: ArrayFormatType;
  cache?: CacheType;
  isBatchRequest?: boolean;
}

export interface IResponse {
  error: boolean;
  errorText: string;
  data: Record<string, any> | null | Blob | string;
  additionalErrors: Record<string, any> | null;
  code: number;
}

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
  translateFunction?: TranslateFunction;
  customTimeout?: number;
};

export type ParseResponseParams = {
  response: IRESTPureResponse | IJSONRPCPureResponse;
  parseType?: keyof typeof parseTypesMap;
  isResponseOk: boolean;
  isStatusEmpty: boolean;
  isNotFound: boolean;
};

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
  translateFunction?: TranslateFunction;
  statusCode: number;
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
  abortRequestId?: string;
};

export type GetFetchBodyParamsType = {
  requestProtocol: keyof typeof requestProtocolsMap;
  body: any;
  method: string;
  version?: { jsonrpc: string };
  id?: string;
  isBatchRequest?: boolean;
};

export type GetPreparedResponseDataParams = {
  response: any;
  translateFunction?: TranslateFunction;
  protocol: keyof typeof requestProtocolsMap;
  isErrorTextStraightToOutput?: boolean;
  parseType: keyof typeof parseTypesMap;
  statusCode: number;
  isResponseStatusSuccess: boolean;
  isBatchRequest?: boolean;
  responseSchema?: any;
  body?: Array<IJSONPRCRequestFormattedBodyParams>;
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

export type FormatResponseParamsType = {
  parseType: keyof typeof parseTypesMap;
  protocol: keyof typeof requestProtocolsMap;
  translateFunction?: TranslateFunction;
  isErrorTextStraightToOutput?: boolean;
  statusCode: number;
  data: any | Blob | string | Array<IJSONRPCPureResponse>;
  error?: boolean | JSONRPCErrorType;
  isBatchRequest?: boolean;
  responseSchema?: Array<any>;
  body?: Array<IJSONPRCRequestFormattedBodyParams>;
} & (Partial<Omit<IRESTPureResponse, 'error'>> &
  Partial<Omit<IJSONRPCPureResponse, 'error'>>);

export type GetFormatValidateMethodParams = {
  protocol: keyof typeof requestProtocolsMap;
  extraValidationCallback?: ExtraValidationCallback;
};

export type IDType = string;

export type GetFormattedErrorTextResponseParams = {
  errorDictionaryParams: ErrorResponseFormatterConstructorParams;
  statusCode: number;
};

export type FormatValidateParams = {
  response: any;
  schema: any;
  prevId?: string;
  isResponseStatusSuccess?: boolean;
  isStatusEmpty?: boolean;
  isBatchRequest?: boolean;
};

export type GetPureRestErrorTextParamsType = {
  response: any;
  isResponseStatusSuccess: boolean;
};

export type GetPureRestAdditionalErrorsParamsType = GetPureRestErrorTextParamsType;
