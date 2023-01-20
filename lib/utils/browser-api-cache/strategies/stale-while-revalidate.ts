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

export class StaleWhileRevalidate implements IRequestCache {
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

  cacheRequest = <ResponseType extends { error: boolean } = IResponse>({
    request,
    onUpdateCache,
    expires = 0,
    disabledCache,
    expiresToDate,
    onRequestError,
    onCacheHit,
    onCacheMiss,
    cacheState,
  }: CacheRequestParamsType<ResponseType> & {
    cacheState: CacheStateType;
  }): Promise<ResponseType> => {
    let resolved = false;

    this.debugCacheLogger.openLogsGroup({
      requestCacheKey: this.requestCacheKey,
    });

    this.debugCacheLogger.logParams({
      params: JSON.stringify({
        strategy: 'StaleWhileRevalidate',
        expiresToDate,
        disabledCache,
        'api-expires': this.timestamp + (expires || 0),
        timestamp: this.timestamp,
        storageCacheName: this.storageCacheName,
        requestCacheKey: this.requestCacheKey,
      }),
    });

    // cache storage may be unable in untrusted origins (http) in mobile devices
    // https://stackoverflow.com/questions/53094298/window-caches-is-undefined-in-android-chrome-but-is-available-at-desktop-chrome
    if (disabledCache || !window.caches) {
      this.debugCacheLogger.logDisabledCache();
      this.debugCacheLogger.closeLogsGroup();
      return request();
    }

    return new Promise(async (resolve) => {
      const cache = await openCache(this.storageCacheName);

      if (!cache) {
        resolved = true;
        const networkResponse = await request();

        onCacheMiss?.({ cacheKey: this.requestCacheKey, cacheState });
        this.debugCacheLogger.logDisabledCache();
        this.debugCacheLogger.closeLogsGroup();

        resolve(networkResponse);

        return;
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

      if (old && cacheMatch) {
        this.debugCacheLogger.logCacheIsExpired();
      }

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

          if (!resolved) {
            resolve(networkResponse);
          }

          this.debugCacheLogger.closeLogsGroup();
        } catch (error) {
          console.error('Error in update cache', error);

          if (!resolved) {
            resolved = true;
            resolve(networkResponse);
          }
        }
      });

      if (!old && cachedResponse) {
        resolved = true;

        onCacheHit?.({
          size,
          expires,
          cacheKey: this.requestCacheKey,
          cacheState,
        });

        resolve(cachedResponse);
      } else {
        onCacheMiss?.({ cacheKey: this.requestCacheKey, cacheState });
      }
    });
  };
}
