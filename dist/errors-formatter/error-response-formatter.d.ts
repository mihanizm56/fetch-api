import { IResponse, ErrorResponseFormatterConstructorParams, GetFormattedErrorTextResponseParams } from '../types';
interface IErrorResponseFormatter {
    getFormattedErrorResponse: (errorDictionaryParams: GetFormattedErrorTextResponseParams) => IResponse;
    getFormattedErrorTextResponse: (options: ErrorResponseFormatterConstructorParams) => string;
}
export declare class ErrorResponseFormatter implements IErrorResponseFormatter {
    getFormattedErrorTextResponse: ({ errorTextKey, isErrorTextStraightToOutput, errorTextData, translateFunction, statusCode, }: ErrorResponseFormatterConstructorParams) => string;
    getFormattedErrorResponse: ({ errorDictionaryParams, statusCode, }: GetFormattedErrorTextResponseParams) => IResponse;
}
export {};
