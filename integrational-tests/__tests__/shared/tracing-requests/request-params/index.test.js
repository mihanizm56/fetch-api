const Joi = require('joi');
const { RestRequest, ProxyController } = require('../../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  translateFunction: () => '',
};

describe('Tracing request params tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  describe('traceRequestCallback tests', () => {
    test('check request headers', async () => {
      let resultOptions;

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        traceRequestCallback: (setResponseTrackCallbackOptions) => {
          resultOptions = { ...setResponseTrackCallbackOptions };
        },
        body: {
          test: '123',
        },
        headers: {
          foo: 'bar',
          Authorize: 'token_1231233213',
        },
      };

      await new RestRequest().putRequest(requestConfig);

      expect(resultOptions.requestHeaders).toEqual({
        'Content-type': 'application/json',
        foo: 'bar',
        Authorize: 'token_1231233213',
      });
    });
    test('check request cookies', async () => {
      const mockCookies =
        'cookie_key_1=cookie_value_1;cookie_key_2=cookie_value_2';

      Object.defineProperty(global.document, 'cookie', {
        writable: true,
        value: mockCookies,
      });

      let resultOptions;

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        body: {
          test: '123',
        },
        traceRequestCallback: (setResponseTrackCallbackOptions) => {
          resultOptions = { ...setResponseTrackCallbackOptions };
        },
      };

      await new RestRequest().putRequest(requestConfig);

      expect(resultOptions.requestCookies).toEqual(mockCookies);
    });
  });

  describe('ProxyController tests', () => {
    test('check request headers', async () => {
      let resultOptions;

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        body: {
          test: '123',
        },
        headers: {
          foo: 'bar',
          Authorize: 'token_1231233213',
        },
      };

      new ProxyController().setResponseTrackCallback({
        callback: (setResponseTrackCallbackOptions) => {
          resultOptions = { ...setResponseTrackCallbackOptions };
        },
        name: 'test',
      });

      await new RestRequest().putRequest(requestConfig);

      expect(resultOptions.requestHeaders).toEqual({
        'Content-type': 'application/json',
        foo: 'bar',
        Authorize: 'token_1231233213',
      });
    });
    test('check request cookies', async () => {
      const mockCookies =
        'cookie_key_1=cookie_value_1;cookie_key_2=cookie_value_2';

      Object.defineProperty(global.document, 'cookie', {
        writable: true,
        value: mockCookies,
      });

      let resultOptions;

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        body: {
          test: '123',
        },
      };

      new ProxyController().setResponseTrackCallback({
        callback: (setResponseTrackCallbackOptions) => {
          resultOptions = { ...setResponseTrackCallbackOptions };
        },
        name: 'test',
      });

      await new RestRequest().putRequest(requestConfig);

      expect(resultOptions.requestCookies).toEqual(mockCookies);
    });
  });
});
