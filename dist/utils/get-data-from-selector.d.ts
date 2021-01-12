import { CustomSelectorDataType } from '../types';
declare type ParamsType = {
    selectData?: string;
    responseData: any;
    customSelectorData?: CustomSelectorDataType;
};
export declare const getDataFromSelector: ({ selectData, responseData, customSelectorData, }: ParamsType) => any;
export {};
