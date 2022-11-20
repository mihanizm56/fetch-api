import { IResponse } from '@/types';
import { BrowserApiCacher } from './browser-api-cacher';
import { CacheRequestParamsType, GetRequestCacheParamsType } from './_types';

type ParamsType = CacheRequestParamsType<IResponse> &
  GetRequestCacheParamsType & {
    request: (params: any) => Promise<IResponse>;
  };

export const getBrowserCachedRequest = ({
  strategy,
  requestCacheKey,
  storageCacheName,
  request,
  ...cacheRequestParamsType
}: ParamsType): Promise<IResponse> => {
  const cache = new BrowserApiCacher().getRequestCache({
    strategy,
    requestCacheKey,
    storageCacheName,
  });

  return cache.cacheRequest({
    request,
    ...cacheRequestParamsType,
  });
};
