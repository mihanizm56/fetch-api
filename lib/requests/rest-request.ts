import {
  IRequestParams,
} from "@/types";
import { parseTypesMap, requestProtocolsMap } from "@/constants";
import { BaseRequest } from "./base-request";

export class RestRequest extends BaseRequest {
  public getRequest = (
    requestParams: Omit<
      IRequestParams,
      "method" | "requestProtocol" | "body"
    >
  ) =>
    this.makeFetch({
      ...requestParams,
      method: "GET",
      requestProtocol: requestProtocolsMap.rest,
    });

  public postRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: "POST",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest,
    });

  public putRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: "PUT",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest,
    });

  public patchRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: "PATCH",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest,
    });

  public deleteRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: "DELETE",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.rest,
    });
}
