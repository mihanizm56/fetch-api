import { IResponse } from '@/types';
import { checkIfOldCache } from '../_utils/check-if-old-cache';
import {
  CacheRequestParamsType,
  CacheStateType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { DebugCacheLogger } from '../_utils/debug-cache-logger';
import { openCache } from '../_utils/open-cache';
import { writeToCache } from '../_utils/write-to-cache';

export class CacheFirstWithRevalidate implements IRequestCache {
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
    disabledCache,
    onRequestError,
    onCacheHit,
    cacheState,
    onCacheMiss,
  }: CacheRequestParamsType<ResponseType> & {
    cacheState: CacheStateType;
  }): Promise<ResponseType> => {
    this.debugCacheLogger.openLogsGroup({
      requestCacheKey: this.requestCacheKey,
    });

    this.debugCacheLogger.logParams({
      params: JSON.stringify({
        strategy: 'CacheFirstWithRevalidate',
        expiresToDate,
        disabledCache,
        'api-expires': this.timestamp + expires,
        timestamp: this.timestamp,
        storageCacheName: this.storageCacheName,
        requestCacheKey: this.requestCacheKey,
      }),
    });

    const cache = await openCache(this.storageCacheName);

    // cache storage may be unable in untrusted origins (http) in mobile devices
    // https://stackoverflow.com/questions/53094298/window-caches-is-undefined-in-android-chrome-but-is-available-at-desktop-chrome
    if (disabledCache || !window.caches || !cache) {
      const response = await request();
      this.debugCacheLogger.logDisabledCache();
      this.debugCacheLogger.closeLogsGroup();

      return response;
    }

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

    // if cachedResponse exists - activate onCacheHit callback
    if (cachedResponse) {
      onCacheHit?.({
        size,
        expires,
        cacheKey: this.requestCacheKey,
        cacheState,
      });
    }

    // if not old - simple return
    if (!old && cachedResponse) {
      this.debugCacheLogger.closeLogsGroup();

      return cachedResponse;
    }

    // if old and has the old value - do request and write it to cache
    if (cachedResponse) {
      this.debugCacheLogger.logCacheIsExpired();

      return new Promise(async (resolve) => {
        // 2 update cache
        request().then(async (networkResponse) => {
          try {
            if (!networkResponse.error) {
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
                strategy: 'StaleWhileRevalidate',
                quotaExceed: false, // because of switch upper
              });
            } else {
              onRequestError?.();
              this.debugCacheLogger.logNotUpdatedCache({
                response: JSON.stringify(networkResponse),
              });
            }
          } catch (error) {
            console.error('Error in update cache', error);
          }

          this.debugCacheLogger.closeLogsGroup();
        });

        // 1 simple return cachedResponse
        resolve(cachedResponse);
      });
    }

    onCacheMiss?.({ cacheKey: this.requestCacheKey, cacheState });

    // simple network request
    const networkResponse = await request();

    if (!networkResponse.error) {
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
        strategy: 'StaleWhileRevalidate',
        quotaExceed: false, // because of switch upper
      });
    } else {
      onRequestError?.();
      this.debugCacheLogger.logNotUpdatedCache({
        response: JSON.stringify(networkResponse),
      });
    }

    this.debugCacheLogger.closeLogsGroup();

    return networkResponse;
  };
}
