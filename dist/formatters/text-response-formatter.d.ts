import { ResponseFormatter, IResponse } from '../types';
export declare class TextResponseFormatter extends ResponseFormatter {
    data: string;
    constructor(data: string);
    getFormattedResponse: () => IResponse;
}
