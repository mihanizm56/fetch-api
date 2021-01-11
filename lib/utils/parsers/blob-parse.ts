import { ResponseParser } from '@/types';

export class BlobParser extends ResponseParser {
  parse = (data: Response) => data.blob();
}
