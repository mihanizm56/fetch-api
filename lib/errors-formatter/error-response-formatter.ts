import {
  IResponse,
  ErrorResponseFormatterConstructorParams,
  GetFormattedErrorTextResponseParams,
} from '@/types';
import { NETWORK_ERROR_KEY, NOT_FOUND_ERROR_KEY } from '@/constants';

interface IErrorResponseFormatter {
  getFormattedErrorResponse: (
    errorDictionaryParams: GetFormattedErrorTextResponseParams,
  ) => IResponse;

  getFormattedErrorTextResponse: (
    options: ErrorResponseFormatterConstructorParams,
  ) => string;
}

export class ErrorResponseFormatter implements IErrorResponseFormatter {
  getFormattedErrorTextResponse = ({
    errorTextKey,
    isErrorTextStraightToOutput,
    errorTextData,
    translateFunction,
    statusCode,
  }: ErrorResponseFormatterConstructorParams): string => {
    if (isErrorTextStraightToOutput) {
      return errorTextKey;
    }

    if (statusCode === 404) {
      return NOT_FOUND_ERROR_KEY;
    }

    if (translateFunction) {
      return errorTextData
        ? translateFunction(errorTextKey, errorTextData)
        : translateFunction(errorTextKey);
    }

    // eslint-disable-next-line
    console.warn(
      'no translateFunction is provided and it is not straight output',
    );

    return NETWORK_ERROR_KEY;
  };

  getFormattedErrorResponse = ({
    errorDictionaryParams,
    statusCode,
    responseHeaders,
    userAbortedRequest,
    pureResponseErrorMessage = '',
  }: GetFormattedErrorTextResponseParams): IResponse => {
    const baseParams = {
      error: true,
      data: {},
      additionalErrors: errorDictionaryParams.errorTextData || null,
      code: statusCode,
      headers: responseHeaders,
    };

    if (userAbortedRequest) {
      return {
        ...baseParams,
        errorText: pureResponseErrorMessage,
      };
    }

    return {
      ...baseParams,
      errorText: this.getFormattedErrorTextResponse(errorDictionaryParams),
    };
  };
}
