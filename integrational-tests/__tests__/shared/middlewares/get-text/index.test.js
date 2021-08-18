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
        endpoint: 'http://127.0.0.1:8080/rest/positive/text',
        parseType: 'text',
      });

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data:
          '.page-119nIxfGdr{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}.content-26JUP_FzJx{margin-top:20px}.page-3xcBAGm9dG{background-color:red;display:-ms-flexbox;display:flex;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}',
        error: false,
        errorText: '',
        headers: {
          'accept-ranges': 'bytes',
          'cache-control': 'public, max-age=0',
          'content-length': '315',
          connection: 'close',
          'content-type': 'text/css; charset=UTF-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
          'last-modified': 'mock-last-modified',
        },
      });
    });

    test('test empty middleware', async () => {
      new MiddlewaresController().setMiddleware({
        middleware: ({ response }) => response,
        name: 'test',
      });

      const response = await new PureRestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/text',
        parseType: 'text',
      });

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data:
          '.page-119nIxfGdr{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}.content-26JUP_FzJx{margin-top:20px}.page-3xcBAGm9dG{background-color:red;display:-ms-flexbox;display:flex;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}',
        error: false,
        errorText: '',
        headers: {
          'accept-ranges': 'bytes',
          'cache-control': 'public, max-age=0',
          'content-length': '315',
          connection: 'close',
          'content-type': 'text/css; charset=UTF-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
          'last-modified': 'mock-last-modified',
        },
      });
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
        endpoint: 'http://127.0.0.1:8080/rest/positive/text',
        parseType: 'text',
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
        endpoint: 'http://127.0.0.1:8080/rest/positive/text',
        parseType: 'text',
      });

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data:
          '.page-119nIxfGdr{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}.content-26JUP_FzJx{margin-top:20px}.page-3xcBAGm9dG{background-color:red;display:-ms-flexbox;display:flex;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}',
        error: false,
        errorText: '',
        headers: {
          'accept-ranges': 'bytes',
          'cache-control': 'public, max-age=0',
          'content-length': '315',
          connection: 'close',
          'content-type': 'text/css; charset=UTF-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
          'last-modified': 'mock-last-modified',
        },
      });
    });
  });

  describe('MiddlewaresController GET tests', () => {
    test('test without middleware', async () => {
      const response = await new RestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/text',
        parseType: 'text',
      });

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data:
          '.page-119nIxfGdr{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}.content-26JUP_FzJx{margin-top:20px}.page-3xcBAGm9dG{background-color:red;display:-ms-flexbox;display:flex;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}',
        error: false,
        errorText: '',
        headers: {
          'accept-ranges': 'bytes',
          'cache-control': 'public, max-age=0',
          'content-length': '315',
          connection: 'close',
          'content-type': 'text/css; charset=UTF-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
          'last-modified': 'mock-last-modified',
        },
      });
    });

    test('test empty middleware', async () => {
      new MiddlewaresController().setMiddleware({
        middleware: ({ response }) => response,
        name: 'test',
      });

      const response = await new RestRequest().getRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/rest/positive/text',
        parseType: 'text',
      });

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data:
          '.page-119nIxfGdr{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}.content-26JUP_FzJx{margin-top:20px}.page-3xcBAGm9dG{background-color:red;display:-ms-flexbox;display:flex;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}',
        error: false,
        errorText: '',
        headers: {
          'accept-ranges': 'bytes',
          'cache-control': 'public, max-age=0',
          'content-length': '315',
          connection: 'close',
          'content-type': 'text/css; charset=UTF-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
          'last-modified': 'mock-last-modified',
        },
      });
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
        endpoint: 'http://127.0.0.1:8080/rest/positive/text',
        parseType: 'text',
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
        endpoint: 'http://127.0.0.1:8080/rest/positive/text',
        parseType: 'text',
      });

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data:
          '.page-119nIxfGdr{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}.content-26JUP_FzJx{margin-top:20px}.page-3xcBAGm9dG{background-color:red;display:-ms-flexbox;display:flex;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}',
        error: false,
        errorText: '',
        headers: {
          'accept-ranges': 'bytes',
          'cache-control': 'public, max-age=0',
          'content-length': '315',
          connection: 'close',
          'content-type': 'text/css; charset=UTF-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
          'last-modified': 'mock-last-modified',
        },
      });
    });
  });
});
