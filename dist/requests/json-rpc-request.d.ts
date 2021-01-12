import { IJSONPRCRequestParams, IResponse, IJSONPRCRequestFormattedBodyParams, IJSONPRCRequestBodyParams } from "../types";
import { BaseRequest } from "./base-request";
export declare class JSONRPCRequest extends BaseRequest {
    getEnrichedBody: (body: IJSONPRCRequestBodyParams[]) => IJSONPRCRequestFormattedBodyParams[];
    makeRequest: (requestParams: Pick<IJSONPRCRequestParams, "headers" | "body" | "mode" | "endpoint" | "parseType" | "queryParams" | "translateFunction" | "responseSchema" | "isErrorTextStraightToOutput" | "extraValidationCallback" | "customTimeout" | "isBatchRequest" | "abortRequestId" | "arrayFormat" | "progressOptions" | "customSelectorData" | "selectData" | "retry" | "cache" | "credentials" | "integrity" | "keepalive" | "redirect" | "referrer" | "referrerPolicy" | "signal" | "window">) => Promise<IResponse>;
}
