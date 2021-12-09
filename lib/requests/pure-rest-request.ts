import {
  IRequestParams,
} from "@/types";
import { requestProtocolsMap } from "@/constants";
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

  public postRequest = (requestParams: Omit<
    IRequestParams,
    "method" | "requestProtocol"
  >) =>
    this.makeFetch({
      ...requestParams,
      method: "POST",
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public putRequest = (requestParams: Omit<
    IRequestParams,
    "method" | "requestProtocol"
  >) =>
    this.makeFetch({
      ...requestParams,
      method: "PUT",
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public patchRequest = (requestParams: Omit<
    IRequestParams,
    "method" | "requestProtocol"
  >) =>
    this.makeFetch({
      ...requestParams,
      method: "PATCH",
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public deleteRequest = (requestParams: Omit<
    IRequestParams,
    "method" | "requestProtocol"
  >) =>
    this.makeFetch({
      ...requestParams,
      method: "DELETE",
      requestProtocol: requestProtocolsMap.pureRest,
    });
}
