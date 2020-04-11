import { IRequestParams, ComplexRequestParams, SimpleRequestParams } from "@/types/types";
import { parseTypesMap, requestProtocolsMap } from "@/constants/shared";
import { BaseRequest } from "./base-request";

export class RestRequest extends BaseRequest {
  public getRequest = (
    requestParams: Omit<IRequestParams, "method" | "requestProtocol" | "body" | "parseType">
  ) =>
    this.makeFetch({
      ...requestParams,
      method: "GET",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest
    });

  public postRequest = (
    requestParams: ComplexRequestParams
  ) =>
    this.makeFetch({
      ...requestParams,
      method: "POST",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest
    });

  public putRequest = (
    requestParams: ComplexRequestParams
  ) =>
    this.makeFetch({
      ...requestParams,
      method: "PUT",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest
    });

  public patchRequest = (
    requestParams: ComplexRequestParams
  ) =>
    this.makeFetch({
      ...requestParams,
      method: "PATCH",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest
    });

  public deleteRequest = (
    requestParams: SimpleRequestParams
  ) =>
    this.makeFetch({
      ...requestParams,
      method: "DELETE",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest
    });

  public getBlobRequest = (
    requestParams: SimpleRequestParams
  ) =>
    this.makeFetch({
      ...requestParams,
      method: "GET",
      parseType: parseTypesMap.blob,
      requestProtocol: requestProtocolsMap.rest
    });
}
