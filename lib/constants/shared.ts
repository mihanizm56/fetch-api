export interface IParseTypesMap {
  json: 'json';
  blob: 'blob';
  text: 'text';
}

export interface IRequestProtocolsMap {
  rest: 'rest';
  jsonRpc: 'jsonRpc';
  pureRest: 'pureRest';
}

export const parseTypesMap: IParseTypesMap = {
  json: 'json',
  blob: 'blob',
  text: 'text',
};

// todo fix similar
export const requestProtocolsMap: IRequestProtocolsMap = {
  rest: 'rest',
  jsonRpc: 'jsonRpc',
  pureRest: 'pureRest',
};

export const DEFAULT_ERROR_TEXT = 'network-error';
export const TIMEOUT_ERROR_KEY = 'timeout-error';
export const NETWORK_ERROR_KEY = 'network-error';
export const ABORTED_ERROR_TEXT_CHROME = 'The user aborted a request.';
export const ABORTED_ERROR_TEXT_MOZILLA = 'The operation was aborted. ';
export const ABORTED_ERROR_TEXT_SAFARI = 'Fetch is aborted';
export const ABORT_REQUEST_EVENT_NAME = 'abort_request_event';
