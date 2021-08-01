type ParamsType = {
  retryCounter?: number;
  retryTimeInterval?: number;
  retryIntervalNonIncrement?: boolean;
  retry?: number;
};

export const getSleepTimeBeforeRetry = ({
  retry,
  retryCounter = 1,
  retryTimeInterval = 1000,
  retryIntervalNonIncrement,
}: ParamsType): number => {
  if (retryIntervalNonIncrement || !retry) {
    return 0;
  }

  return retryCounter * retryTimeInterval;
};
