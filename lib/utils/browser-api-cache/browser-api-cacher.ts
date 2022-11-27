import { CacheFirst } from './strategies/cache-first';
import { NetworkFirst } from './strategies/network-first';
import { StaleWhileRevalidate } from './strategies/stale-while-revalidate';
import { GetRequestCacheParamsType, IApiCacher } from './_types';
import { DebugCacheLogger } from './_utils/debug-cache-logger';

export class BrowserApiCacher implements IApiCacher {
  getRequestCache = ({
    strategy,
    debug,
    ...params
  }: GetRequestCacheParamsType) => {
    const timestamp = new Date().getTime();

    const debugCacheLogger = new DebugCacheLogger({ debug });

    if (strategy === 'StaleWhileRevalidate') {
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

    return new CacheFirst({ timestamp, debugCacheLogger, ...params });
  };
}
