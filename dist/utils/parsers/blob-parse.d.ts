import { ResponseParser } from '../../types';
export declare class BlobParser extends ResponseParser {
    parse: (data: Response) => Promise<Blob>;
}
