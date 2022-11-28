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
  }: CacheRequestParamsType<ResponseType>): Promise<ResponseType> => {
    const cache = await caches.open(this.storageCacheName);

    const networkResponse = await request();

    const cacheMatch = await cache.match(`/${this.requestCacheKey}`);
    this.debugCacheLogger.logCacheIsMatched({
      cacheMatched: Boolean(cacheMatch),
    });

    const { old, cachedResponse } = await checkIfOldCache<ResponseType>({
      timestamp: this.timestamp,
      cacheMatch,
    });

    if (networkResponse.error) {
      onRequestError?.();
      this.debugCacheLogger.logNotUpdatedCache({
        response: JSON.stringify(networkResponse),
      });

      if (old && cacheMatch) {
        this.debugCacheLogger.logCacheIsExpired();
      }

      return !old && cachedResponse ? cachedResponse : networkResponse;
    }

    await cache.put(
      `/${this.requestCacheKey}`,
      new Response(JSON.stringify(networkResponse), {
        headers: {
          'content-type': 'application/json',
          expires: expiresToDate
            ? `${expiresToDate}`
            : `${this.timestamp + expires}`,
        },
      }),
    );

    onUpdateCache?.({
      ...networkResponse,
      prevValue: {
        response: cachedResponse,
        old,
      },
    });
    this.debugCacheLogger.logUpdatedCache();

    return networkResponse;
  };
}
