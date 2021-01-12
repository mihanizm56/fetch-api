import { RequestRacerParams, ParseResponseParams, IRequestParams, FormattedEndpointParams, IResponse, IJSONPRCRequestParams, GetIsomorphicFetchParamsType, GetIsomorphicFetchReturnsType, GetFetchBodyParamsType, GetPreparedResponseDataParams, FormatResponseParamsType, PersistentFetchParamsType } from "../types";
import { requestProtocolsMap } from "../constants/shared";
declare type GetFormattedHeadersParamsType = {
    body: JSON | FormData;
    headers?: {
        [key: string]: any;
    };
};
declare type AbortListenersParamsType = {
    fetchController: AbortController;
    abortRequestId: string;
};
interface IBaseRequests {
    makeFetch: (values: IRequestParams & IJSONPRCRequestParams & {
        requestProtocol: keyof typeof requestProtocolsMap;
    } & {
        method: string;
    }) => Promise<IResponse>;
    requestRacer: (params: RequestRacerParams) => Promise<any>;
    parseResponseData: (data: ParseResponseParams) => any;
    getIsomorphicFetch: (params: GetIsomorphicFetchParamsType) => GetIsomorphicFetchReturnsType;
    addAbortListenerToRequest: (params: AbortListenersParamsType) => void;
    abortRequestListener?: any;
    getFormattedEndpoint: (params: FormattedEndpointParams) => string;
    getFetchBody: (params: GetFetchBodyParamsType) => any;
    getFormattedHeaders: (options: GetFormattedHeadersParamsType) => Record<string, string> | undefined;
}
export declare class BaseRequest implements IBaseRequests {
    abortRequestListener: any;
    static persistentOptions?: PersistentFetchParamsType;
    parseResponseData: ({ response, parseType, isResponseStatusSuccess, isStatusEmpty, isNotFound, progressOptions }: ParseResponseParams) => Promise<any>;
    addAbortListenerToRequest: ({ fetchController, abortRequestId }: AbortListenersParamsType) => void;
    removeAbortListenerFromRequest: () => void;
    getIsomorphicFetch: ({ endpoint, fetchParams, abortRequestId, }: GetIsomorphicFetchParamsType) => GetIsomorphicFetchReturnsType;
    getFormattedEndpoint: ({ endpoint, queryParams, arrayFormat }: FormattedEndpointParams) => string;
    getFetchBody: ({ requestProtocol, body, method, version, id, isBatchRequest }: GetFetchBodyParamsType) => any;
    getFormattedHeaders: ({ body, headers }: GetFormattedHeadersParamsType) => {
        [key: string]: any;
    } | undefined;
    getPreparedResponseData: ({ response, translateFunction, protocol, isErrorTextStraightToOutput, statusCode, parseType, isBatchRequest, responseSchema, body, isNotFound }: GetPreparedResponseDataParams) => FormatResponseParamsType;
    makeFetch: <MakeFetchType extends IRequestParams & Partial<IJSONPRCRequestParams> & {
        requestProtocol: "rest" | "jsonRpc" | "pureRest";
    } & {
        method: string;
    }>({ id, version, headers, body, mode, method, endpoint, parseType, queryParams, responseSchema, requestProtocol, isErrorTextStraightToOutput, extraValidationCallback, translateFunction, customTimeout, abortRequestId, arrayFormat, isBatchRequest, progressOptions, customSelectorData, selectData, cache, credentials, integrity, keepalive, redirect, referrer, referrerPolicy, retry }: MakeFetchType) => Promise<IResponse>;
    requestRacer: ({ request, fetchController, translateFunction, isErrorTextStraightToOutput, customTimeout }: RequestRacerParams) => Promise<IResponse>;
}
export {};
