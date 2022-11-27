import { DebugCacheLogger } from './_utils/debug-cache-logger';

export type RequestCacheStrategy =
  | 'NetworkFirst'
  | 'StaleWhileRevalidate'
  | 'CacheFirst';

export type CacheRequestParamsType<ResponseType> = {
  // request
  request: () => Promise<ResponseType>;
  // onUpdateCache callback
  onUpdateCache?: (params: ResponseType) => void;
  // onRequestError callback
  onRequestError?: () => void;
  // cache time in ms
  expires?: number;
  // cache time to determined date
  expiresToDate?: number;
  // disable cache
  disabledCache?: boolean;
  // request timeout
  timeout?: number;
  // debug mode
  debug?: boolean;
};

export type IRequestCacheParamsType = {
  timestamp: number;
  storageCacheName: string;
  requestCacheKey: string;
  debugCacheLogger: DebugCacheLogger;
};

export interface IRequestCache {
  timestamp: number;
  storageCacheName: string;
  requestCacheKey: string;
  debugCacheLogger: DebugCacheLogger;

  cacheRequest: <ResponseType extends { error: boolean }>(
    params: CacheRequestParamsType<ResponseType>,
  ) => Promise<ResponseType>;
}

export type GetRequestCacheParamsType = {
  // Cache strategy
  strategy: RequestCacheStrategy;
  // Storage name
  storageCacheName: string;
  // Request name in storage
  requestCacheKey: string;
};

export interface IApiCacher {
  getRequestCache: (params: GetRequestCacheParamsType) => IRequestCache;
}
