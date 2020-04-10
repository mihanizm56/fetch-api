import { getFormattedResponseErrorText } from '@/errors/get-formatted-response-error';
import { IResponse, ErrorConstructorParams } from '@/types/types';

export const errorResponseConstructor = (
  errorDictionaryParams: ErrorConstructorParams,
): IResponse => ({
  error: true,
  errorText: getFormattedResponseErrorText(errorDictionaryParams),
  data: {},
  additionalErrors: null,
});
