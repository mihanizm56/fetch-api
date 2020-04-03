import { IJSONPRCRequestParams, IResponse } from "@/types/types";
import { parseTypesMap, requestProtocolsMap } from "@/constants/shared";
import { BaseRequest } from "./base-request";
import { uniqueId } from "@/utils/unique-id";

export class JSONRPCRequest extends BaseRequest {
  public makeRequest = (requestParams: IJSONPRCRequestParams): Promise<IResponse> =>
    this.makeFetch({
      ...requestParams,
      id: uniqueId('json-rpc_'),
      version:{
        "jsonrpc": "2.0"
      },
      method: "POST",
      parseType: parseTypesMap.json,
      requestProtocol: requestProtocolsMap.jsonRpc
    });
}
