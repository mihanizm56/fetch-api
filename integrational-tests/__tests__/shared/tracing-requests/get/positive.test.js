const Joi = require('@hapi/joi');
const { RestRequest, ProxyController } = require('../../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  translateFunction: () => '',
};

describe('traceRequestCallback GET positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('traceRequestCallback positive test', async () => {
    let resultOptions;

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

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
    };

    const response = await new RestRequest().getRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('GET');
    expect(resultOptions.requestBody).toBeUndefined();
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      additionalErrors: null,
      data: { bar: { baz: 0 }, delta: ['1', '2'], foo: 'foo' },
      error: false,
      errorText: '',
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeFalsy();
    expect(resultOptions.errorType).toBeNull();
    expect(resultOptions.code).toEqual(200);
  });
});

describe('ProxyController positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('ProxyController positive test', async () => {
    let resultOptions;

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

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
    };

    new ProxyController().setResponseTrackCallback({
      callback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      name: 'test',
    });

    const response = await new RestRequest().getRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('GET');
    expect(resultOptions.requestBody).toBeUndefined();
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      additionalErrors: null,
      data: { bar: { baz: 0 }, delta: ['1', '2'], foo: 'foo' },
      error: false,
      errorText: '',
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeFalsy();
    expect(resultOptions.errorType).toBeNull();
    expect(resultOptions.code).toEqual(200);
  });
});
