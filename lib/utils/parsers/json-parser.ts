import { ResponseParser } from '@/types';

export class JsonParser extends ResponseParser {
  parse = (data: Response) => data.json();
}
