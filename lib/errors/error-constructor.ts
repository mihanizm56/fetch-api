import { getFormattedResponseErrorText } from '@/errors/get-formatted-response-error';
import { IBaseResponse, ErrorTextType } from '@/index.d.ts';

export const errorConstructor = (errorText: ErrorTextType): IBaseResponse => ({
  error: true,
  errorText: getFormattedResponseErrorText(errorText),
  data: {},
});
