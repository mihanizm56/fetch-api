import { IResponse } from '@/types';
import { checkIfOldCache } from '../_utils/check-if-old-cache';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { DebugCacheLogger } from '../_utils/debug-cache-logger';

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
  }: CacheRequestParamsType<ResponseType> & {
    cache: Cache;
  }): Promise<ResponseType> => {
    let resolved = false;

    return new Promise(async (resolve) => {
      const cacheMatch = await cache.match(`/${this.requestCacheKey}`);
      this.debugCacheLogger.logCacheIsMatched({
        cacheMatched: Boolean(cacheMatch),
      });
      const { old, cachedResponse } = await checkIfOldCache<ResponseType>({
        timestamp: this.timestamp,
        cacheMatch,
      });

      if (old && cacheMatch) {
        this.debugCacheLogger.logCacheIsExpired();
      }

      if (!old) {
        setTimeout(() => {
          if (!resolved && cachedResponse) {
            resolve(cachedResponse);
          }
        }, timeout);
      }

      request().then(async (networkResponse) => {
        if (!networkResponse.error) {
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

          const value =
            !old && cachedResponse ? cachedResponse : networkResponse;

          resolve(value);
        }
      });
    });
  };
}
