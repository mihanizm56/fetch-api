import { ErrorConstructorParams } from '@/types/types';
import { DEFAULT_ERROR_MESSAGE } from './constants';

export const getFormattedResponseErrorText = ({
  errorTextKey,
  errorsMap,
  locale,
}: ErrorConstructorParams): string => {
  const formattedError =
    errorsMap[errorTextKey] && errorsMap[errorTextKey][locale];

  return formattedError || DEFAULT_ERROR_MESSAGE;
};
