const Joi = require('@hapi/joi');
const { RestRequest, ProxyController } = require('../../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  translateFunction: () => '',
};

describe('Tracing response params tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  describe('traceRequestCallback tests', () => {
    test('check response headers', async () => {
      let resultOptions;

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

      await new RestRequest().putRequest(requestConfig);

      expect(resultOptions.responseHeaders.connection).toEqual('close');
      expect(resultOptions.responseHeaders['content-length']).toEqual('91');
      expect(resultOptions.responseHeaders['content-type']).toEqual(
        'application/json; charset=utf-8',
      );
      expect(resultOptions.responseHeaders.etag).toEqual('mock-etag');
      expect(resultOptions.responseHeaders['x-powered-by']).toEqual('Express');
    });
    test('check response cookies', async () => {
      let resultOptions;

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        body: {
          test: '123',
        },
        traceRequestCallback: setResponseTrackCallbackOptions => {
          resultOptions = { ...setResponseTrackCallbackOptions };
        },
      };

      await new RestRequest().putRequest(requestConfig);

      expect(resultOptions.requestCookies).toEqual('');
    });
  });

  describe('ProxyController tests', () => {
    test('check response headers', async () => {
      let resultOptions;

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

      await new RestRequest().putRequest(requestConfig);

      expect(resultOptions.responseHeaders.connection).toEqual('close');
      expect(resultOptions.responseHeaders['content-length']).toEqual('91');
      expect(resultOptions.responseHeaders['content-type']).toEqual(
        'application/json; charset=utf-8',
      );
      expect(resultOptions.responseHeaders.etag).toEqual('mock-etag');
      expect(resultOptions.responseHeaders['x-powered-by']).toEqual('Express');
    });
    test('check response cookies', async () => {
      let resultOptions;

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

      await new RestRequest().putRequest(requestConfig);

      expect(resultOptions.requestCookies).toEqual('');
    });
  });
});
