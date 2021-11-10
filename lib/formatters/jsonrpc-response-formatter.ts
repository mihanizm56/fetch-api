import {
  ResponseFormatter,
  IResponse,
  JSONRPCErrorType,
  FormatResponseJSONRPCDataOptionsType,
  TranslateFunctionType,
} from '@/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';
import { getOmittedObject } from '@/utils/omit';

export class JSONRPCResponseFormatter extends ResponseFormatter {
  result?: any;

  error?: JSONRPCErrorType;

  translateFunction?: TranslateFunctionType;

  isErrorTextStraightToOutput?: boolean;

  statusCode: number;

  responseHeaders: Record<string, string>;

  constructor({
    error,
    result,
    isErrorTextStraightToOutput,
    translateFunction,
    statusCode,
    responseHeaders,
  }: FormatResponseJSONRPCDataOptionsType) {
    super();

    this.result = result;
    this.error = error;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
    this.translateFunction = translateFunction;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
  }

  getAdditionalErrors = (error?: JSONRPCErrorType) => {
    if (error && error.data) {
      // omit trKey from other errors - this will be in errorText
      const formattedErrorData = getOmittedObject({
        key: 'trKey',
        object: error.data,
      });

      // if there are no keys in error data - only trKey
      if (!Object.keys(formattedErrorData).length) {
        return null;
      }

      return formattedErrorData;
    }

    return null;
  };

  getFormattedResponse = (): IResponse => ({
    errorText: this.error
      ? new ErrorResponseFormatter().getFormattedErrorTextResponse({
          errorTextKey: this.isErrorTextStraightToOutput
            ? this.error.message
            : this.error.data.trKey,
          translateFunction: this.translateFunction,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
          errorTextData: this.error.data,
          statusCode: this.statusCode,
        })
      : '',
    error: Boolean(this.error),
    data: this.result || {},
    additionalErrors: this.getAdditionalErrors(this.error),
    code: this.statusCode,
    headers: this.responseHeaders,
  });
}
