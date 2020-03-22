import { IRequestParams, parseTypesMap } from '@/_types/types';
import { BaseRequest } from './base-request';

export class RestRequest extends BaseRequest {
  public getRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: 'GET',
      parseType: parseTypesMap.json,
    });

  public postRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: 'POST',
      parseType: parseTypesMap.json,
    });

  public putRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: 'PUT',
      parseType: parseTypesMap.json,
    });

  public patchRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: 'PATCH',
      parseType: parseTypesMap.json,
    });

  public deleteRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: 'DELETE',
      parseType: parseTypesMap.json,
    });

  public getBlobRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: 'GET',
      parseType: parseTypesMap.blob,
    });
}
