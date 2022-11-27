/* eslint-disable no-console */

type ParamsType = {
  endpoint: string;
  errorRequestMessage: string;
  fetchBody?: any;
  userAbortedRequest: boolean;
};

export const makeErrorRequestLogs = ({
  endpoint,
  errorRequestMessage,
  fetchBody,
  userAbortedRequest,
}: ParamsType) => {
  if (userAbortedRequest) {
    console.warn('(fetch-api): user aborted the request', endpoint);
    console.groupCollapsed('Show error data');
    console.warn('(fetch-api): message:', errorRequestMessage);
    console.warn('(fetch-api): endpoint:', endpoint);
    console.warn('(fetch-api): body params:', fetchBody);
    console.groupEnd();
  } else {
    console.log('(fetch-api): get error in the request', endpoint);
    console.groupCollapsed('Show error data');
    console.log('(fetch-api): message:', errorRequestMessage);
    console.log('(fetch-api): endpoint:', endpoint);
    console.log('(fetch-api): body params:', fetchBody);
    console.groupEnd();
  }
};
