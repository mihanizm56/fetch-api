import { ResponseParser } from '../../types';
export declare class JsonParser extends ResponseParser {
    parse: (data: Response) => Promise<any>;
}
