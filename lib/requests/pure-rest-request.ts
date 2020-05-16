import {
  IRequestParams,
  ComplexRequestParams,
  SimpleRequestParams,
} from "@/types/types";
import { parseTypesMap, requestProtocolsMap } from "@/constants/shared";
import { BaseRequest } from "./base-request";

export class PureRestRequest extends BaseRequest {
  public getRequest = (
    requestParams: Omit<
      IRequestParams,
      "method" | "requestProtocol" | "body" | "parseType"
    >
  ) =>
    this.makeFetch({
      ...requestParams,
      method: "GET",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public postRequest = (requestParams: ComplexRequestParams) =>
    this.makeFetch({
      ...requestParams,
      headers: {
        ...requestParams.headers,
        "Content-type": "application/json",
      },
      method: "POST",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public putRequest = (requestParams: ComplexRequestParams) =>
    this.makeFetch({
      ...requestParams,
      headers: {
        ...requestParams.headers,
        "Content-type": "application/json",
      },
      method: "PUT",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public patchRequest = (requestParams: ComplexRequestParams) =>
    this.makeFetch({
      ...requestParams,
      headers: {
        ...requestParams.headers,
        "Content-type": "application/json",
      },
      method: "PATCH",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.pureRest,
    });

  public deleteRequest = (requestParams: SimpleRequestParams) =>
    this.makeFetch({
      ...requestParams,
      headers: {
        ...requestParams.headers,
        "Content-type": "application/json",
      },
      method: "DELETE",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.pureRest,
    });
}
