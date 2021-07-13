const { RestRequest, ProxyController } = require('../../../../../dist');

const requestBaseConfig = {
  parseType: 'text',
  translateFunction: () => '',
};

describe('traceRequestCallback GET-TEXT positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('traceRequestCallback positive test', async () => {
    let resultOptions;

    const formattedResponse = {
      additionalErrors: null,
      code: 200,
      data:
        '.page-119nIxfGdr{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}.content-26JUP_FzJx{margin-top:20px}.page-3xcBAGm9dG{background-color:red;display:-ms-flexbox;display:flex;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}',
      error: false,
      errorText: '',
      headers: {
        'accept-ranges': 'bytes',
        'cache-control': 'public, max-age=0',
        connection: 'close',
        'content-length': '315',
        'content-type': 'text/css; charset=UTF-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    };

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive/text',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
    };

    const response = await new RestRequest().getRequest(requestConfig);

    delete response.headers['last-modified'];

    expect(response).toEqual(formattedResponse);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('GET');
    expect(resultOptions.requestBody).toBeUndefined();
    expect(resultOptions.requestHeaders).toEqual({});
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toEqual(
      '.page-119nIxfGdr{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}.content-26JUP_FzJx{margin-top:20px}.page-3xcBAGm9dG{background-color:red;display:-ms-flexbox;display:flex;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}',
    );
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

    expect(response.data).toBeDefined();
    expect(response.additionalErrors).toBeNull();
    expect(response.errorText).toEqual('');
    expect(response.error).toBeFalsy();
    expect(response.code).toEqual(200);
    expect(resultOptions.endpoint).toEqual(requestConfig.endpoint);
    expect(resultOptions.method).toEqual('GET');
    expect(resultOptions.requestBody).toBeUndefined();
    expect(resultOptions.requestHeaders).toEqual({});
    expect(resultOptions.requestCookies).toEqual('');
    expect(resultOptions.response).toBeDefined();
    expect(resultOptions.responseBody).toBeDefined();
    expect(resultOptions.formattedResponse.data).toBeDefined();
    expect(resultOptions.formattedResponse.additionalErrors).toBeNull();
    expect(resultOptions.formattedResponse.errorText).toEqual('');
    expect(resultOptions.formattedResponse.error).toBeFalsy();
    expect(resultOptions.formattedResponse.code).toEqual(200);
    expect(resultOptions.responseHeaders).toBeDefined();
    expect(resultOptions.responseCookies).toBeDefined();
    expect(resultOptions.error).toBeFalsy();
    expect(resultOptions.errorType).toBeNull();
    expect(resultOptions.code).toEqual(200);
  });
});
