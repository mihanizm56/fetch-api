const {
  MiddlewaresController,
  JSONRPCRequest,
} = require('../../../../../dist');

describe('MiddlewaresController tests', () => {
  beforeEach(() => {
    delete global.window;
    new MiddlewaresController().deleteMiddleware('test');
  });

  test('test without middleware', async () => {
    const response = await new JSONRPCRequest().makeRequest({
      isErrorTextStraightToOutput: true,
      endpoint: 'http://127.0.0.1:8080/json-rpc/positive',
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
    });

    expect(response).toEqual({
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo' },
      error: false,
      errorText: '',
      headers: {
        connection: 'close',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '74',
        'content-type': 'application/json; charset=utf-8',
      },
    });
  });

  test('test empty middleware', async () => {
    new MiddlewaresController().setMiddleware({
      middleware: ({ response }) => response,
      name: 'test',
    });

    const response = await new JSONRPCRequest().makeRequest({
      isErrorTextStraightToOutput: true,
      endpoint: 'http://127.0.0.1:8080/json-rpc/positive',
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
    });

    expect(response).toEqual({
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo' },
      error: false,
      errorText: '',
      headers: {
        connection: 'close',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '74',
        'content-type': 'application/json; charset=utf-8',
      },
    });
  });

  test('test with middleware negative and additional request inside', async () => {
    const middleware = async () => {
      const responseNegative = await new JSONRPCRequest().makeRequest({
        isErrorTextStraightToOutput: true,
        endpoint: 'http://127.0.0.1:8080/json-rpc/negative?notsameversion=true',
        middlewaresAreDisabled: true,
      });

      return responseNegative;
    };

    new MiddlewaresController().setMiddleware({
      middleware,
      name: 'test',
    });

    const response = await new JSONRPCRequest().makeRequest({
      isErrorTextStraightToOutput: true,
      endpoint: 'http://127.0.0.1:8080/json-rpc/positive',
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
    });

    expect(response).toEqual({
      data: {},
      error: true,
      errorText: 'Тестовая ошибка 1',
      additionalErrors: {
        err: 'Тестовая ошибка 1 err',
        param1: 'test param 1',
      },
      code: 400,
      headers: {
        connection: 'close',
        'content-length': '198',
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

    const response = await new JSONRPCRequest().makeRequest({
      isErrorTextStraightToOutput: true,
      endpoint: 'http://127.0.0.1:8080/json-rpc/positive',
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
    });

    expect(response).toEqual({
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo' },
      error: false,
      errorText: '',
      headers: {
        connection: 'close',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
        'content-length': '74',
        'content-type': 'application/json; charset=utf-8',
      },
    });
  });
});
