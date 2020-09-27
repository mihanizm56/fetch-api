import { ResponseFormatter, IResponse } from '@/types';

export class BlobResponseFormatter extends ResponseFormatter {
  data: Blob;

  constructor(data: Blob) {
    super();

    this.data = data;
  }

  getFormattedResponse = (): IResponse => ({
    errorText: '',
    error: false,
    data: this.data,
    additionalErrors: null,
    code: 200,
  });
}
