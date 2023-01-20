import { CacheFirst } from './strategies/cache-first';
import { CacheFirstWithRevalidate } from './strategies/cache-first-while-revalidate';
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

    if (quotaExceed) {
      return new NetworkFirst({
        timestamp,
        debugCacheLogger,
        ...params,
      });
    }

    if (strategy === 'CacheFirstWithRevalidate') {
      // switch to network first when quota is exceeded
      return new CacheFirstWithRevalidate({
        timestamp,
        debugCacheLogger,
        ...params,
      });
    }

    if (strategy === 'StaleWhileRevalidate') {
      // switch to network first when quota is exceeded
      return new StaleWhileRevalidate({
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
