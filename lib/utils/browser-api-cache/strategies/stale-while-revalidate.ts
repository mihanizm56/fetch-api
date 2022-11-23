import { IResponse } from '@/types';
import { checkIfOldCache } from '../_utils/check-if-old-cache';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';

export class StaleWhileRevalidate implements IRequestCache {
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
    onUpdateCache,
    expires = 0,
    disabledCache,
    expiresToDate,
    onRequestError,
  }: CacheRequestParamsType<ResponseType>): Promise<ResponseType> => {
    let resolved = false;

    // cache storage may be unable in untrusted origins (http) in mobile devices
    // https://stackoverflow.com/questions/53094298/window-caches-is-undefined-in-android-chrome-but-is-available-at-desktop-chrome
    if (disabledCache || !window.caches) {
      return request();
    }

    return new Promise(async (resolve) => {
      const cache = await caches.open(this.storageCacheName);
      const cacheMatch = await cache.match(`/${this.requestCacheKey}`);

      const { old, cachedResponse } = await checkIfOldCache<ResponseType>({
        timestamp: this.timestamp,
        cacheMatch,
      });

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

          onUpdateCache?.(networkResponse);
        } else {
          onRequestError?.();
        }

        if (!resolved) {
          resolve(networkResponse);
        }
      });

      if (cacheMatch && !old && cachedResponse) {
        resolved = true;

        resolve(cachedResponse);
      }
    });
  };
}
