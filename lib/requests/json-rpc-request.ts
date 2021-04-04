import { IJSONPRCRequestParams, IResponse, IJSONPRCRequestFormattedBodyParams, IJSONPRCRequestBodyParams } from "@/types";
import { parseTypesMap, requestProtocolsMap } from "@/constants";
import { BaseRequest } from "./base-request";
import { uniqueId } from "@/utils/unique-id";

export class JSONRPCRequest extends BaseRequest {
  getEnrichedBody = (
    body: Array<IJSONPRCRequestBodyParams>
  ): Array<IJSONPRCRequestFormattedBodyParams> => body.map(bodyRequestData => ({
    ...bodyRequestData,
    id: uniqueId("json-rpc_"),
    jsonrpc: "2.0"
  }))

  public makeRequest = (
    requestParams: Omit<
      IJSONPRCRequestParams,
      "method" | "requestProtocol" | "id" | "version" | 'pureJsonFileResponse'
    >
  ): Promise<IResponse> =>
    this.makeFetch({
      ...requestParams,
      id: uniqueId("json-rpc_"),
      version: {
        jsonrpc: "2.0"
      },
      method: "POST",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.jsonRpc,
      body:
        requestParams.isBatchRequest &&
          requestParams.body &&
          requestParams.body instanceof Array
          ? this.getEnrichedBody(requestParams.body)
          : requestParams.body
    });
}
