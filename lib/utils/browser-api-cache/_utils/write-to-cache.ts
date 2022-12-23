import { OnUpdateCacheParamsType, RequestCacheStrategy } from '../_types';
import { DebugCacheLogger } from './debug-cache-logger';

type ParamsType = {
  cache: Cache;
  requestCacheKey: string;
  response: any;
  apiExpires: string;
  apiTimestamp: string;
  cachedResponse?: any;
  old: boolean;
  onUpdateCache?: (params: OnUpdateCacheParamsType<any>) => void;
  debugCacheLogger: DebugCacheLogger;
  strategy: RequestCacheStrategy;
  quotaExceed: boolean;
};

export const writeToCache = async ({
  cache,
  requestCacheKey,
  response,
  apiExpires,
  apiTimestamp,
  cachedResponse,
  old,
  onUpdateCache,
  debugCacheLogger,
  strategy,
  quotaExceed,
}: ParamsType): Promise<void> => {
  try {
    if (quotaExceed) {
      console.error('Quota is unsafe, can not write to cache');

      return;
    }

    await cache.put(
      `/${requestCacheKey}`,
      new Response(JSON.stringify(response), {
        headers: {
          'content-type': 'application/json',
          'api-expires': apiExpires,
          'api-timestamp': apiTimestamp,
          'api-strategy': strategy,
        },
      }),
    );

    onUpdateCache?.({
      ...response,
      prevValue: {
        response: cachedResponse,
        old,
      },
    });

    debugCacheLogger.logUpdatedCache();
  } catch (error) {
    console.error('Error in writeToCache', error);
  }
};
