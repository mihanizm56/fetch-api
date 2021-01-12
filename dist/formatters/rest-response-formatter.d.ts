import { ResponseFormatter, IResponse, FormatResponseRESTDataOptionsType, TranslateFunctionType, AdditionalErrors } from '../types';
export declare class RestResponseFormatter extends ResponseFormatter {
    data?: any;
    error: boolean;
    translateFunction?: TranslateFunctionType;
    errorText: string;
    additionalErrors: AdditionalErrors | null;
    isErrorTextStraightToOutput?: boolean;
    statusCode: number;
    constructor({ error, translateFunction, errorText, additionalErrors, data, isErrorTextStraightToOutput, statusCode, }: FormatResponseRESTDataOptionsType);
    getFormattedResponse: () => IResponse;
}
