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
  debug,
  request,
  ...cacheRequestParamsType
}: ParamsType): Promise<IResponse> => {
  try {
    const cache = new BrowserApiCacher().getRequestCache({
      strategy,
      requestCacheKey,
      storageCacheName,
      debug,
    });

    return cache.cacheRequest({
      request,
      ...cacheRequestParamsType,
    });
  } catch (error) {
    console.error('Error in getBrowserCachedRequest', error);

    return request();
  }
};
