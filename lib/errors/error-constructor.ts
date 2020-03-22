import { getFormattedResponseErrorText } from '@/errors/get-formatted-response-error';
import { IBaseResponse, ErrorTextParams } from '@/index.d.ts';

export const errorConstructor = (
  errorOptions: ErrorTextParams,
): IBaseResponse => ({
  error: true,
  errorText: getFormattedResponseErrorText(errorOptions),
  data: {},
});
