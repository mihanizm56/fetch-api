import { IResponse } from '@/types';
import { checkIfOldCache } from '../_utils/check-if-old-cache';
import {
  CacheRequestParamsType,
  CacheStateType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { DebugCacheLogger } from '../_utils/debug-cache-logger';
import { writeToCache } from '../_utils/write-to-cache';

export class NetworkFirstWithTimeout implements IRequestCache {
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
    timeout = 0,
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
    let resolved = false;
    let cacheLogged = false;

    return new Promise(async (resolve) => {
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

      setTimeout(() => {
        if (resolved) {
          return;
        }

        if (!cacheLogged) {
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

          cacheLogged = true;
        }

        if (cachedResponse) {
          resolved = true;

          resolve(cachedResponse);
        }
      }, timeout);

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
              strategy: 'NetworkFirst',
              quotaExceed,
            });

            if (!resolved) {
              resolved = true;

              resolve(networkResponse);
            }

            return;
          }

          onRequestError?.();
          this.debugCacheLogger.logNotUpdatedCache({
            response: JSON.stringify(networkResponse),
          });

          if (!resolved) {
            resolved = true;

            if (!cacheLogged) {
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

              cacheLogged = true;
            }

            const value = cachedResponse || networkResponse;

            resolve(value);
          }
        } catch (error) {
          console.error('Error in update cache', error);

          if (!resolved) {
            resolved = true;

            resolve(networkResponse);
          }
        }
      });
    });
  };
}
