import { IRequestParams } from "@/types/types";
import { parseTypesMap, requestProtocolsMap } from "@/constants/shared";
import { BaseRequest } from "./base-request";

export class JSONRPCRequest extends BaseRequest {
  public makeRequest = (requestParams: IRequestParams) =>
    this.makeFetch({
      ...requestParams,
      method: "POST",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.jsonRpc
    });
}
