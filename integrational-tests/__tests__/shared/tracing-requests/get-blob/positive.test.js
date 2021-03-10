const { RestRequest, ProxyController } = require('../../../../../dist');

const requestBaseConfig = {
  parseType: 'blob',
  translateFunction: () => '',
};

describe('traceRequestCallback GET-BLOB positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('traceRequestCallback positive test', async () => {
    let resultOptions;

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
      traceRequestCallback: setResponseTrackCallbackOptions => {
        resultOptions = { ...setResponseTrackCallbackOptions };
      },
    };

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

describe('ProxyController positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('ProxyController positive test', async () => {
    let resultOptions;

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
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
