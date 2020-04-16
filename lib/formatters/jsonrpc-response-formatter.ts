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

  errorsMap: ErrorsMap;

  isErrorTextStraightToOutput?: boolean;

  constructor({
    error,
    errorsMap,
    result,
    isErrorTextStraightToOutput,
  }: FormatResponseJSONRPCDataOptionsType) {
    super();

    this.result = result;
    this.error = error;
    this.errorsMap = errorsMap;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
  }

  getFormattedResponse = (): IResponse => ({
    errorText: this.error
      ? getFormattedResponseErrorText({
          errorTextKey: this.isErrorTextStraightToOutput
            ? this.error.message
            : this.error.data.trKey,
          errorsMap: this.errorsMap,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
        })
      : '',
    error: Boolean(this.error),
    data: this.result || null,
    additionalErrors: this.error ? this.error.data : null,
  });
}
