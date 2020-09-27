import {
  ResponseFormatter,
  IResponse,
  FormatResponseRESTDataOptionsType,
  TranslateFunction,
  AdditionalErrors,
} from '@/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';

export class RestResponseFormatter extends ResponseFormatter {
  data?: any;

  error: boolean;

  translateFunction?: TranslateFunction;

  errorText: string;

  additionalErrors: AdditionalErrors | null;

  isErrorTextStraightToOutput?: boolean;

  statusCode: number;

  constructor({
    error,
    translateFunction,
    errorText,
    additionalErrors,
    data,
    isErrorTextStraightToOutput,
    statusCode,
  }: FormatResponseRESTDataOptionsType) {
    super();

    this.error = error;
    this.translateFunction = translateFunction;
    this.errorText = errorText;
    this.additionalErrors = additionalErrors;
    this.data = data;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
    this.statusCode = statusCode;
  }

  getFormattedResponse = (): IResponse => ({
    data: this.data || {},
    error: this.error || false,
    errorText: this.error
      ? new ErrorResponseFormatter().getFormattedErrorTextResponse({
          errorTextKey: this.errorText,
          translateFunction: this.translateFunction,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
          errorTextData: this.additionalErrors,
          statusCode: this.statusCode,
        })
      : '',
    additionalErrors: this.additionalErrors,
    code: this.statusCode,
  });
}
