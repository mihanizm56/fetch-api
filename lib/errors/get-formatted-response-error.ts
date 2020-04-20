import { ErrorConstructorParams } from '@/types/types';

export const getFormattedResponseErrorText = ({
  errorTextKey,
  languageDictionary,
  isErrorTextStraightToOutput,
}: ErrorConstructorParams): string => {
  const NETWORK_ERROR_KEY = 'network-error';
  const dictNetworkError = languageDictionary[NETWORK_ERROR_KEY];

  const formattedError = isErrorTextStraightToOutput
    ? errorTextKey
    : languageDictionary[errorTextKey];

  if (Boolean(formattedError)) {
    return formattedError;
  }

  if (Boolean(dictNetworkError)) {
    return dictNetworkError;
  }

  return NETWORK_ERROR_KEY;
};
