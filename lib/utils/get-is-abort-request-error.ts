// The user aborted a request - CHROME
// The operation was aborted - MOZILLA
// Fetch is aborted - SAFARI

export const getIsAbortRequestError = (message: string) => {
  return /(The user aborted a request)|(The operation was aborted)|(Fetch is aborted)/.test(
    message,
  );
};
