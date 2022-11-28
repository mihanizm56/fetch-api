import { IResponse } from '@/types';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { DebugCacheLogger } from '../_utils/debug-cache-logger';
import { NetworkFirstWithTimeout } from './network-first-with-timeout';
import { NetworkFirstSimple } from './network-first-simple';

export class NetworkFirst implements IRequestCache {
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

  cacheRequest = async <ResponseType extends { error: boolean } = IResponse>(
    params: CacheRequestParamsType<ResponseType>,
  ): Promise<ResponseType> => {
    this.debugCacheLogger.openLogsGroup({
      requestCacheKey: this.requestCacheKey,
    });

    this.debugCacheLogger.logParams({
      params: JSON.stringify({
        strategy: 'NetworkFirst',
        expiresToDate: params.expiresToDate,
        disabledCache: params.disabledCache,
        expires: this.timestamp + (params.expires || 0),
        timestamp: this.timestamp,
        storageCacheName: this.storageCacheName,
        requestCacheKey: this.requestCacheKey,
      }),
    });

    // cache storage may be unable in untrusted origins (http) in mobile devices
    // https://stackoverflow.com/questions/53094298/window-caches-is-undefined-in-android-chrome-but-is-available-at-desktop-chrome
    if (params.disabledCache || !window.caches) {
      const response = await params.request();
      this.debugCacheLogger.logDisabledCache();
      this.debugCacheLogger.closeLogsGroup();

      return response;
    }

    // switch between simple technique and complex with timeout
    const strategyClassParams = {
      timestamp: this.timestamp,
      storageCacheName: this.storageCacheName,
      requestCacheKey: this.requestCacheKey,
      debugCacheLogger: this.debugCacheLogger,
    };

    const strategyClass = params.timeout
      ? new NetworkFirstWithTimeout(strategyClassParams)
      : new NetworkFirstSimple(strategyClassParams);

    const result = await strategyClass.cacheRequest(params);

    // todo fix request update cache with timer
    this.debugCacheLogger.closeLogsGroup();
    return result;
  };
}
