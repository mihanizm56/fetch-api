import {
  ResponseFormatter,
  IResponse,
  TranslateFunctionType,
  AdditionalErrors,
  FormatResponsePureRESTDataOptionsType,
} from '@/types';
import { ErrorResponseFormatter } from '@/errors-formatter/error-response-formatter';
import { ResponseStatusValidator } from '@/validators/response-status-validator';

export class PureRestResponseFormatter extends ResponseFormatter {
  data?: any;
  error: boolean;
  translateFunction?: TranslateFunctionType;
  errorText: string;
  additionalErrors: AdditionalErrors | null;
  isErrorTextStraightToOutput?: boolean;
  statusCode: number;
  responseHeaders: Record<string,string>;

  getPureRestErrorText = (response: any) => {
    const { error, errorText, data } = response;

    if (typeof data === 'string') {
      return data;
    }

    if (typeof errorText === 'string') {
      return errorText;
    }

    if (typeof error === 'string') {
      return error;
    }

    return '';
  };

  getPureRestAdditionalErrors = (response: any) => {
    // get necessary fields from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { additionalErrors, errorText, ...restResponce } = response;

    if (additionalErrors) {
      return additionalErrors;
    }

    // if backend wont give us a special field for error parameters
    // we will keep all data in additionalErrors IResponse field
    return restResponce;
  };

  constructor({
    isErrorTextStraightToOutput,
    statusCode,
    translateFunction,
    data,
    responseHeaders
  }: FormatResponsePureRESTDataOptionsType) {
    super();

    const isResponseStatusSuccess = ResponseStatusValidator.getIsStatusCodeSuccess(statusCode);
    const errorTextKey = !isResponseStatusSuccess
      ? this.getPureRestErrorText(data)
      : '';
    const additionalErrors = !isResponseStatusSuccess
      ? this.getPureRestAdditionalErrors(data)
      : null;

    this.error = !isResponseStatusSuccess;
    this.translateFunction = translateFunction;
    this.data = isResponseStatusSuccess ? data : {};
    this.isErrorTextStraightToOutput = isErrorTextStraightToOutput;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;

    this.errorText = !isResponseStatusSuccess
      ? new ErrorResponseFormatter().getFormattedErrorTextResponse({
          errorTextKey,
          translateFunction,
          isErrorTextStraightToOutput,
          errorTextData: additionalErrors,
          statusCode,
        })
      : '';
    this.additionalErrors = additionalErrors;
  }

  getFormattedResponse = (): IResponse => ({
    data: this.data,
    error: this.error,
    errorText: this.errorText,
    additionalErrors: this.additionalErrors,
    code: this.statusCode,
    headers: this.responseHeaders
  });
}
