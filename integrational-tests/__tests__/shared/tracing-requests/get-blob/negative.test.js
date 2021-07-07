const { RestRequest, ProxyController } = require('../../../../../dist');

const requestBaseConfig = {
  parseType: 'blob',
  translateFunction: () => '',
};

describe('traceRequestCallback GET-BLOB positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('500 error', async () => {
    let resultOptions;

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative/blob',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
    };

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: '',
      additionalErrors: null,
      headers: {
        connection: 'close',
        'content-length': '111',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
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

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithoutbody=true',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
    };

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

    new ProxyController().setResponseTrackCallback({
      callback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
      name: 'test',
    });

    const formattedResponse = {
      code: 500,
      data: {},
      error: true,
      errorText: '',
      additionalErrors: null,
      headers: {
        connection: 'close',
        'content-length': '111',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
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

    expect(response.data).toBeDefined();
    expect(response.additionalErrors).toBeNull();
    expect(response.errorText).toEqual('not-found-error');
    expect(response.error).toBeTruthy();
    expect(response.code).toEqual(404);
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
    expect(resultOptions.formattedResponse.data).toBeDefined();
    expect(resultOptions.formattedResponse.additionalErrors).toBeNull();
    expect(resultOptions.formattedResponse.errorText).toEqual(
      'not-found-error',
    );
    expect(resultOptions.formattedResponse.error).toBeTruthy();
    expect(resultOptions.formattedResponse.code).toEqual(404);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeTruthy();
    expect(resultOptions.errorType).toEqual('response-error');
    expect(resultOptions.code).toEqual(404);
  });
});
