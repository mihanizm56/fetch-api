import { IRequestParams } from '@/types';
import { requestProtocolsMap } from '@/constants';
import { getBrowserCachedRequest } from '@/utils/browser-api-cache';
import { BaseRequest } from './base-request';

export class PureRestRequest extends BaseRequest {
  public getRequest = (
    requestParams: Omit<IRequestParams, 'method' | 'requestProtocol' | 'body'>,
  ) => {
    const { browserCacheParams, ...restParams } = requestParams;

    const makeFetchParams = {
      ...restParams,
      method: 'GET',
      requestProtocol: requestProtocolsMap.pureRest,
    };

    if (browserCacheParams) {
      return getBrowserCachedRequest({
        ...browserCacheParams,
        request: () => this.makeFetch(makeFetchParams),
      });
    }

    return this.makeFetch(makeFetchParams);
  };

  public postRequest = (
    requestParams: Omit<IRequestParams, 'method' | 'requestProtocol'>,
  ) => {
    const { browserCacheParams, ...restParams } = requestParams;

    const makeFetchParams = {
      ...restParams,
      method: 'POST',
      requestProtocol: requestProtocolsMap.pureRest,
    };

    if (browserCacheParams) {
      return getBrowserCachedRequest({
        ...browserCacheParams,
        request: () => this.makeFetch(makeFetchParams),
      });
    }

    return this.makeFetch(makeFetchParams);
  };

  public putRequest = (
    requestParams: Omit<IRequestParams, 'method' | 'requestProtocol'>,
  ) => {
    const { browserCacheParams, ...restParams } = requestParams;

    const makeFetchParams = {
      ...restParams,
      method: 'PUT',
      requestProtocol: requestProtocolsMap.pureRest,
    };

    if (browserCacheParams) {
      return getBrowserCachedRequest({
        ...browserCacheParams,
        request: () => this.makeFetch(makeFetchParams),
      });
    }

    return this.makeFetch(makeFetchParams);
  };

  public patchRequest = (
    requestParams: Omit<IRequestParams, 'method' | 'requestProtocol'>,
  ) => {
    const { browserCacheParams, ...restParams } = requestParams;

    const makeFetchParams = {
      ...restParams,
      method: 'PATCH',
      requestProtocol: requestProtocolsMap.pureRest,
    };

    if (browserCacheParams) {
      return getBrowserCachedRequest({
        ...browserCacheParams,
        request: () => this.makeFetch(makeFetchParams),
      });
    }

    return this.makeFetch(makeFetchParams);
  };

  public deleteRequest = (
    requestParams: Omit<IRequestParams, 'method' | 'requestProtocol'>,
  ) => {
    const { browserCacheParams, ...restParams } = requestParams;

    const makeFetchParams = {
      ...restParams,
      method: 'DELETE',
      requestProtocol: requestProtocolsMap.pureRest,
    };

    if (browserCacheParams) {
      return getBrowserCachedRequest({
        ...browserCacheParams,
        request: () => this.makeFetch(makeFetchParams),
      });
    }

    return this.makeFetch(makeFetchParams);
  };
}
