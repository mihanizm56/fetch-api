import { ProgressOptionsType, ResponseParser } from '../../types';
import { parseTypesMap } from '../../constants/shared';
declare type ProgressParseOptionsType = {
    progressOptions: ProgressOptionsType;
    parseType: keyof typeof parseTypesMap;
};
export declare const progressParse: (response: Response, { progressOptions: { onProgress, onLoaded }, parseType, }: ProgressParseOptionsType) => Promise<any>;
export declare class ProgressParser extends ResponseParser {
    parse: (data: Response, options: ProgressParseOptionsType) => Promise<any>;
}
export {};
