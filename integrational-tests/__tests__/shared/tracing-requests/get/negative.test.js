const Joi = require('joi');
const { RestRequest, ProxyController } = require('../../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  isErrorTextStraightToOutput: true,
};

describe('traceRequestCallback GET negative tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('get request and 500 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      additionalErrors: null,
      headers: {
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '86',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?internalerror=true',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      isErrorTextStraightToOutput: false,
      translateFunction: text => text,
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
    expect(resultOptions.responseBody).toEqual(null);
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('request-error');
    expect(resultOptions.code).toEqual(501);
  });

  test('get request and 404 error without body', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 404,
      data: {},
      error: true,
      errorText: 'not-found-error',
      additionalErrors: null,
      headers: {
        connection: 'close',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '111',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithoutbody=true',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      isErrorTextStraightToOutput: false,
      translateFunction: text => text,
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
      data: null,
      error: true,
      errorText: 'not-found-error',
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(404);
  });

  test('get request and 404 error with body', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 404,
      data: {},
      error: true,
      errorText: 'not found',
      additionalErrors: {
        foo: 'bar',
      },
      headers: {
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '83',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithbody=true',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      isErrorTextStraightToOutput: true,
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
      additionalErrors: {
        foo: 'bar',
      },
      data: null,
      error: true,
      errorText: 'not found',
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(404);
  });

  test('get request and 400 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 400,
      data: {},
      error: true,
      errorText: 'not valid data',
      additionalErrors: null,
      headers: {
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '79',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notvaliddata=true',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      isErrorTextStraightToOutput: true,
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
      data: null,
      error: true,
      errorText: 'not valid data',
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(400);
  });

  test('get request and validation error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      additionalErrors: null,
      headers: {
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '126',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notvalidschema=true',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      responseSchema: Joi.array(),
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
      error: false,
      errorText: '',
      data: {
        foo: 'bar',
        bar: {
          baz: 'not valid-string',
        },
        delta: ['1', '2'],
      },
      additionalErrors: null,
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('validation-error');
    expect(resultOptions.code).toEqual(200);
  });
});

describe('ProxyController negative tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('get request and 500 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      additionalErrors: null,
      headers: {
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '86',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?internalerror=true',
      isErrorTextStraightToOutput: false,
      translateFunction: text => text,
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
    expect(resultOptions.responseBody).toEqual(null);
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('request-error');
    expect(resultOptions.code).toEqual(501);
  });

  test('get request and 404 error without body', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 404,
      data: {},
      error: true,
      errorText: 'not-found-error',
      additionalErrors: null,
      headers: {
        connection: 'close',
        date: 'mock-date',
        etag: 'mock-etag',
        'content-length': '111',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithoutbody=true',
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
      data: null,
      error: true,
      errorText: 'not-found-error',
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(404);
  });

  test('get request and 404 error with body', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 404,
      data: {},
      error: true,
      errorText: 'not found',
      additionalErrors: {
        foo: 'bar',
      },
      headers: {
        'content-length': '83',
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithbody=true',
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
      additionalErrors: {
        foo: 'bar',
      },
      data: null,
      error: true,
      errorText: 'not found',
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(404);
  });

  test('get request and 400 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 400,
      data: {},
      error: true,
      errorText: 'not valid data',
      additionalErrors: null,
      headers: {
        'content-length': '79',
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notvaliddata=true',
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
      data: null,
      error: true,
      errorText: 'not valid data',
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(400);
  });

  test('get request and validation error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      additionalErrors: null,
      headers: {
        'content-length': '126',
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notvalidschema=true',
      responseSchema: Joi.array(),
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
      error: false,
      errorText: '',
      data: {
        foo: 'bar',
        bar: {
          baz: 'not valid-string',
        },
        delta: ['1', '2'],
      },
      additionalErrors: null,
    });
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('validation-error');
    expect(resultOptions.code).toEqual(200);
  });
});
