import { IResponse } from '@/types';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { checkIfOldCache } from '../_utils/check-if-old-cache';

export class NetworkFirstSimple implements IRequestCache {
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

  cacheRequest = async <ResponseType extends { error: boolean } = IResponse>({
    request,
    onUpdateCache,
    expires = 0,
    expiresToDate,
    onRequestError,
  }: CacheRequestParamsType<ResponseType>): Promise<ResponseType> => {
    const cache = await caches.open(this.storageCacheName);

    const networkResponse = await request();

    if (networkResponse.error) {
      onRequestError?.();

      const cacheMatch = await cache.match(`/${this.requestCacheKey}`);

      const { old, cachedResponse } = await checkIfOldCache<ResponseType>({
        timestamp: this.timestamp,
        cacheMatch,
      });

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

    onUpdateCache?.(networkResponse);

    return networkResponse;
  };
}
