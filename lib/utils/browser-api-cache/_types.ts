export type RequestCacheStrategy =
  | 'NetworkFirst'
  | 'StaleWhileRevalidate'
  | 'CacheFirst';

export type CacheRequestParamsType<ResponseType> = {
  // request
  request: () => Promise<ResponseType>;
  // onUpdateCache callback
  onUpdateCache?: (params: ResponseType) => void;
  // cache time in ms
  expires?: number;
  // cache time to determined date
  expiresToDate?: number;
  // disable cache
  disabledCache?: boolean;
  // request timeout
  timeout?: number;
};

export type IRequestCacheParamsType = {
  timestamp: number;
  storageCacheName: string;
  requestCacheKey: string;
};

export interface IRequestCache {
  timestamp: number;
  storageCacheName: string;
  requestCacheKey: string;

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
