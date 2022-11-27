import { IResponse } from '@/types';
import { checkIfOldCache } from '../_utils/check-if-old-cache';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { DebugCacheLogger } from '../_utils/debug-cache-logger';

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
    debug,
  }: CacheRequestParamsType<ResponseType>): Promise<ResponseType> => {
    let resolved = false;

    this.debugCacheLogger.openLogsGroup({
      debug,
      requestCacheKey: this.requestCacheKey,
    });

    this.debugCacheLogger.logParams({
      debug,
      params: JSON.stringify({
        strategy: 'StaleWhileRevalidate',
        expiresToDate,
        disabledCache,
        expires: this.timestamp + (expires || 0),
        timestamp: this.timestamp,
        storageCacheName: this.storageCacheName,
        requestCacheKey: this.requestCacheKey,
      }),
    });

    // cache storage may be unable in untrusted origins (http) in mobile devices
    // https://stackoverflow.com/questions/53094298/window-caches-is-undefined-in-android-chrome-but-is-available-at-desktop-chrome
    if (disabledCache || !window.caches) {
      this.debugCacheLogger.logDisabledCache({ debug });
      this.debugCacheLogger.closeLogsGroup({ debug });
      return request();
    }

    return new Promise(async (resolve) => {
      const cache = await caches.open(this.storageCacheName);

      const cacheMatch = await cache.match(`/${this.requestCacheKey}`);
      this.debugCacheLogger.logCacheIsMatched({
        debug,
        cacheMatched: Boolean(cacheMatch),
      });

      const { old, cachedResponse } = await checkIfOldCache<ResponseType>({
        timestamp: this.timestamp,
        cacheMatch,
      });

      if (old) {
        this.debugCacheLogger.logCacheIsExpired({ debug });
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
          this.debugCacheLogger.logUpdatedCache({ debug, value: updatedValue });
        } else {
          onRequestError?.();
          this.debugCacheLogger.logNotUpdatedCache({
            debug,
            response: JSON.stringify(networkResponse),
          });
        }

        if (!resolved) {
          this.debugCacheLogger.closeLogsGroup({ debug }); // end here because we want all logs
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
