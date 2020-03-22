import { ErrorTextParams } from '@/types/types';
import { DEFAULT_ERROR_MESSAGE } from './constants';

export const getFormattedResponseErrorText = ({
  errorText,
  errorsMap,
}: ErrorTextParams) => {
  const formattedError = errorsMap[errorText];

  return formattedError || DEFAULT_ERROR_MESSAGE;
};
