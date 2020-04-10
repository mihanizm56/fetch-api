import {
  ResponseFormatter,
  IResponse,
  ErrorsMap,
  JSONRPCErrorType,
  FormatResponseJSONRPCDataOptionsType,
} from '@/types/types';
import { getFormattedResponseErrorText } from '@/errors/get-formatted-response-error';

export class JSONRPCResponseFormatter extends ResponseFormatter {
  result?: any;

  error?: JSONRPCErrorType;

  locale: string;

  errorsMap: ErrorsMap;

  constructor({
    error,
    locale,
    errorsMap,
    result,
  }: FormatResponseJSONRPCDataOptionsType) {
    super();

    this.result = result;
    this.error = error;
    this.locale = locale;
    this.errorsMap = errorsMap;
  }

  getFormattedResponse = (): IResponse => ({
    errorText: this.error
      ? getFormattedResponseErrorText({
          errorTextKey: this.error.data.trKey,
          errorsMap: this.errorsMap,
          locale: this.locale,
        })
      : '',
    error: Boolean(this.error),
    data: this.result || null,
    additionalErrors: this.error ? this.error.data : null,
  });
}
