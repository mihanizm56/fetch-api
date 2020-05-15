import { parseTypesMap, requestProtocolsMap } from '../constants/shared';

export type ModeCorsType = 'cors' | 'no-cors';

export type TranslateFunction = (
  key: string,
  options?: Record<string, any> | null,
) => string;

export type AdditionalErrors = Record<string, any>;

export interface IJSONPRCRequestParams extends IRequestParams {
  id: string;
  version: {
    jsonrpc: string;
  };
  body?: {
    method?: string;
    params?: string | number | Array<any> | Record<string, any>;
  };
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

export interface IRequestParams {
  headers?: { [key: string]: string };
  body?: any;
  mode?: ModeCorsType;
  method?: string; //
  endpoint: string;
  parseType?: keyof typeof parseTypesMap; //
  queryParams?: { [key: string]: string };
  translateFunction?: TranslateFunction;
  responseSchema?: any;
  isErrorTextStraightToOutput?: boolean;
  extraValidationCallback?: ExtraValidationCallback;
}

export type ComplexRequestParams = Omit<
  IRequestParams,
  'method' | 'parseType'
> & {
  body: any;
  responseSchema: any;
};

export type SimpleRequestParams = Omit<
  IRequestParams,
  'method' | 'parseType'
> & { responseSchema: any };

export interface IResponse {
  error: boolean;
  errorText: string;
  data: Record<string, any> | null;
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
    payload?: Record<string, any>;
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
  requestId?: string | number;
  isErrorTextStraightToOutput?: boolean;
  translateFunction?: TranslateFunction;
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

export type ErrorResponseFormatterConstructorParams = {
  errorTextKey: string;
  isErrorTextStraightToOutput?: boolean;
  errorTextData?: Record<string, any> | null;
  translateFunction?: TranslateFunction;
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

export type GetPreparedResponseDataParams = {
  responseData: any;
  translateFunction?: TranslateFunction;
  protocol: keyof typeof requestProtocolsMap;
  isErrorTextStraightToOutput?: boolean;
  isBlobGetRequest: boolean;
  statusCode: number;
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
  protocol: keyof typeof requestProtocolsMap;
  translateFunction?: TranslateFunction;
  isErrorTextStraightToOutput?: boolean;
  isBlobGetRequest: boolean;
  statusCode: number;
  data: any | Blob;
} & (IRESTPureResponse & IJSONRPCPureResponse);

export type GetFormatValidateMethodParams = {
  protocol: keyof typeof requestProtocolsMap;
  extraValidationCallback?: ExtraValidationCallback;
};

export type IDType = string;

export type GetPreparedPureRestResponseDataParams = {
  isResponseStatusSuccess: boolean;
  respondedData: any;
  statusCode: number;
};

export type GetFormattedErrorTextResponseParams = {
  errorDictionaryParams: ErrorResponseFormatterConstructorParams;
  statusCode: number;
};
