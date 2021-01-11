import {
  ResponseFormatter,
  IResponse,
  FormatResponseRESTDataOptionsType,
  TranslateFunctionType,
  AdditionalErrors,
} from '@/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';

export class RestResponseFormatter extends ResponseFormatter {
  data?: any;

  error: boolean;

  translateFunction?: TranslateFunctionType;

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

    this.error = error || false;
    this.translateFunction = translateFunction;
    this.additionalErrors = additionalErrors;
    this.data = data || {};
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
    this.statusCode = statusCode;
    this.errorText = error
      ? new ErrorResponseFormatter().getFormattedErrorTextResponse({
          errorTextKey: errorText,
          translateFunction,
          isErrorTextStraightToOutput,
          errorTextData: additionalErrors,
          statusCode,
        })
      : '';
  }

  getFormattedResponse = (): IResponse => ({
    data: this.data,
    error: this.error,
    errorText: this.errorText,
    additionalErrors: this.additionalErrors,
    code: this.statusCode,
  });
}
