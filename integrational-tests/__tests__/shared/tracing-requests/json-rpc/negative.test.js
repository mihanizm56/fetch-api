const Joi = require('joi');
const { ProxyController, JSONRPCRequest } = require('../../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  isErrorTextStraightToOutput: true,
};

describe('traceRequestCallback DELETE negative tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('500 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: 'test key 4',
      additionalErrors: {
        err: 'Тестовая ошибка 4 err',
        param4: 'test param 4',
      },
      headers: {
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'content-length': '198',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://localhost:8080/json-rpc/negative',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      isErrorTextStraightToOutput: false,
      translateFunction: text => text,
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
      error: {
        code: 500,
        data: {
          err: 'Тестовая ошибка 4 err',
          param4: 'test param 4',
          trKey: 'test key 4',
        },
        message: 'Тестовая ошибка 4',
      },
      id: 'json-rpc_1',
      jsonrpc: '2.0',
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(500);
  });

  test('400 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 400,
      data: {},
      error: true,
      errorText: 'Тестовая ошибка 1',
      additionalErrors: {
        err: 'Тестовая ошибка 1 err',
        param1: 'test param 1',
      },
      headers: {
        connection: 'close',
        'content-length': '198',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://localhost:8080/json-rpc/negative?notsameversion=true',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      isErrorTextStraightToOutput: true,
      body: {
        foo: 'bar',
      },
    };

    const response = await new JSONRPCRequest().makeRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('POST');
    expect(resultOptions.requestBody).toEqual(
      '{"foo":"bar","jsonrpc":"2.0","id":"json-rpc_2"}',
    );
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      id: 'json-rpc_2',
      jsonrpc: '1.0',
      error: {
        code: 401,
        message: 'Тестовая ошибка 1',
        data: {
          err: 'Тестовая ошибка 1 err',
          trKey: 'test key 1',
          param1: 'test param 1',
        },
      },
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(400);
  });

  test('validation error', async () => {
    let resultOptions;

    const formattedResponse = {
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      headers: {
        connection: 'close',
        'content-length': '74',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://localhost:8080/json-rpc/positive',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      isErrorTextStraightToOutput: true,
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
      responseSchema: Joi.object({
        foo: Joi.string().required(),
        notValidField: Joi.object({
          baz: Joi.number().required(),
        }).required(),
      }),
    };

    const response = await new JSONRPCRequest().makeRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('POST');
    expect(resultOptions.requestBody).toEqual(
      '{"method":"test_method","options":{"foo":"bar"},"jsonrpc":"2.0","id":"json-rpc_3"}',
    );
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      id: 'json-rpc_3',
      jsonrpc: '2.0',
      result: {
        bar: {
          baz: 0,
        },
        foo: 'foo',
      },
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('validation-error');
    expect(resultOptions.code).toEqual(200);
  });

  test('network 500 error', async () => {
    let resultOptions;

    const formattedResponse = {
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      headers: {
        connection: 'close',
        'content-length': '111',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://localhost:8080/json-rpc/negative',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      isErrorTextStraightToOutput: false,
      translateFunction: text => text,
      queryParams: {
        networkerror: true,
      },
      body: {
        method: 'test_method',
        options: {
          test: '123',
        },
      },
    };

    const response = await new JSONRPCRequest().makeRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('POST');
    expect(resultOptions.requestBody).toEqual(
      '{"method":"test_method","options":{"test":"123"},"jsonrpc":"2.0","id":"json-rpc_4"}',
    );
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toBeNull();
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('request-error');
    expect(resultOptions.code).toEqual(501);
  });
});

describe('ProxyController negative tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('500 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: 'test key 4',
      additionalErrors: {
        err: 'Тестовая ошибка 4 err',
        param4: 'test param 4',
      },
      headers: {
        connection: 'close',
        'content-length': '198',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://localhost:8080/json-rpc/negative',
      isErrorTextStraightToOutput: false,
      translateFunction: text => text,
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
      '{"method":"test_method","options":{"foo":"bar"},"jsonrpc":"2.0","id":"json-rpc_5"}',
    );
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      error: {
        code: 500,
        data: {
          err: 'Тестовая ошибка 4 err',
          param4: 'test param 4',
          trKey: 'test key 4',
        },
        message: 'Тестовая ошибка 4',
      },
      id: 'json-rpc_5',
      jsonrpc: '2.0',
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(500);
  });

  test('400 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 400,
      data: {},
      error: true,
      errorText: 'Тестовая ошибка 1',
      additionalErrors: {
        err: 'Тестовая ошибка 1 err',
        param1: 'test param 1',
      },
      headers: {
        connection: 'close',
        'content-length': '198',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://localhost:8080/json-rpc/negative?notsameversion=true',
      isErrorTextStraightToOutput: true,
      body: {
        foo: 'bar',
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
      '{"foo":"bar","jsonrpc":"2.0","id":"json-rpc_6"}',
    );
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      id: 'json-rpc_6',
      jsonrpc: '1.0',
      error: {
        code: 401,
        message: 'Тестовая ошибка 1',
        data: {
          err: 'Тестовая ошибка 1 err',
          trKey: 'test key 1',
          param1: 'test param 1',
        },
      },
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(400);
  });

  test('validation error', async () => {
    let resultOptions;

    const formattedResponse = {
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      headers: {
        connection: 'close',
        'content-length': '74',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://localhost:8080/json-rpc/positive',
      isErrorTextStraightToOutput: true,
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
      responseSchema: Joi.object({
        foo: Joi.string().required(),
        notValidField: Joi.object({
          baz: Joi.number().required(),
        }).required(),
      }),
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
      '{"method":"test_method","options":{"foo":"bar"},"jsonrpc":"2.0","id":"json-rpc_7"}',
    );
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      id: 'json-rpc_7',
      jsonrpc: '2.0',
      result: {
        bar: {
          baz: 0,
        },
        foo: 'foo',
      },
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('validation-error');
    expect(resultOptions.code).toEqual(200);
  });

  test('network 500 error', async () => {
    let resultOptions;

    const formattedResponse = {
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      headers: {
        connection: 'close',
        'content-length': '111',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://localhost:8080/json-rpc/negative',
      isErrorTextStraightToOutput: false,
      translateFunction: text => text,
      queryParams: {
        networkerror: true,
      },
      body: {
        method: 'test_method',
        options: {
          test: '123',
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
      '{"method":"test_method","options":{"test":"123"},"jsonrpc":"2.0","id":"json-rpc_8"}',
    );
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toBeNull();
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('request-error');
    expect(resultOptions.code).toEqual(501);
  });
});
