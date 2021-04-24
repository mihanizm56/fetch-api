import { ExtraVerifyRetryCallbackType, IResponse } from '@/types';

type ParamsType = {
  formattedResponseData: IResponse;
  retry?: number;
  retryCounter?: number;
  extraVerifyRetry?: ExtraVerifyRetryCallbackType;
};

export const checkToDoRetry = ({
  retry,
  retryCounter,
  extraVerifyRetry,
  formattedResponseData,
}: ParamsType): boolean => {
  if (
    typeof retry === 'undefined' ||
    typeof retryCounter === 'undefined' ||
    retryCounter >= retry
  ) {
    return false;
  }

  if (extraVerifyRetry) {
    return extraVerifyRetry({ formattedResponseData });
  }

  return formattedResponseData.error;
};
