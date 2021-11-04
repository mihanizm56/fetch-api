const Joi = require('joi');
const { RestRequest, ProxyController } = require('../../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  isErrorTextStraightToOutput: true,
};

describe('traceRequestCallback PUT negative tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('500 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      additionalErrors: null,
      headers: {
        connection: 'close',
        'content-length': '98',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
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
      body: {
        foo: 'bar',
      },
    };

    const response = await new RestRequest().putRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('PUT');
    expect(resultOptions.requestBody).toEqual('{"foo":"bar"}');
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

  test('404 error without body', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 404,
      data: {},
      error: true,
      errorText: 'not-found-error',
      additionalErrors: null,
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
      endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithoutbody=true',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      isErrorTextStraightToOutput: false,
      translateFunction: text => text,
      body: {
        foo: 'bar',
      },
    };

    const response = await new RestRequest().putRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('PUT');
    expect(resultOptions.requestBody).toEqual('{"foo":"bar"}');
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

  test('404 error with body', async () => {
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
      body: {
        foo: 'bar',
      },
    };

    const response = await new RestRequest().putRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('PUT');
    expect(resultOptions.requestBody).toEqual('{"foo":"bar"}');
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

  test('400 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 400,
      data: {},
      error: true,
      errorText: 'test error',
      additionalErrors: null,
      headers: {
        connection: 'close',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'content-length': '75',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      isErrorTextStraightToOutput: true,
      body: {
        foo: 'bar',
      },
    };

    const response = await new RestRequest().putRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('PUT');
    expect(resultOptions.requestBody).toEqual('{"foo":"bar"}');
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      additionalErrors: null,
      data: null,
      error: true,
      errorText: 'test error',
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
      errorText:
        'translateFunction got key network-error and options undefined',
      headers: {
        connection: 'close',
        'content-length': '91',
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
      responseSchema: Joi.object({
        foo: Joi.string().required(),
        notValidValue: Joi.object({
          baz: Joi.number().required(),
        }).required(),
      }),
      isErrorTextStraightToOutput: false,
      translateFunction: (key, options) =>
        `translateFunction got key ${key} and options ${options}`,
      body: {
        foo: 'bar',
      },
    };

    const response = await new RestRequest().putRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('PUT');
    expect(resultOptions.requestBody).toEqual('{"foo":"bar"}');
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      error: false,
      errorText: '',
      data: {
        bar: {
          baz: 0,
        },
        foo: 'foo',
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

  test('500 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      additionalErrors: null,
      headers: {
        connection: 'close',
        'content-length': '98',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?internalerror=true',
      isErrorTextStraightToOutput: false,
      translateFunction: text => text,
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

    const response = await new RestRequest().putRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('PUT');
    expect(resultOptions.requestBody).toEqual('{"foo":"bar"}');
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

  test('404 error without body', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 404,
      data: {},
      error: true,
      errorText: 'not-found-error',
      additionalErrors: null,
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
      endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithoutbody=true',
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

    const response = await new RestRequest().putRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('PUT');
    expect(resultOptions.requestBody).toEqual('{"foo":"bar"}');
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

  test('404 error with body', async () => {
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
        'content-length': '83',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithbody=true',
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

    const response = await new RestRequest().putRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('PUT');
    expect(resultOptions.requestBody).toEqual('{"foo":"bar"}');
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

  test('400 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 400,
      data: {},
      error: true,
      errorText: 'test error',
      additionalErrors: null,
      headers: {
        connection: 'close',
        'content-length': '75',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative',
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

    const response = await new RestRequest().putRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('PUT');
    expect(resultOptions.requestBody).toEqual('{"foo":"bar"}');
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      additionalErrors: null,
      data: null,
      error: true,
      errorText: 'test error',
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
      errorText:
        'translateFunction got key network-error and options undefined',
      headers: {
        connection: 'close',
        'content-length': '91',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema: Joi.object({
        foo: Joi.string().required(),
        notValidValue: Joi.object({
          baz: Joi.number().required(),
        }).required(),
      }),
      isErrorTextStraightToOutput: false,
      translateFunction: (key, options) =>
        `translateFunction got key ${key} and options ${options}`,
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

    const response = await new RestRequest().putRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('PUT');
    expect(resultOptions.requestBody).toEqual('{"foo":"bar"}');
    expect(resultOptions.requestHeaders).toEqual({
      'Content-type': 'application/json',
    });
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual({
      error: false,
      errorText: '',
      data: {
        bar: {
          baz: 0,
        },
        foo: 'foo',
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
