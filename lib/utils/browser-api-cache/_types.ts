import { DebugCacheLogger } from './_utils/debug-cache-logger';

export type RequestCacheStrategy =
  | 'NetworkFirst'
  | 'StaleWhileRevalidate'
  | 'CacheFirst';

export type OnUpdateCacheParamsType<ResponseType> = ResponseType & {
  prevValue: {
    response?: ResponseType;
    old: boolean;
  };
};

export type CacheHitParamsType = {
  size: number;
  expires: number;
  cacheKey: string;
};

export type CacheMissParamsType = {
  cacheKey: string;
};

export type CacheRequestParamsType<ResponseType> = {
  // request
  request: () => Promise<ResponseType>;
  // onUpdateCache callback
  onUpdateCache?: (params: OnUpdateCacheParamsType<ResponseType>) => void;
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
  // callback to observe cache match state
  onCacheHit?: (params: CacheHitParamsType) => void;
  // callback to observe cache match state
  onCacheMiss?: (params: CacheMissParamsType) => void;
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
  // debug mode
  debug?: boolean;
  // quota custom limit
  quotaExceedLimit?: number;
};

export interface IApiCacher {
  getRequestCache: (
    params: GetRequestCacheParamsType,
  ) => Promise<IRequestCache>;
}
