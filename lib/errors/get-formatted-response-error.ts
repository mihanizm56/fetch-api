import { ErrorTextParams } from '@/index.d.ts';
import { DEFAULT_ERROR_MESSAGE } from './_constants';

export const getFormattedResponseErrorText = ({
  errorText,
  errorsMap,
}: ErrorTextParams) => {
  const formattedError = errorsMap[errorText];

  return formattedError || DEFAULT_ERROR_MESSAGE;
};
