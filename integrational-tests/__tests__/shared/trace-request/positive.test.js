const Joi = require('@hapi/joi');
const { RestRequest, FetchProxyMaker } = require('../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  translateFunction: () => '',
};

const formattedResponse = {
  additionalErrors: null,
  code: 200,
  data: {
    bar: { baz: 0 },
    delta: ['1', '2'],
    foo: 'foo',
  },
  error: false,
  errorText: '',
};

const requestParams = {
  body: undefined,
  cache: 'default',
  credentials: undefined,
  endpoint: 'http://127.0.0.1:8080/rest/positive',
  headers: {
    'Content-type': 'application/json',
  },
  integrity: undefined,
  keepalive: undefined,
  method: 'GET',
  mode: undefined,
  redirect: undefined,
  referrer: undefined,
  referrerPolicy: undefined,
};

const pureResponseData = {
  additionalErrors: null,
  data: {
    bar: { baz: 0 },
    delta: ['1', '2'],
    foo: 'foo',
  },
  error: false,
  errorText: '',
};

describe('traceRequestCallback positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('set one tracking callback', async () => {
    let resultOptions;

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
    };

    const response = await new RestRequest().getRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.pureResponseData).toEqual(pureResponseData);
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.requestError).toBeFalsy();
    expect(resultOptions.formattedResponseData).toEqual(formattedResponse);
    expect(resultOptions.requestParams).toEqual(requestParams);
  });
});
