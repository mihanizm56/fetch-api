import { IRequestParams } from '@/types';
import { parseTypesMap, requestProtocolsMap } from '@/constants';
import { getBrowserCachedRequest } from '@/utils/browser-api-cache';
import { BaseRequest } from './base-request';

export class RestRequest extends BaseRequest {
  public getRequest = (
    requestParams: Omit<
      IRequestParams,
      'method' | 'requestProtocol' | 'body' | 'pureJsonFileResponse'
    >,
  ) => {
    const { browserCacheParams, ...restParams } = requestParams;

    const makeFetchParams = {
      ...restParams,
      method: 'GET',
      requestProtocol: requestProtocolsMap.rest,
    };

    if (browserCacheParams) {
      return getBrowserCachedRequest({
        ...browserCacheParams,
        request: () => this.makeFetch(makeFetchParams),
      });
    }

    return this.makeFetch(makeFetchParams);
  };

  public postRequest = (requestParams: IRequestParams) => {
    const { browserCacheParams, ...restParams } = requestParams;

    const makeFetchParams = {
      ...restParams,
      method: 'POST',
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest,
    };

    if (browserCacheParams) {
      return getBrowserCachedRequest({
        ...browserCacheParams,
        request: () => this.makeFetch(makeFetchParams),
      });
    }

    return this.makeFetch(makeFetchParams);
  };

  public putRequest = (requestParams: IRequestParams) => {
    const { browserCacheParams, ...restParams } = requestParams;

    const makeFetchParams = {
      ...restParams,
      method: 'PUT',
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest,
    };

    if (browserCacheParams) {
      return getBrowserCachedRequest({
        ...browserCacheParams,
        request: () => this.makeFetch(makeFetchParams),
      });
    }

    return this.makeFetch(makeFetchParams);
  };

  public patchRequest = (requestParams: IRequestParams) => {
    const { browserCacheParams, ...restParams } = requestParams;

    const makeFetchParams = {
      ...restParams,
      method: 'PATCH',
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest,
    };

    if (browserCacheParams) {
      return getBrowserCachedRequest({
        ...browserCacheParams,
        request: () => this.makeFetch(makeFetchParams),
      });
    }

    return this.makeFetch(makeFetchParams);
  };

  public deleteRequest = (requestParams: IRequestParams) => {
    const { browserCacheParams, ...restParams } = requestParams;

    const makeFetchParams = {
      ...restParams,
      method: 'DELETE',
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest,
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
