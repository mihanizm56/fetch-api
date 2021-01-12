import { ResponseFormatter, IResponse } from '../types';
export declare class BlobResponseFormatter extends ResponseFormatter {
    data: Blob;
    constructor(data: Blob);
    getFormattedResponse: () => IResponse;
}
