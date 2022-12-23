import { IResponse } from '@/types';
import { BrowserApiCacher } from './browser-api-cacher';
import { CacheRequestParamsType, GetRequestCacheParamsType } from './_types';
import { checkQuotaExceed } from './_utils/check-quota-exceed';

type ParamsType = CacheRequestParamsType<IResponse> &
  GetRequestCacheParamsType & {
    request: (params: any) => Promise<IResponse>;
  };

export const getBrowserCachedRequest = async ({
  strategy,
  requestCacheKey,
  storageCacheName,
  debug,
  request,
  minAllowedQuota,
  ...cacheRequestParamsType
}: ParamsType): Promise<IResponse> => {
  try {
    const { quotaExceed, cacheState } = await checkQuotaExceed({
      minAllowedQuota,
    });

    const cache = await new BrowserApiCacher().getRequestCache({
      strategy,
      requestCacheKey,
      storageCacheName,
      debug,
      quotaExceed,
    });

    const result = await cache.cacheRequest({
      request,
      quotaExceed,
      cacheState,
      ...cacheRequestParamsType,
    });

    return result;
  } catch (error) {
    console.error('Error in getBrowserCachedRequest', error);

    return request();
  }
};
