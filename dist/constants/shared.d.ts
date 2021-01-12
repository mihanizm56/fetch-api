export interface IParseTypesMap {
    json: 'json';
    blob: 'blob';
    text: 'text';
}
export interface ICacheMap {
    default: 'default';
    forceCache: 'force-cache';
    noCache: 'no-cache';
    noStore: 'no-store';
    onlyIfCached: 'only-if-cached';
    reload: 'reload';
}
export interface IRequestProtocolsMap {
    rest: 'rest';
    jsonRpc: 'jsonRpc';
    pureRest: 'pureRest';
}
export declare const cacheMap: ICacheMap;
export declare const parseTypesMap: IParseTypesMap;
export declare const requestProtocolsMap: IRequestProtocolsMap;
export declare const TIMEOUT_ERROR_KEY = "timeout-error";
export declare const NETWORK_ERROR_KEY = "network-error";
export declare const NOT_FOUND_ERROR_KEY = "not-found-error";
export declare const ABORTED_ERROR_TEXT_CHROME = "The user aborted a request.";
export declare const ABORTED_ERROR_TEXT_MOZILLA = "The operation was aborted. ";
export declare const ABORTED_ERROR_TEXT_SAFARI = "Fetch is aborted";
export declare const ABORT_REQUEST_EVENT_NAME = "abort_request_event";
