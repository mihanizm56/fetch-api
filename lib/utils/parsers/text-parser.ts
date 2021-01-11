import { ResponseParser } from '@/types';

export class TextParser extends ResponseParser {
  parse = (data: Response) => data.text();
}
