import { IRESTPureResponse, GetIsSchemaResponseValidParams, GetCompareIdsParams, GetFormatValidateMethodParams, IJSONRPCPureResponse, FormatValidateParams } from '../types';
export declare type FormatValidateParamsMehod = (options: FormatValidateParams) => boolean;
interface IResponseFormatValidator {
    getIsRestFormatResponseValid: (response: IRESTPureResponse) => boolean;
    getIsJSONRPCFormatResponseValid: (params: IJSONRPCPureResponse) => boolean;
    getIsSchemaResponseValid: (params: GetIsSchemaResponseValidParams) => {
        error: boolean;
        errorText: string;
    };
    getCompareIds: ({ requestId, responceId }: GetCompareIdsParams) => boolean;
    getRestFormatIsValid: (response: any) => boolean;
    getJSONRPCFormatIsValid: (response: any) => boolean;
    getFormatValidateMethod: (params: GetFormatValidateMethodParams) => any;
}
export declare class FormatDataTypeValidator implements IResponseFormatValidator {
    getIsRestFormatResponseValid: (response: IRESTPureResponse) => boolean;
    getIsJSONRPCFormatResponseValid: (response: IJSONRPCPureResponse) => boolean;
    getIsSchemaResponseValid: ({ data, error, schema, }: GetIsSchemaResponseValidParams) => {
        error: boolean;
        errorText: string;
    };
    getCompareIds: ({ requestId, responceId }: GetCompareIdsParams) => boolean;
    getRestFormatIsValid: ({ response, schema }: any) => boolean;
    checkIdsEquality: ({ prev, curr }: {
        prev: string;
        curr: string;
    }) => boolean;
    getJSONRPCFormatIsValid: ({ response, schema, prevId, isBatchRequest, }: any) => boolean;
    getPureRestFormatIsValid: ({ response, schema, isResponseStatusSuccess, isStatusEmpty, }: FormatValidateParams) => boolean;
    getFormatValidateMethod: ({ protocol, extraValidationCallback, }: GetFormatValidateMethodParams) => FormatValidateParamsMehod;
}
export {};
