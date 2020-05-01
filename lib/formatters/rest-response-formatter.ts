import {
  ResponseFormatter,
  IResponse,
  FormatResponseRESTDataOptionsType,
  TranslateFunction,
  AdditionalErrors,
} from '@/types/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';

export class RestResponseFormatter extends ResponseFormatter {
  data?: any;

  error: boolean;

  translateFunction?: TranslateFunction;

  errorText: string;

  additionalErrors: AdditionalErrors | null;

  isErrorTextStraightToOutput?: boolean;

  constructor({
    error,
    translateFunction,
    errorText,
    additionalErrors,
    data,
    isErrorTextStraightToOutput,
  }: FormatResponseRESTDataOptionsType) {
    super();

    this.error = error;
    this.translateFunction = translateFunction;
    this.errorText = errorText;
    this.additionalErrors = additionalErrors;
    this.data = data;
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
  }

  getFormattedResponse = (): IResponse => ({
    data: this.data || {},
    error: this.error,
    errorText: this.error
      ? new ErrorResponseFormatter().getFormattedErrorTextResponse({
          errorTextKey: this.errorText,
          translateFunction: this.translateFunction,
          isErrorTextStraightToOutput: this.isErrorTextStraightToOutput,
          errorTextData: this.additionalErrors
            ? this.additionalErrors.translateOptions
            : null,
        })
      : '',
    additionalErrors: this.additionalErrors ? this.additionalErrors : null,
  });
}
