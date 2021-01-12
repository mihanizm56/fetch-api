import { ResponseFormatter, FormatResponseParamsType } from '../types';
export interface IFormatResponseFactory {
    createFormatter: (params: FormatResponseParamsType) => ResponseFormatter;
}
export declare class FormatResponseFactory implements IFormatResponseFactory {
    createFormatter: ({ translateFunction, protocol, data, error, errorText, additionalErrors, result, jsonrpc, id, isErrorTextStraightToOutput, parseType, statusCode, isBatchRequest, body, responseSchema, }: FormatResponseParamsType) => ResponseFormatter;
}
