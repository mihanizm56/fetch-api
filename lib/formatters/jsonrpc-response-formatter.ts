import {
  ResponseFormatter,
  IResponse,
  JSONRPCErrorType,
  FormatResponseJSONRPCDataOptionsType,
  TranslateFunction,
} from '@/types/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';

export class JSONRPCResponseFormatter extends ResponseFormatter {
  result?: any;

  error?: JSONRPCErrorType;

  translateFunction?: TranslateFunction;

  isErrorTextStraightToOutput?: boolean;

  constructor({
    error,
    result,
    isErrorTextStraightToOutput,
    translateFunction,
  }: FormatResponseJSONRPCDataOptionsType) {
    super();

    this.result = result;
    this.error = error;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
    this.translateFunction = translateFunction;
  }

  getFormattedResponse = (): IResponse => ({
    errorText: this.error
      ? new ErrorResponseFormatter().getFormattedErrorTextResponse({
          errorTextKey: this.isErrorTextStraightToOutput
            ? this.error.message
            : this.error.data.trKey,
          translateFunction: this.translateFunction,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
          errorTextData: this.error.data.trData,
        })
      : '',
    error: Boolean(this.error),
    data: this.result || {},
    additionalErrors: this.error ? this.error.data : null,
  });
}
