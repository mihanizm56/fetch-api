import { IResponse } from '@/types';
import { checkIfOldCache } from '../_utils/check-if-old-cache';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { LOGS_STYLES } from '../_constants';
import {
  logCacheIsExpired,
  logCacheIsMatched,
  logNotUpdatedCache,
  logUpdatedCache,
} from '../_utils/debug-logs';

export class NetworkFirstWithTimeout implements IRequestCache {
  timestamp: number;

  storageCacheName: string;

  requestCacheKey: string;

  constructor({
    timestamp,
    storageCacheName,
    requestCacheKey,
  }: IRequestCacheParamsType) {
    this.timestamp = timestamp;
    this.storageCacheName = storageCacheName;
    this.requestCacheKey = requestCacheKey;
  }

  cacheRequest = <ResponseType extends { error: boolean } = IResponse>({
    request,
    timeout = 0,
    onUpdateCache,
    expires = 0,
    expiresToDate,
    onRequestError,
    debug,
  }: CacheRequestParamsType<ResponseType>): Promise<ResponseType> => {
    let resolved = false;

    return new Promise(async (resolve) => {
      const cache = await caches.open(this.storageCacheName);

      const cacheMatch = await cache.match(`/${this.requestCacheKey}`);
      logCacheIsMatched({ debug, cacheMatched: Boolean(cacheMatch) });
      const { old, cachedResponse } = await checkIfOldCache<ResponseType>({
        timestamp: this.timestamp,
        cacheMatch,
      });

      if (old) {
        logCacheIsExpired({ debug });
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
          logUpdatedCache({ debug, value: updatedValue });

          if (!resolved) {
            resolved = true;

            resolve(networkResponse);
          }

          return;
        }

        onRequestError?.();
        logNotUpdatedCache({
          debug,
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
