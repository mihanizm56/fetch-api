import { ResponseFormatter, IResponse, JSONRPCErrorType, FormatResponseJSONRPCDataOptionsType, TranslateFunctionType } from '../types';
export declare class JSONRPCResponseFormatter extends ResponseFormatter {
    result?: any;
    error?: JSONRPCErrorType;
    translateFunction?: TranslateFunctionType;
    isErrorTextStraightToOutput?: boolean;
    statusCode: number;
    constructor({ error, result, isErrorTextStraightToOutput, translateFunction, statusCode, }: FormatResponseJSONRPCDataOptionsType);
    getAdditionalErrors: (error?: JSONRPCErrorType | undefined) => Record<string, any> | null;
    getFormattedResponse: () => IResponse;
}
