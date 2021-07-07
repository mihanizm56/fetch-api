import { Formatter } from '@/types';

export class HeadersFormatter extends Formatter<Headers, Record<string,string>> {
    responseHeaders: Headers;

  constructor(responseHeaders: Headers) {
    super();

    this.responseHeaders = responseHeaders;
  }

    getFormattedValue = () => {
        try {
            const result: Record<string, string> = {}

            this.responseHeaders.forEach((value:string,name:string)=>{
                result[name] = value
            })
    
            return result  
        } catch {
            return {}
        }
    }
}
