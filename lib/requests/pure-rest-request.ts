import {
  IRequestParams,
} from "@/types/types";
import { parseTypesMap, requestProtocolsMap } from "@/constants/shared";
import { BaseRequest } from "./base-request";

export class PureRestRequest extends BaseRequest {
  public getRequest = (
    requestParams: Omit<
      IRequestParams,
      "method" | "requestProtocol" | "body"
    >
  ) =>
    this.makeFetch({
      ...requestParams,
      method: "GET",
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public postRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: "POST",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public putRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: "PUT",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public patchRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: "PATCH",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public deleteRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: "DELETE",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.pureRest,
    });
}
