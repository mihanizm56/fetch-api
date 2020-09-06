import {
  IResponse,
  ErrorResponseFormatterConstructorParams,
  GetFormattedErrorTextResponseParams,
} from '@/types/types';
import {
  NETWORK_ERROR_KEY,
  ABORTED_ERROR_TEXT_CHROME,
  ABORTED_ERROR_TEXT_SAFARI,
  ABORTED_ERROR_TEXT_MOZILLA,
  NOT_FOUND_ERROR_KEY,
} from '@/constants/shared';

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
  }: GetFormattedErrorTextResponseParams): IResponse => {
    const isAbortError =
      errorDictionaryParams.errorTextKey === ABORTED_ERROR_TEXT_CHROME ||
      errorDictionaryParams.errorTextKey === ABORTED_ERROR_TEXT_MOZILLA ||
      errorDictionaryParams.errorTextKey === ABORTED_ERROR_TEXT_SAFARI;

    return {
      error: true,
      errorText: isAbortError
        ? errorDictionaryParams.errorTextKey
        : this.getFormattedErrorTextResponse(errorDictionaryParams),
      data: {},
      additionalErrors: errorDictionaryParams.errorTextData || null,
      code: statusCode,
    };
  };
}
