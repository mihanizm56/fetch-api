import { IJSONPRCRequestParams, IResponse } from "@/types/types";
import { parseTypesMap, requestProtocolsMap } from "@/constants/shared";
import { BaseRequest } from "./base-request";
import { uniqueId } from "@/utils/unique-id";

export class JSONRPCRequest extends BaseRequest {
  public makeRequest = (
    requestParams: Omit<IJSONPRCRequestParams, "method" | "requestProtocol"|"id"|"version">
  ): Promise<IResponse> =>
    this.makeFetch({
      ...requestParams,
      headers: {
        ...requestParams.headers,
        "content-type": "application/json",
      },
      id: uniqueId("json-rpc_"),
      version: {
        jsonrpc: "2.0",
      },
      method: "POST",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.jsonRpc,
    });
}
