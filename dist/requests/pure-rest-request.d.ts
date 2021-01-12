import { IRequestParams } from "../types";
import { BaseRequest } from "./base-request";
export declare class PureRestRequest extends BaseRequest {
    getRequest: (requestParams: Pick<IRequestParams, "headers" | "mode" | "endpoint" | "parseType" | "queryParams" | "translateFunction" | "responseSchema" | "isErrorTextStraightToOutput" | "extraValidationCallback" | "customTimeout" | "isBatchRequest" | "abortRequestId" | "arrayFormat" | "progressOptions" | "customSelectorData" | "selectData" | "retry" | "cache" | "credentials" | "integrity" | "keepalive" | "redirect" | "referrer" | "referrerPolicy" | "signal" | "window">) => Promise<import("../types").IResponse>;
    postRequest: (requestParams: IRequestParams) => Promise<import("../types").IResponse>;
    putRequest: (requestParams: IRequestParams) => Promise<import("../types").IResponse>;
    patchRequest: (requestParams: IRequestParams) => Promise<import("../types").IResponse>;
    deleteRequest: (requestParams: IRequestParams) => Promise<import("../types").IResponse>;
}
