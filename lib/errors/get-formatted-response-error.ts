import { ErrorConstructorParams } from '@/types/types';
import { DEFAULT_ERROR_MESSAGE } from './constants';

export const getFormattedResponseErrorText = ({
  errorTextKey,
  errorsMap,
  locale,
  isErrorTextStraightToOutput,
}: ErrorConstructorParams): string => {
  const formattedError = !isErrorTextStraightToOutput
    ? errorsMap[errorTextKey] && errorsMap[errorTextKey][locale]
    : errorTextKey;

  return formattedError || DEFAULT_ERROR_MESSAGE;
};
