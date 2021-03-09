const Joi = require('@hapi/joi');
const { RestRequest, ProxyController } = require('../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  translateFunction: () => '',
};

const formattedResponse = {
  code: 500,
  data: {},
  error: true,
  errorText: '',
  additionalErrors: null,
};

const requestParams = {
  body: undefined,
  cache: 'default',
  credentials: undefined,
  endpoint: 'http://127.0.0.1:8080/rest/negative?internalerror=true',
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

describe('traceRequestCallback negative tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('set one tracking callback', async () => {
    let resultOptions;

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?internalerror=true',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
    };

    const response = await new RestRequest().getRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.pureResponseData).toEqual(null);
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.requestError).toBeTruthy();
    expect(resultOptions.formattedResponseData).toEqual(formattedResponse);
    expect(resultOptions.requestParams).toEqual(requestParams);
  });
});
