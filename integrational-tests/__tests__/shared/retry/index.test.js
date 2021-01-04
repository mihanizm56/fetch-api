const Joi = require('@hapi/joi');
const {
  RestRequest,
  PureRestRequest,
  JSONRPCRequest,
} = require('../../../../dist');

const requestBaseConfig = {
  mode: 'cors',
  responseSchema: Joi.any(),
  translateFunction: (key, options) =>
    `translateFunction got key ${key} and options ${options}`,
  retry: 3,
};

describe('retry tests (negative)', () => {
  beforeEach(() => {
    delete global.window;
  });

  describe('test RestRequest', () => {
    test('RestRequest responded with no retry if server responded ok', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/shared/retry/rest?success=true',
      };

      const response = await new RestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: {},
        error: false,
        errorText: '',
      });
    });

    test('RestRequest responded with last retry', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/rest?retry=true&last=true&retrynumber=3',
      };

      const response = await new RestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: {},
        error: false,
        errorText: '',
      });
    });
    test('RestRequest not responded with retry if there were more bad responses', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/shared/retry/rest?notresponded=true',
      };

      const response = await new RestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        code: 400,
        error: true,
        errorText:
          'translateFunction got key test retry error and options undefined',
        data: {},
        additionalErrors: null,
      });
    });
  });

  describe('test PureRestRequest', () => {
    test('PureRestRequest responded with no retry if server responded ok', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/shared/retry/pure-rest?success=true',
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: {},
        error: false,
        errorText: '',
      });
    });
    test('PureRestRequest responded with last retry', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/pure-rest?retry=true&last=true&retrynumber=3',
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: {},
        error: false,
        errorText: '',
      });
    });
    test('PureRestRequest not responded with retry if there were more bad responses', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/pure-rest?notresponded=true',
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        code: 400,
        error: true,
        errorText: 'translateFunction got key  and options [object Object]',
        data: {},
        additionalErrors: {},
      });
    });
  });

  describe('test JSONRPCRequest', () => {
    test('JSONRPCRequest responded with no retry if server responded ok', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/shared/retry/json-rpc?success=true',
        body: {
          method: 'test_method',
          options: {
            foo: 'bar',
          },
        },
      };

      const response = await new JSONRPCRequest().makeRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: {},
        error: false,
        errorText: '',
      });
    });
    test('JSONRPCRequest responded with last retry', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/json-rpc?retry=true&last=true&retrynumber=3',
        body: {
          method: 'test_method',
          options: {
            foo: 'bar',
          },
        },
      };

      const response = await new JSONRPCRequest().makeRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: {},
        error: false,
        errorText: '',
      });
    });
    test('JSONRPCRequest not responded with retry if there were more bad responses', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/json-rpc?notresponded=true',
        body: {
          method: 'test_method',
          options: {
            foo: 'bar',
          },
        },
      };

      const response = await new JSONRPCRequest().makeRequest(requestConfig);

      expect(response).toEqual({
        code: 400,
        error: true,
        errorText:
          'translateFunction got key test retry error trKey and options [object Object]',
        data: {},
        additionalErrors: {
          err: 'test retry error err',
        },
      });
    });
  });
});
