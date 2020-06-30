import {
  IResponse,
  ErrorResponseFormatterConstructorParams,
  GetFormattedErrorTextResponseParams,
} from '@/types/types';
import { NETWORK_ERROR_KEY, ABORTED_ERROR_TEXT } from '@/constants/shared';

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
  }: ErrorResponseFormatterConstructorParams): string => {
    if (isErrorTextStraightToOutput) {
      return errorTextKey;
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
  }: GetFormattedErrorTextResponseParams): IResponse => ({
    error: true,
    errorText:
      errorDictionaryParams.errorTextKey === ABORTED_ERROR_TEXT
        ? errorDictionaryParams.errorTextKey
        : this.getFormattedErrorTextResponse(errorDictionaryParams),
    data: {},
    additionalErrors: errorDictionaryParams.errorTextData || null,
    code: statusCode,
  });
}
