import {
  IResponse,
  ErrorResponseFormatterConstructorParams,
} from '@/types/types';
import { DEFAULT_ERROR_TEXT } from '@/constants/shared';

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
    isErrorTextStraightToOutput,
    errorTextData,
    translateFunction,
  }: ErrorResponseFormatterConstructorParams): string => {
    if (isErrorTextStraightToOutput) {
      return errorTextKey;
    }

    if (translateFunction) {
      return translateFunction(errorTextKey, errorTextData);
    }

    // eslint-disable-next-line
    console.warn(
      'no translateFunction is provided and it is not straight output',
    );

    return DEFAULT_ERROR_TEXT;
  };

  getFormattedErrorResponse = (
    errorDictionaryParams: ErrorResponseFormatterConstructorParams,
  ): IResponse => ({
    error: true,
    errorText: new ErrorResponseFormatter().getFormattedErrorTextResponse(
      errorDictionaryParams,
    ),
    data: {},
    additionalErrors: errorDictionaryParams.errorTextData || null,
  });
}
