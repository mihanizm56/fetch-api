const Joi = require('joi');
const { RestRequest, ProxyController } = require('../../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  translateFunction: () => '',
};

describe('traceRequestCallback POST positive tests', () => {
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
        foo: 'foo',
      },
      error: false,
      errorText: '',
      headers: {
        'content-length': '91',
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      body: {
        test: '123',
      },
    };

    const response = await new RestRequest().postRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('POST');
    expect(resultOptions.requestBody).toEqual('{"test":"123"}');
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      additionalErrors: null,
      data: { bar: { baz: 0 }, foo: 'foo' },
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
        foo: 'foo',
      },
      error: false,
      errorText: '',
      headers: {
        'content-length': '91',
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      body: {
        test: '123',
      },
    };

    new ProxyController().setResponseTrackCallback({
      callback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      name: 'test',
    });

    const response = await new RestRequest().postRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('POST');
    expect(resultOptions.requestBody).toEqual('{"test":"123"}');
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      additionalErrors: null,
      data: { bar: { baz: 0 }, foo: 'foo' },
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
