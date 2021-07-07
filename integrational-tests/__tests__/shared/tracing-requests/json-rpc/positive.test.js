const Joi = require('@hapi/joi');
const { ProxyController, JSONRPCRequest } = require('../../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  translateFunction: () => '',
};

describe('traceRequestCallback JSON-RPC positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('traceRequestCallback positive test', async () => {
    let resultOptions;

    const formattedResponse = {
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo' },
      error: false,
      errorText: '',
      headers: {
        connection: 'close',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '74',
        'content-type': 'application/json; charset=utf-8',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/json-rpc/positive',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
    };

    const response = await new JSONRPCRequest().makeRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('POST');
    expect(resultOptions.requestBody).toEqual(
      '{"method":"test_method","options":{"foo":"bar"},"jsonrpc":"2.0","id":"json-rpc_1"}',
    );
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      id: 'json-rpc_1',
      jsonrpc: '2.0',
      result: {
        bar: { baz: 0 },
        foo: 'foo',
      },
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
      data: { bar: { baz: 0 }, foo: 'foo' },
      error: false,
      errorText: '',
      headers: {
        connection: 'close',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '74',
        'content-type': 'application/json; charset=utf-8',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/json-rpc/positive',
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
    };

    new ProxyController().setResponseTrackCallback({
      callback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      name: 'test',
    });

    const response = await new JSONRPCRequest().makeRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('POST');
    expect(resultOptions.requestBody).toEqual(
      '{"method":"test_method","options":{"foo":"bar"},"jsonrpc":"2.0","id":"json-rpc_2"}',
    );
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      id: 'json-rpc_2',
      jsonrpc: '2.0',
      result: {
        bar: { baz: 0 },
        foo: 'foo',
      },
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeFalsy();
    expect(resultOptions.errorType).toBeNull();
    expect(resultOptions.code).toEqual(200);
  });
});
