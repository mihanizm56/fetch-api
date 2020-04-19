import { ErrorConstructorParams } from '@/types/types';

export const getFormattedResponseErrorText = ({
  errorTextKey,
  languageDictionary,
  isErrorTextStraightToOutput,
}: ErrorConstructorParams): string => {
  const formattedError = !isErrorTextStraightToOutput
    ? languageDictionary[errorTextKey]
    : errorTextKey;

  return formattedError || languageDictionary['network-error'];
};
