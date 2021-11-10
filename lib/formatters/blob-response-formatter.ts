import { ResponseFormatter, IResponse } from '@/types';

export class BlobResponseFormatter extends ResponseFormatter {
  data: Blob;

  responseHeaders: Record<string, string>;

  constructor({
    data,
    responseHeaders,
  }: {
    data: Blob;
    responseHeaders: Record<string, string>;
  }) {
    super();

    this.data = data;
    this.responseHeaders = responseHeaders;
  }

  getFormattedResponse = (): IResponse => ({
    errorText: '',
    error: false,
    data: this.data,
    additionalErrors: null,
    code: 200,
    headers: this.responseHeaders,
  });
}
