import { IResponse } from '@/types';
import {
  CacheRequestParamsType,
  CacheStateType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { checkIfOldCache } from '../_utils/check-if-old-cache';
import { DebugCacheLogger } from '../_utils/debug-cache-logger';
import { writeToCache } from '../_utils/write-to-cache';

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
    cache,
    onCacheHit,
    onCacheMiss,
    quotaExceed,
    cacheState,
  }: CacheRequestParamsType<ResponseType> & {
    cache: Cache;
    quotaExceed: boolean;
    cacheState: CacheStateType;
  }): Promise<ResponseType> => {
    const networkResponse = await request();

    const cacheMatch = await cache.match(`/${this.requestCacheKey}`);

    this.debugCacheLogger.logCacheIsMatched({
      cacheMatched: Boolean(cacheMatch),
    });

    const {
      old,
      cachedResponse,
      size = 0,
    } = await checkIfOldCache<ResponseType>({
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

      if (cachedResponse) {
        onCacheHit?.({
          size,
          expires,
          cacheKey: this.requestCacheKey,
          cacheState,
        });
      } else {
        onCacheMiss?.({ cacheKey: this.requestCacheKey, cacheState });
      }

      return !old && cachedResponse ? cachedResponse : networkResponse;
    }

    await writeToCache({
      cache,
      requestCacheKey: this.requestCacheKey,
      response: networkResponse,
      apiExpires: expiresToDate
        ? `${expiresToDate}`
        : `${this.timestamp + expires}`,
      apiTimestamp: `${this.timestamp}`,
      cachedResponse,
      old,
      onUpdateCache,
      debugCacheLogger: this.debugCacheLogger,
      strategy: 'NetworkFirst',
      quotaExceed,
    });

    return networkResponse;
  };
}
