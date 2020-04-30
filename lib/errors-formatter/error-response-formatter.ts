import {
  IResponse,
  ErrorResponseFormatterConstructorParams,
} from '@/types/types';
import { NETWORK_ERROR_KEY } from '@/constants/shared';

interface IErrorResponseFormatter {
  getFormattedErrorResponse: (
    errorDictionaryParams: ErrorResponseFormatterConstructorParams,
  ) => IResponse;

  getFormattedErrorTextResponse: (
    options: ErrorResponseFormatterConstructorParams,
  ) => string;
}

export class ErrorResponseFormatter implements IErrorResponseFormatter {
  getFormattedErrorTextResponse = ({
    errorTextKey,
    languageDictionary,
    isErrorTextStraightToOutput,
  }: ErrorResponseFormatterConstructorParams): string => {
    if (isErrorTextStraightToOutput) {
      return errorTextKey;
    }

    const dictNetworkError = languageDictionary[NETWORK_ERROR_KEY]
      ? languageDictionary[NETWORK_ERROR_KEY].text
      : NETWORK_ERROR_KEY;

    const formattedError = languageDictionary[errorTextKey]
      ? languageDictionary[errorTextKey].text
      : dictNetworkError;

    if (Boolean(formattedError)) {
      return formattedError;
    }

    return dictNetworkError;
  };

  getFormattedErrorResponse = (
    errorDictionaryParams: ErrorResponseFormatterConstructorParams,
  ): IResponse => ({
    error: true,
    errorText: new ErrorResponseFormatter().getFormattedErrorTextResponse(
      errorDictionaryParams,
    ),
    data: {},
    additionalErrors: null,
  });
}
