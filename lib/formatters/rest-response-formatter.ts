import {
  ResponseFormatter,
  IResponse,
  ErrorsMap,
  FormatResponseRESTDataOptionsType,
} from '@/types/types';
import { getFormattedResponseErrorText } from '@/errors/get-formatted-response-error';

export class RestResponseFormatter extends ResponseFormatter {
  data?: any;

  error: boolean;

  errorsMap: ErrorsMap;

  errorText: string;

  additionalErrors: Record<string, any> | Array<any> | null;

  isErrorTextStraightToOutput?: boolean;

  constructor({
    error,
    errorsMap,
    errorText,
    additionalErrors,
    data,
    isErrorTextStraightToOutput,
  }: FormatResponseRESTDataOptionsType) {
    super();

    this.error = error;
    this.errorsMap = errorsMap;
    this.errorText = errorText;
    this.additionalErrors = additionalErrors;
    this.data = data;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
  }

  getFormattedResponse = (): IResponse => ({
    data: this.data || {},
    error: this.error,
    errorText: this.error
      ? getFormattedResponseErrorText({
          errorTextKey: this.errorText,
          errorsMap: this.errorsMap,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
        })
      : '',
    additionalErrors: this.additionalErrors,
  });
}
