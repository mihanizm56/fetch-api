import { checkIfOldCache } from '../_utils/check-if-old-cache';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { LOGS_STYLES } from '../_constants';
import {
  closeLogsGroup,
  logCacheIsExpired,
  logCacheIsMatched,
  logDisabledCache,
  logNotUpdatedCache,
  logParams,
  logUpdatedCache,
  openLogsGroup,
} from '../_utils/debug-logs';

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
    onRequestError,
    debug,
  }: CacheRequestParamsType<ResponseType>) => {
    openLogsGroup({ debug, requestCacheKey: this.requestCacheKey });

    logParams({
      debug,
      params: JSON.stringify({
        strategy: 'CacheFirst',
        expiresToDate,
        disabledCache,
        expires: this.timestamp + expires,
        timestamp: this.timestamp,
        storageCacheName: this.storageCacheName,
        requestCacheKey: this.requestCacheKey,
      }),
    });

    // cache storage may be unable in untrusted origins (http) in mobile devices
    // https://stackoverflow.com/questions/53094298/window-caches-is-undefined-in-android-chrome-but-is-available-at-desktop-chrome
    if (disabledCache || !window.caches) {
      const response = await request();
      logDisabledCache({ debug });
      closeLogsGroup({ debug });

      return response;
    }

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

    if (!old && cachedResponse) {
      closeLogsGroup({ debug });
      return cachedResponse;
    }

    const networkResponse = await request();

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
    } else {
      onRequestError?.();
      logNotUpdatedCache({ debug, response: JSON.stringify(networkResponse) });
    }

    closeLogsGroup({ debug });
    return networkResponse;
  };
}
