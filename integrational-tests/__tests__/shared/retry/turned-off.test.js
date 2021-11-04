const Joi = require('joi');
const {
  RestRequest,
  PureRestRequest,
  JSONRPCRequest,
} = require('../../../../dist');

describe('retry tests (turn off)', () => {
  beforeEach(async () => {
    delete global.window;
  });
  afterEach(async () => {
    await new RestRequest().getRequest({
      endpoint: 'http://127.0.0.1:8080/shared/retry/rest?clear=true',
    });
    await new RestRequest().getRequest({
      endpoint: 'http://127.0.0.1:8080/shared/retry/pure-rest?clear=true',
    });
    await new RestRequest().getRequest({
      endpoint: 'http://127.0.0.1:8080/shared/retry/json-rpc?clear=true',
    });
  });

  const requestBaseConfig = {
    mode: 'cors',
    responseSchema: Joi.any(),
    translateFunction: (key, options) =>
      `translateFunction got key ${key} and options ${options}`,
    retry: 3,
    retryIntervalNonIncrement: true,
  };

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
        headers: {
          connection: 'close',
          'content-length': '64',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
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
        headers: {
          connection: 'close',
          'content-length': '64',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
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
        headers: {
          connection: 'close',
          'content-length': '81',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });

    test('RestRequest not retry if extraVerifyRetry returned always false', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/rest?retry=true&last=true&retrynumber=20',
        extraVerifyRetry: () => false,
      };

      const response = await new RestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        code: 400,
        error: true,
        errorText:
          'translateFunction got key test retry error and options undefined',
        data: {},
        additionalErrors: null,
        headers: {
          connection: 'close',
          'content-length': '81',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('RestRequest not retry if extraVerifyRetry returned false if 400 response only', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/rest?retry=true&last=true&retrynumber=3',
        extraVerifyRetry: ({ formattedResponseData }) => {
          if (formattedResponseData.code === 400) {
            return false;
          }
          return true;
        },
      };

      const response = await new RestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        code: 400,
        error: true,
        errorText:
          'translateFunction got key test retry error and options undefined',
        data: {},
        additionalErrors: null,
        headers: {
          connection: 'close',
          'content-length': '81',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
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
        headers: {
          connection: 'close',
          'content-length': '2',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
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
        headers: {
          connection: 'close',
          'content-length': '2',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
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
        headers: {
          connection: 'close',
          'content-length': '2',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });

    test('PureRestRequest not retry if extraVerifyRetry returned always false', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/pure-rest?retry=true&last=true&retrynumber=20',
        extraVerifyRetry: () => false,
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        code: 400,
        error: true,
        errorText: 'translateFunction got key  and options [object Object]',
        data: {},
        additionalErrors: {},
        headers: {
          connection: 'close',
          'content-length': '2',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('PureRestRequest not retry if extraVerifyRetry returned false if 400 response only', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/pure-rest?retry=true&last=true&retrynumber=20',
        extraVerifyRetry: ({ formattedResponseData }) => {
          if (formattedResponseData.code === 400) {
            return false;
          }
          return true;
        },
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        code: 400,
        error: true,
        errorText: 'translateFunction got key  and options [object Object]',
        data: {},
        additionalErrors: {},
        headers: {
          connection: 'close',
          'content-length': '2',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
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
        headers: {
          connection: 'close',
          'content-length': '47',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test.skip('JSONRPCRequest responded with last retry', async () => {
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
        headers: {
          connection: 'close',
          'content-length': '47',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
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
        headers: {
          connection: 'close',
          'content-length': '156',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('JSONRPCRequest not retry if extraVerifyRetry returned always false', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/json-rpc?retry=true&last=true&retrynumber=20',
        body: {
          method: 'test_method',
          options: {
            foo: 'bar',
          },
        },
        extraVerifyRetry: () => false,
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
        headers: {
          connection: 'close',
          'content-length': '156',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('JSONRPCRequest not retry if extraVerifyRetry returned false if 400 response only', async () => {
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/shared/retry/json-rpc?retry=true&last=true&retrynumber=20',
        body: {
          method: 'test_method',
          options: {
            foo: 'bar',
          },
        },
        extraVerifyRetry: ({ formattedResponseData }) => {
          if (formattedResponseData.code === 400) {
            return false;
          }
          return true;
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
        headers: {
          connection: 'close',
          'content-length': '156',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
  });
});
