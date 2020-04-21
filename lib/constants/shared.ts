export interface IParseTypesMap {
  json: 'json';
  blob: 'blob';
}

export interface IRequestProtocolsMap {
  rest: 'rest';
  jsonRpc: 'jsonRpc';
}

export const parseTypesMap: IParseTypesMap = {
  json: 'json',
  blob: 'blob',
};

export const requestProtocolsMap: IRequestProtocolsMap = {
  rest: 'rest',
  jsonRpc: 'jsonRpc',
};

export const defaultErrorsMap = {
  'network-error': {
    text: 'network error',
  },
  'timeout-error': {
    text: 'timeout error',
  },
};

export const NETWORK_ERROR_KEY = 'network-error';
export const TIMEOUT_ERROR = 'timeout-error';
