import { IResponse } from '@/types';
import {
  CacheRequestParamsType,
  IRequestCache,
  IRequestCacheParamsType,
} from '../_types';
import { NetworkFirstWithTimeout } from './network-first-with-timeout';
import { NetworkFirstSimple } from './network-first-simple';

export class NetworkFirst implements IRequestCache {
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

  cacheRequest = async <ResponseType extends { error: boolean } = IResponse>(
    params: CacheRequestParamsType<ResponseType>,
  ): Promise<ResponseType> => {
    // cache storage may be unable in untrusted origins (http) in mobile devices
    // https://stackoverflow.com/questions/53094298/window-caches-is-undefined-in-android-chrome-but-is-available-at-desktop-chrome
    if (params.disabledCache || !window.caches) {
      const response = await params.request();

      return response;
    }

    // switch between simple technique and complex with timeout
    const strategyClassParams = {
      timestamp: this.timestamp,
      storageCacheName: this.storageCacheName,
      requestCacheKey: this.requestCacheKey,
    };

    const strategyClass = params.timeout
      ? new NetworkFirstWithTimeout(strategyClassParams)
      : new NetworkFirstSimple(strategyClassParams);

    const result = await strategyClass.cacheRequest(params);

    return result;
  };
}
