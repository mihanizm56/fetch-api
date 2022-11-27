import { IResponse } from '@/types';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { checkIfOldCache } from '../_utils/check-if-old-cache';
import { DebugCacheLogger } from '../_utils/debug-cache-logger';

export class NetworkFirstSimple implements IRequestCache {
  timestamp: number;

  storageCacheName: string;

  requestCacheKey: string;

  debugCacheLogger: DebugCacheLogger;

  constructor({
    timestamp,
    storageCacheName,
    requestCacheKey,
    debugCacheLogger,
  }: IRequestCacheParamsType) {
    this.timestamp = timestamp;
    this.storageCacheName = storageCacheName;
    this.requestCacheKey = requestCacheKey;
    this.debugCacheLogger = debugCacheLogger;
  }

  cacheRequest = async <ResponseType extends { error: boolean } = IResponse>({
    request,
    onUpdateCache,
    expires = 0,
    expiresToDate,
    onRequestError,
    debug,
  }: CacheRequestParamsType<ResponseType>): Promise<ResponseType> => {
    const cache = await caches.open(this.storageCacheName);

    const networkResponse = await request();

    if (networkResponse.error) {
      onRequestError?.();
      this.debugCacheLogger.logNotUpdatedCache({
        debug,
        response: JSON.stringify(networkResponse),
      });

      const cacheMatch = await cache.match(`/${this.requestCacheKey}`);
      this.debugCacheLogger.logCacheIsMatched({
        debug,
        cacheMatched: Boolean(cacheMatch),
      });

      const { old, cachedResponse } = await checkIfOldCache<ResponseType>({
        timestamp: this.timestamp,
        cacheMatch,
      });

      if (old) {
        this.debugCacheLogger.logCacheIsExpired({ debug });
      }

      return !old && cachedResponse ? cachedResponse : networkResponse;
    }

    const updatedValue = JSON.stringify(networkResponse);

    await cache.put(
      `/${this.requestCacheKey}`,
      new Response(updatedValue, {
        headers: {
          'content-type': 'application/json',
          expires: expiresToDate
            ? `${expiresToDate}`
            : `${this.timestamp + expires}`,
        },
      }),
    );

    onUpdateCache?.(networkResponse);
    this.debugCacheLogger.logUpdatedCache({ debug, value: updatedValue });

    return networkResponse;
  };
}
