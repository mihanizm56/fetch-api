import { IResponse } from '@/types';
import { checkIfOldCache } from '../_utils/check-if-old-cache';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';

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
  }: CacheRequestParamsType<ResponseType>): Promise<ResponseType> => {
    let resolved = false;

    return new Promise(async (resolve) => {
      const cache = await caches.open(this.storageCacheName);
      const cacheMatch = await cache.match(`/${this.requestCacheKey}`);

      const { old, cachedResponse } = await checkIfOldCache<ResponseType>({
        timestamp: this.timestamp,
        cacheMatch,
      });

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

          if (onUpdateCache) {
            onUpdateCache(networkResponse);
          }

          if (!resolved) {
            resolved = true;

            resolve(networkResponse);
          }

          return;
        }

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
