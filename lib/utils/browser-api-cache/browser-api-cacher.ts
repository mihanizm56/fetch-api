import { CacheFirst } from './strategies/cache-first';
import { NetworkFirst } from './strategies/network-first';
import { StaleWhileRevalidate } from './strategies/stale-while-revalidate';
import { GetRequestCacheParamsType, IApiCacher } from './_types';
import { DebugCacheLogger } from './_utils/debug-cache-logger';

export class BrowserApiCacher implements IApiCacher {
  getRequestCache = async ({
    strategy,
    debug,
    quotaExceed,
    ...params
  }: GetRequestCacheParamsType & { quotaExceed: boolean }) => {
    const timestamp = new Date().getTime();

    const debugCacheLogger = new DebugCacheLogger({ debug });

    if (strategy === 'StaleWhileRevalidate') {
      // switch to network first when quota is exceeded
      return quotaExceed
        ? new NetworkFirst({
            timestamp,
            debugCacheLogger,
            ...params,
          })
        : new StaleWhileRevalidate({
            timestamp,
            debugCacheLogger,
            ...params,
          });
    }

    if (strategy === 'NetworkFirst') {
      return new NetworkFirst({
        timestamp,
        debugCacheLogger,
        ...params,
      });
    }

    return new CacheFirst({
      timestamp,
      debugCacheLogger,
      ...params,
    });
  };
}
