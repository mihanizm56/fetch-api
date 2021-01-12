import { ResponseParser } from '../../types';
export declare class TextParser extends ResponseParser {
    parse: (data: Response) => Promise<string>;
}
