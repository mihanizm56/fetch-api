const {
  RestRequest,
  MiddlewaresController,
  PureRestRequest,
} = require('../../../../../dist');

describe('MiddlewaresController GET tests', () => {
  beforeEach(() => {
    delete global.window;
    new MiddlewaresController().deleteMiddleware('test');
  });

  describe('MiddlewaresController PURE GET tests', () => {
    test('test without middleware', async () => {
      const response = await new PureRestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
        parseType: 'blob',
      });

      expect(response.data).toBeDefined();
      expect(response.additionalErrors).toBeNull();
      expect(response.errorText).toEqual('');
      expect(response.error).toBeFalsy();
      expect(response.code).toEqual(200);
    });

    test('test empty middleware', async () => {
      new MiddlewaresController().setMiddleware({
        middleware: ({ response }) => response,
        name: 'test',
      });

      const response = await new PureRestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
        parseType: 'blob',
      });

      expect(response.data).toBeDefined();
      expect(response.additionalErrors).toBeNull();
      expect(response.errorText).toEqual('');
      expect(response.error).toBeFalsy();
      expect(response.code).toEqual(200);
    });

    test('test with middleware negative and additional request inside', async () => {
      const middleware = async () => {
        const responseNegative = await new PureRestRequest().getRequest({
          isErrorTextStraightToOutput: true,
          endpoint: 'http://127.0.0.1:8080/rest/negative',
          middlewaresAreDisabled: true,
        });

        return responseNegative;
      };

      new MiddlewaresController().setMiddleware({
        middleware,
        name: 'test',
      });

      const response = await new RestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
        parseType: 'blob',
      });

      expect(response).toEqual({
        additionalErrors: {
          error: true,
          data: {},
        },
        code: 401,
        data: {},
        error: true,
        errorText: 'test error key',
        headers: {
          'content-length': '77',
          connection: 'close',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });

    test('test middleware do retryRequest', async () => {
      const middleware = async ({ retryRequest }) => {
        const testResponse = await retryRequest({
          middlewaresAreDisabled: true,
        });

        return testResponse;
      };

      new MiddlewaresController().setMiddleware({
        middleware,
        name: 'test',
      });

      const response = await new PureRestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
        parseType: 'blob',
      });

      expect(response.data).toBeDefined();
      expect(response.additionalErrors).toBeNull();
      expect(response.errorText).toEqual('');
      expect(response.error).toBeFalsy();
      expect(response.code).toEqual(200);
    });
  });

  describe('MiddlewaresController GET tests', () => {
    test('test without middleware', async () => {
      const response = await new RestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
        parseType: 'blob',
      });

      expect(response.data).toBeDefined();
      expect(response.additionalErrors).toBeNull();
      expect(response.errorText).toEqual('');
      expect(response.error).toBeFalsy();
      expect(response.code).toEqual(200);
    });

    test('test empty middleware', async () => {
      new MiddlewaresController().setMiddleware({
        middleware: ({ response }) => response,
        name: 'test',
      });

      const response = await new RestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
        parseType: 'blob',
      });

      expect(response.data).toBeDefined();
      expect(response.additionalErrors).toBeNull();
      expect(response.errorText).toEqual('');
      expect(response.error).toBeFalsy();
      expect(response.code).toEqual(200);
    });

    test('test with middleware negative and additional request inside', async () => {
      const middleware = async () => {
        const responseNegative = await new RestRequest().getRequest({
          isErrorTextStraightToOutput: true,
          endpoint: 'http://127.0.0.1:8080/rest/negative',
          middlewaresAreDisabled: true,
        });

        return responseNegative;
      };

      new MiddlewaresController().setMiddleware({
        middleware,
        name: 'test',
      });

      const response = await new RestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
        parseType: 'blob',
      });

      expect(response).toEqual({
        additionalErrors: null,
        code: 401,
        data: {},
        error: true,
        errorText: 'test error key',
        headers: {
          'content-length': '77',
          'content-type': 'application/json; charset=utf-8',
          connection: 'close',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });

    test('test middleware do retryRequest', async () => {
      const middleware = async ({ retryRequest }) => {
        const testResponse = await retryRequest({
          middlewaresAreDisabled: true,
        });

        return testResponse;
      };

      new MiddlewaresController().setMiddleware({
        middleware,
        name: 'test',
      });

      const response = await new RestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
        parseType: 'text',
      });

      expect(response.data).toBeDefined();
      expect(response.additionalErrors).toBeNull();
      expect(response.errorText).toEqual('');
      expect(response.error).toBeFalsy();
      expect(response.code).toEqual(200);
    });
  });
});
