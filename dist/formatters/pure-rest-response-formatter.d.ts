import { ResponseFormatter, IResponse, TranslateFunctionType, AdditionalErrors, FormatResponsePureRESTDataOptionsType } from '../types';
export declare class PureRestResponseFormatter extends ResponseFormatter {
    data?: any;
    error: boolean;
    translateFunction?: TranslateFunctionType;
    errorText: string;
    additionalErrors: AdditionalErrors | null;
    isErrorTextStraightToOutput?: boolean;
    statusCode: number;
    getPureRestErrorText: (response: any) => string;
    getPureRestAdditionalErrors: (response: any) => any;
    constructor({ isErrorTextStraightToOutput, statusCode, translateFunction, data, }: FormatResponsePureRESTDataOptionsType);
    getFormattedResponse: () => IResponse;
}
