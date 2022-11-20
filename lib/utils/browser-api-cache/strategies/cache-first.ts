import { checkIfOldCache } from '../_utils/check-if-old-cache';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';

export class CacheFirst implements IRequestCache {
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

  cacheRequest = async <ResponseType extends { error: boolean }>({
    request,
    onUpdateCache,
    expires = 0,
    disabledCache,
    expiresToDate,
  }: CacheRequestParamsType<ResponseType>) => {
    // cache storage may be unable in untrusted origins (http) in mobile devices
    // https://stackoverflow.com/questions/53094298/window-caches-is-undefined-in-android-chrome-but-is-available-at-desktop-chrome
    if (disabledCache || !window.caches) {
      const response = await request();

      return response;
    }

    const cache = await caches.open(this.storageCacheName);

    const cacheMatch = await cache.match(`/${this.requestCacheKey}`);

    const { old, cachedResponse } = await checkIfOldCache<ResponseType>({
      timestamp: this.timestamp,
      cacheMatch,
    });

    if (!old && cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await request();

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
    }

    return networkResponse;
  };
}
