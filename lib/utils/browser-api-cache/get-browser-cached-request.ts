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
  quotaExceedLimit,
  ...cacheRequestParamsType
}: ParamsType): Promise<IResponse> => {
  try {
    const quotaExceed = await checkQuotaExceed({ quotaExceedLimit });

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
      ...cacheRequestParamsType,
    });

    return result;
  } catch (error) {
    console.error('Error in getBrowserCachedRequest', error);

    return request();
  }
};
