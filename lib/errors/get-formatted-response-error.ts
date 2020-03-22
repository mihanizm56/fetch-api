import { ErrorTextType } from '@/index.d.ts';
import { errorsTranslationsMap, DEFAULT_ERROR_MESSAGE } from './_constants';

export const getFormattedResponseErrorText = (
  errorText: ErrorTextType,
): string => {
  const formattedError = errorsTranslationsMap[errorText];

  return formattedError || DEFAULT_ERROR_MESSAGE;
};
