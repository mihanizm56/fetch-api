export interface IParseTypesMap {
  json: 'json';
  blob: 'blob';
}

export interface IRequestProtocolsMap {
  rest: 'rest';
  jsonRpc: 'jsonRpc';
  pureRest: 'pureRest';
}

export const parseTypesMap: IParseTypesMap = {
  json: 'json',
  blob: 'blob',
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
