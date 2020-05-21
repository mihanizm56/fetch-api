import { ResponseFormatter, IResponse } from '@/types/types';

export class TextResponseFormatter extends ResponseFormatter {
  data: string;

  constructor(data: string) {
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
