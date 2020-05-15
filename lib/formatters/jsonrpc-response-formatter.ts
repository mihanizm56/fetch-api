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

  statusCode: number;

  constructor({
    error,
    result,
    isErrorTextStraightToOutput,
    translateFunction,
    statusCode,
  }: FormatResponseJSONRPCDataOptionsType) {
    super();

    this.result = result;
    this.error = error;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
    this.translateFunction = translateFunction;
    this.statusCode = statusCode;
  }

  getFormattedResponse = (): IResponse => ({
    errorText: this.error
      ? new ErrorResponseFormatter().getFormattedErrorTextResponse({
          errorTextKey: this.isErrorTextStraightToOutput
            ? this.error.message
            : this.error.data.trKey,
          translateFunction: this.translateFunction,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
          errorTextData: this.error.data,
        })
      : '',
    error: Boolean(this.error),
    data: this.result || {},
    additionalErrors: this.error ? this.error.data : null,
    code: this.statusCode,
  });
}
