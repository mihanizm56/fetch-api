import { parseTypesMap } from '../../constants/shared';
import { ProgressOptionsType, ResponseParser } from '../../types';
declare type GetParserOptions = {
    parseType?: keyof typeof parseTypesMap;
    isResponseStatusSuccess: boolean;
    isNotFound: boolean;
    progressOptions?: ProgressOptionsType;
};
interface IResponseDataParserFactory {
    getParser: (options: GetParserOptions) => ResponseParser;
}
export declare class ResponseDataParserFactory implements IResponseDataParserFactory {
    getParser: ({ parseType, isResponseStatusSuccess, isNotFound, progressOptions, }: GetParserOptions) => ResponseParser;
}
export {};
