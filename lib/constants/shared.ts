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
  'network-error': 'network error',
  'timeout-error': 'timeout error',
};
