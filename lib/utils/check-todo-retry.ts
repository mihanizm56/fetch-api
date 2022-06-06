import { ExtraVerifyRetryCallbackType, IResponse } from '@/types';
import { getIsRequestOnline } from './get-is-request-online';

type ParamsType = {
  formattedResponseData: IResponse;
  retry?: number;
  retryCounter?: number;
  extraVerifyRetry?: ExtraVerifyRetryCallbackType;
  notRetryWhenOffline?: boolean;
};

export const checkToDoRetry = ({
  retry,
  retryCounter,
  extraVerifyRetry,
  formattedResponseData,
  notRetryWhenOffline,
}: ParamsType): boolean => {
  // check if there was no connection
  const isOnlineRequest = getIsRequestOnline();

  if (!isOnlineRequest && notRetryWhenOffline) {
    return false;
  }

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
