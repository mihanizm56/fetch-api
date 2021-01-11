/* eslint-disable no-console */

type ParamsType = {
  endpoint: string;
  errorRequestMessage: string;
  fetchBody?: any;
};

export const makeErrorRequestLogs = ({
  endpoint,
  errorRequestMessage,
  fetchBody,
}: ParamsType) => {
  console.error('(fetch-api): get error in the request', endpoint);
  console.group('Show error data');
  console.error('(fetch-api): message:', errorRequestMessage);
  console.error('(fetch-api): endpoint:', endpoint);
  console.error('(fetch-api): body params:', fetchBody);
  console.groupEnd();
};
