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
  if (!retry) {
    return 0;
  }

  if (retryIntervalNonIncrement) {
    return retryTimeInterval;
  }

  return retryCounter * retryTimeInterval;
};
