import { getFormattedResponseErrorText } from '@/errors/get-formatted-response-error';
import { IResponse, ErrorConstructorParams } from '@/types/types';

export const errorResponseConstructor = (
  errorText: ErrorConstructorParams,
): IResponse => ({
  error: true,
  errorText: getFormattedResponseErrorText(errorText),
  data: {},
  additionalErrors: null,
});
