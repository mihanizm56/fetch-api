type ParamsType = {
  retryCounter?: number;
  retryTimeInterval?: number;
  retryIntervalNonIncrement?: boolean;
};

export const getSleepTimeBeforeRetry = ({
  retryCounter = 1,
  retryTimeInterval = 1000,
  retryIntervalNonIncrement,
}: ParamsType): number => {
  if (retryIntervalNonIncrement) {
    return 0;
  }

  return retryCounter * retryTimeInterval;
};
