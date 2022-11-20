import { CacheFirst } from './strategies/cache-first';
import { NetworkFirst } from './strategies/network-first';
import { StaleWhileRevalidate } from './strategies/stale-while-revalidate';
import { GetRequestCacheParamsType, IApiCacher } from './_types';

export class BrowserApiCacher implements IApiCacher {
  getRequestCache = ({ strategy, ...params }: GetRequestCacheParamsType) => {
    const timestamp = new Date().getTime();

    if (strategy === 'StaleWhileRevalidate') {
      return new StaleWhileRevalidate({
        timestamp,
        ...params,
      });
    }

    if (strategy === 'NetworkFirst') {
      return new NetworkFirst({
        timestamp,
        ...params,
      });
    }

    return new CacheFirst({ timestamp, ...params });
  };
}
