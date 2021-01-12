import { parseTypesMap, requestProtocolsMap } from '../constants/shared';
export declare type ModeCorsType = 'cors' | 'no-cors';
export declare type TranslateFunctionType = (key: string, options?: Record<string, any> | null) => string;
export declare type PersistentFetchOptionsCallback = () => PersistentFetchParamsType;
export declare type AdditionalErrors = Record<string, any>;
export declare type IJSONPRCRequestBodyParams = {
    method?: string;
    params?: string | number | Array<any> | Record<string, any>;
};
export declare type IJSONPRCRequestFormattedBodyParams = IJSONPRCRequestBodyParams & {
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
export declare type FormatResponseRESTDataOptionsType = {
    isErrorTextStraightToOutput?: boolean;
    translateFunction?: TranslateFunctionType;
    statusCode: number;
} & IRESTPureResponse;
export declare type FormatResponsePureRESTDataOptionsType = {
    isErrorTextStraightToOutput?: boolean;
    translateFunction?: TranslateFunctionType;
    statusCode: number;
    data: any;
};
export declare type FormatResponseJSONRPCDataOptionsType = {
    isErrorTextStraightToOutput?: boolean;
    translateFunction?: TranslateFunctionType;
    statusCode: number;
} & IJSONRPCPureResponse;
export declare type ResponseValidateType = {
    response: any;
    schema: any;
    prevId?: string;
};
export declare type ExtraValidationCallbackType = ({ response, schema, prevId, }: ResponseValidateType) => boolean;
export declare type CacheType = 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload';
export declare type ProgressCallbackParams = ({ total, current, }: {
    total: number;
    current: number;
}) => void;
export interface ICacheMap {
    default: 'default';
    forceCache: 'force-cache';
    noCache: 'no-cache';
    noStore: 'no-store';
    onlyIfCached: 'only-if-cached';
    reload: 'reload';
}
export declare const cacheMap: ICacheMap;
export declare type CustomSelectorDataType = (responseData: any, selectData?: string) => any;
export declare type FetchMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'UPDATE' | 'DELETE';
export interface IRequestParams extends RequestInit {
    headers?: {
        [key: string]: string;
    };
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
}
export interface IResponse {
    error: boolean;
    errorText: string;
    data: any;
    additionalErrors: Record<string, any> | null;
    code: number;
}
export declare type IUtilResponse<DataType> = Omit<IResponse, 'data'> & {
    data: DataType;
};
export declare type BatchResponseType = Array<IResponse>;
export interface IRESTPureResponse {
    error: boolean;
    errorText: string;
    data: Record<string, any> | null;
    additionalErrors: AdditionalErrors | null;
}
export declare type JSONRPCErrorType = {
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
export declare type QueryParamsType = {
    [key: string]: string | number | Array<any> | boolean;
};
export declare type RequestRacerParams = {
    request: Promise<IResponse>;
    fetchController?: any;
    requestId?: string | number;
    isErrorTextStraightToOutput?: boolean;
    translateFunction?: TranslateFunctionType;
    customTimeout?: number;
};
export declare type ProgressOptionsType = {
    onLoaded?: (total: number) => void;
    onProgress?: ProgressCallbackParams;
};
export declare type ParseResponseParams = {
    response: Response;
    parseType?: keyof typeof parseTypesMap;
    isResponseStatusSuccess: boolean;
    isStatusEmpty: boolean;
    isNotFound: boolean;
    progressOptions?: ProgressOptionsType;
};
export declare abstract class ResponseParser {
    abstract parse: (data: Response, options?: Record<string, any>) => any;
}
export declare type ArrayFormatType = 'bracket' | 'index' | 'comma' | 'none';
export declare type FormattedEndpointParams = {
    endpoint: string;
    queryParams?: QueryParamsType;
    arrayFormat?: ArrayFormatType;
};
export declare type ErrorResponseFormatterConstructorParams = {
    errorTextKey: string;
    isErrorTextStraightToOutput?: boolean;
    errorTextData?: Record<string, any> | null;
    translateFunction?: TranslateFunctionType;
    statusCode: number;
};
export declare type FormatDataTypeValidatorParamsType = {
    responseData: any;
    responseSchema: any;
};
export declare type GetIsomorphicFetchReturnsType = {
    requestFetch: () => Promise<Response>;
    fetchController?: AbortController;
};
export declare type GetIsomorphicFetchParamsType = {
    endpoint: string;
    fetchParams: RequestInit & Pick<IRequestParams, 'headers'>;
    abortRequestId?: string;
};
export declare type GetFetchBodyParamsType = {
    requestProtocol: keyof typeof requestProtocolsMap;
    body: any;
    method: string;
    version?: {
        jsonrpc: string;
    };
    id?: string;
    isBatchRequest?: boolean;
};
export declare type GetPreparedResponseDataParams = {
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
};
export declare type GetCompareIdsParams = {
    requestId: string;
    responceId: string;
};
export declare type GetIsSchemaResponseValidParams = {
    data: any;
    error: boolean;
    schema: any;
};
export declare abstract class ResponseFormatter {
    abstract getFormattedResponse: () => IResponse;
}
export declare type PersistentFetchParamsType = Pick<IRequestParams & Partial<IJSONPRCRequestParams>, 'headers' | 'body' | 'mode' | 'method'>;
export declare type FormatResponseParamsType = {
    parseType: keyof typeof parseTypesMap;
    protocol: keyof typeof requestProtocolsMap;
    translateFunction?: TranslateFunctionType;
    isErrorTextStraightToOutput?: boolean;
    statusCode: number;
    data: any | Blob | string | Array<IJSONRPCPureResponse>;
    error?: boolean | JSONRPCErrorType;
    isBatchRequest?: boolean;
    responseSchema?: Array<any>;
    body?: Array<IJSONPRCRequestFormattedBodyParams>;
} & (Partial<Omit<IRESTPureResponse, 'error'>> & Partial<Omit<IJSONRPCPureResponse, 'error'>>);
export declare type GetFormatValidateMethodParams = {
    protocol: keyof typeof requestProtocolsMap;
    extraValidationCallback?: ExtraValidationCallbackType;
};
export declare type IDType = string;
export declare type GetFormattedErrorTextResponseParams = {
    errorDictionaryParams: ErrorResponseFormatterConstructorParams;
    statusCode: number;
};
export declare type FormatValidateParams = {
    response: any;
    schema: any;
    prevId?: string;
    isResponseStatusSuccess?: boolean;
    isStatusEmpty?: boolean;
    isBatchRequest?: boolean;
};
