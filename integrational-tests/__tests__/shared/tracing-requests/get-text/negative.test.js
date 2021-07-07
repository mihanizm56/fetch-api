const { RestRequest, ProxyController } = require('../../../../../dist');

const requestBaseConfig = {
  parseType: 'text',
  translateFunction: () => '',
};

describe('traceRequestCallback GET-TEXT positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('500 error', async () => {
    let resultOptions;

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: '',
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
      endpoint: 'http://127.0.0.1:8080/rest/negative/blob',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
    };

    const response = await new RestRequest().getRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('GET');
    expect(resultOptions.requestBody).toBeUndefined();
    expect(resultOptions.requestHeaders).toEqual({});
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toBeNull();
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('request-error');
    expect(resultOptions.code).toEqual(500);
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
    };

    const response = await new RestRequest().getRequest(requestConfig);

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('GET');
    expect(resultOptions.requestBody).toBeUndefined();
    expect(resultOptions.requestHeaders).toEqual({});
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
});

describe('ProxyController positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('500 error', async () => {
    let resultOptions;

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative/blob',
    };

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: '',
      additionalErrors: null,
      headers: {
        connection: 'close',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '111',
      },
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
    expect(resultOptions.requestHeaders).toEqual({});
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toBeNull();
    expect(resultOptions.formattedResponse).toEqual(formattedResponse);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('request-error');
    expect(resultOptions.code).toEqual(500);
  });
  test('404 error without body', async () => {
    let resultOptions;

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithoutbody=true',
    };

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
    expect(resultOptions.requestHeaders).toEqual({});
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
});
