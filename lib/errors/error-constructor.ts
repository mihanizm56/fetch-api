import { getFormattedResponseErrorText } from '@/errors/get-formatted-response-error';
import { IBaseResponse, ErrorTextType } from '@/_types/types';

export const errorConstructor = (errorText: ErrorTextType): IBaseResponse => ({
  error: true,
  errorText: getFormattedResponseErrorText(errorText),
  data: {},
});
