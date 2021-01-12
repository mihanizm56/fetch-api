import { ResponseFormatter, TranslateFunctionType, IJSONRPCPureResponse, IResponse, IJSONPRCRequestFormattedBodyParams } from '../types';
declare type ParamsType = {
    data: Array<IJSONRPCPureResponse>;
    isErrorTextStraightToOutput?: boolean;
    statusCode: number;
    translateFunction?: TranslateFunctionType;
    responseSchema?: Array<any>;
    body?: Array<IJSONPRCRequestFormattedBodyParams>;
};
export declare class JSONRPCBatchResponseFormatter extends ResponseFormatter {
    data: Array<IJSONRPCPureResponse>;
    isErrorTextStraightToOutput?: boolean;
    statusCode: number;
    responseSchema?: Array<any>;
    translateFunction?: TranslateFunctionType;
    body?: Array<IJSONPRCRequestFormattedBodyParams>;
    constructor({ data, isErrorTextStraightToOutput, statusCode, translateFunction, responseSchema, body, }: ParamsType);
    getFormattedData: () => IResponse[];
    getFormattedResponse: () => IResponse;
}
export {};
