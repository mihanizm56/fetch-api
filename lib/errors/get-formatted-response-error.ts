import { ErrorConstructorParams } from '@/types/types';
import { NETWORK_ERROR_KEY } from '@/constants/shared';

export const getFormattedResponseErrorText = ({
  errorTextKey,
  languageDictionary,
  isErrorTextStraightToOutput,
}: ErrorConstructorParams): string => {
  if (isErrorTextStraightToOutput) {
    return errorTextKey;
  }

  const dictNetworkError = languageDictionary[NETWORK_ERROR_KEY]
    ? languageDictionary[NETWORK_ERROR_KEY].text
    : NETWORK_ERROR_KEY;

  const formattedError = languageDictionary[errorTextKey]
    ? languageDictionary[errorTextKey].text
    : dictNetworkError;

  if (Boolean(formattedError)) {
    return formattedError;
  }

  return dictNetworkError;
};
