const Joi = require('joi');
const { JSONRPCRequest } = require('../../../dist');

describe('JSON-PRC request (negative)', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('simple response error 400', async () => {
    const responseSchema = Joi.any();

    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/negative',
      responseSchema,
      body: {
        method: 'test_method',
        options: {
          test: '123',
        },
      },
    });

    expect(data).toEqual({
      additionalErrors: {
        err: 'Тестовая ошибка 4 err',
        param4: 'test param 4',
      },
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
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
  test('simple response error 500 (not parsed)', async () => {
    const responseSchema = Joi.any();

    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/negative',
      responseSchema,
      queryParams: {
        notparsederror: true,
      },
      body: {
        method: 'test_method',
        options: {
          test: '123',
        },
      },
    });

    expect(data).toEqual({
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      headers: {
        connection: 'close',
        'content-length': '199',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });

  test('test get backend error in simple json-rpc request if the status is 204 with empty response data', async () => {
    const responseSchema = Joi.any();

    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/negative',
      responseSchema,
      queryParams: {
        emptyResponseError: true,
      },
      body: {
        method: 'test_method',
        options: {
          test: '123',
        },
      },
    });

    expect(data).toEqual({
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      headers: {
        connection: 'close',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });

  test('test if ids of request and response are not the same', async () => {
    const responseSchema = Joi.any();

    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/negative',
      responseSchema,
      queryParams: {
        notsameid: true,
      },
      body: {
        method: 'test_method',
        options: {
          test: '123',
        },
      },
    });

    expect(data).toEqual({
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      headers: {
        connection: 'close',
        'content-length': '199',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });

  test('test if schema not valid', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      notValidField: Joi.object({
        baz: Joi.number().required(),
      }).required(),
    });

    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/positive',
      responseSchema,
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
    });

    expect(data).toEqual({
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      headers: {
        connection: 'close',
        'content-length': '74',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });
  test('test get straight error', async () => {
    const responseSchema = Joi.any();
    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/negative',
      responseSchema,
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
      isErrorTextStraightToOutput: true,
    });

    expect(data).toEqual({
      additionalErrors: {
        err: 'Тестовая ошибка 4 err',
        param4: 'test param 4',
      },
      code: 500,
      data: {},
      error: true,
      errorText: 'Тестовая ошибка 4',
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
  test('set extra validation callback and this returns false', async () => {
    const responseSchema = Joi.any();
    const extraValidationCallback = jest.fn().mockReturnValue(false);
    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/positive',
      responseSchema,
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
      extraValidationCallback,
    });

    expect(data).toEqual({
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText: 'network-error',
      headers: {
        connection: 'close',
        'content-length': '74',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });
  test('test errors translation', async () => {
    const responseSchema = Joi.any();
    const translateFunction = jest
      .fn()
      .mockReturnValue('test value from translateFunction');
    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/negative',
      responseSchema,
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
      translateFunction,
    });

    expect(translateFunction).toHaveBeenCalledWith('test key 4', {
      err: 'Тестовая ошибка 4 err',
      trKey: 'test key 4',
      param4: 'test param 4',
    });
    expect(translateFunction).toHaveBeenCalledTimes(1);
    expect(data).toEqual({
      additionalErrors: {
        err: 'Тестовая ошибка 4 err',
        param4: 'test param 4',
      },
      code: 500,
      data: {},
      error: true,
      errorText: 'test value from translateFunction',
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
  describe('JSON-PRC batching (negative)', () => {
    test('test simply answer code not from whitelist', async () => {
      const responseSchemaObjectOne = Joi.object({
        foo: Joi.string().required(),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/negative?batch=true&simpleNegative=true',
        body: [{ method: 'listCountries', params: {} }],
        isBatchRequest: true,
        responseSchema: [responseSchemaObjectOne],
      });

      expect(data).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText: 'network-error',
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
    test('test not correct one schema', async () => {
      const responseSchemaObjectOne = Joi.object({
        foo: Joi.string().required(),
      });
      const responseSchemaObjectTwo = Joi.object({
        foo: Joi.string().required(),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/negative?batch=true&oneSchemaNegative=true',
        body: [
          { method: 'listCountries', params: {} },
          { method: 'listCountries', params: {} },
        ],
        isBatchRequest: true,
        responseSchema: [responseSchemaObjectOne, responseSchemaObjectTwo],
      });

      expect(data).toEqual({
        additionalErrors: null,
        code: 200,
        data: [
          {
            additionalErrors: null,
            error: true,
            errorText: 'network-error',
            data: {},
            code: 500,
            headers: {
              connection: 'close',
              'content-length': '119',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
          {
            additionalErrors: null,
            code: 200,
            data: {
              foo: '123',
            },
            errorText: '',
            error: false,
            headers: {
              connection: 'close',
              'content-length': '119',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
        ],
        error: false,
        errorText: '',
        headers: {
          connection: 'close',
          'content-length': '119',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('test not correct all (two) schemas', async () => {
      const responseSchemaObjectOne = Joi.object({
        foo: Joi.string().required(),
      });
      const responseSchemaObjectTwo = Joi.object({
        foo: Joi.string().required(),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/negative?batch=true&twoSchemaNegative=true',
        body: [
          { method: 'listCountries', params: {} },
          { method: 'listCountries', params: {} },
        ],
        isBatchRequest: true,
        responseSchema: [responseSchemaObjectOne, responseSchemaObjectTwo],
      });

      expect(data).toEqual({
        additionalErrors: null,
        code: 200,
        data: [
          {
            additionalErrors: null,
            error: true,
            errorText: 'network-error',
            data: {},
            code: 500,
            headers: {
              connection: 'close',
              'content-length': '117',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
          {
            additionalErrors: null,
            error: true,
            errorText: 'network-error',
            data: {},
            code: 500,
            headers: {
              connection: 'close',
              'content-length': '117',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
        ],
        error: false,
        errorText: '',
        headers: {
          connection: 'close',
          'content-length': '117',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('test get backend error in one item response', async () => {
      const responseSchemaObjectOne = Joi.object({
        foo: Joi.string().required(),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/negative?batch=true&simpleOneResponseError=true',
        body: [{ method: 'listCountries', params: {} }],
        isBatchRequest: true,
        responseSchema: [responseSchemaObjectOne],
      });

      expect(data).toEqual({
        additionalErrors: null,
        code: 200,
        data: [
          {
            additionalErrors: null,
            error: true,
            errorText: 'network-error',
            data: {},
            code: 500,
            headers: {
              connection: 'close',
              'content-length': '113',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
        ],
        error: false,
        errorText: '',
        headers: {
          connection: 'close',
          'content-length': '113',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('test get backend error in two items response', async () => {
      const responseSchemaObjectOne = Joi.object({
        foo: Joi.string().required(),
      });

      const responseSchemaObjectTwo = Joi.object({
        foo: Joi.string().required(),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/negative?batch=true&simpleTwoResponseError=true',
        body: [
          { method: 'listCountries', params: {} },
          { method: 'listCountries', params: {} },
        ],
        isBatchRequest: true,
        responseSchema: [responseSchemaObjectOne, responseSchemaObjectTwo],
      });

      expect(data).toEqual({
        additionalErrors: null,
        code: 200,
        data: [
          {
            additionalErrors: null,
            error: true,
            errorText: 'network-error',
            data: {},
            code: 500,
            headers: {
              connection: 'close',
              'content-length': '225',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
          {
            additionalErrors: null,
            error: true,
            errorText: 'network-error',
            data: {},
            code: 500,
            headers: {
              connection: 'close',
              'content-length': '225',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
        ],
        error: false,
        errorText: '',
        headers: {
          connection: 'close',
          'content-length': '225',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });

    test('test get backend error in batch request if the status is 204 with empty response data', async () => {
      const responseSchemaObjectOne = Joi.object({
        foo: Joi.string().required(),
      });

      const responseSchemaObjectTwo = Joi.object({
        foo: Joi.string().required(),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/negative?emptyResponseError=true',
        body: [
          { method: 'listCountries', params: {} },
          { method: 'listCountries', params: {} },
        ],
        isBatchRequest: true,
        responseSchema: [responseSchemaObjectOne, responseSchemaObjectTwo],
      });

      expect(data).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText: 'network-error',
        headers: {
          connection: 'close',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });

    test('test get backend in batch request if the response length is not equal to body', async () => {
      const responseSchemaObjectOne = Joi.object({
        foo: Joi.string().required(),
      });

      const responseSchemaObjectTwo = Joi.object({
        foo: Joi.string().required(),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/positive?batch=true&batchLengthError=true',
        body: [
          { method: 'listCountries1', params: {} },
          { method: 'listCountries2', params: {} },
        ],
        isBatchRequest: true,
        responseSchema: [responseSchemaObjectOne, responseSchemaObjectTwo],
      });

      expect(data).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText: 'network-error',
        headers: {
          connection: 'close',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
          'content-length': '77',
          'content-type': 'application/json; charset=utf-8',
        },
      });
    });

    test('test get backend in batch request if the response contains items that are not in json-rpc schema', async () => {
      const responseSchemaObjectOne = Joi.object({
        foo: Joi.string().required(),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/positive?batch=true&batchErrorStructureError=true',
        body: [{ method: 'listCountries1', params: {} }],
        isBatchRequest: true,
        responseSchema: [responseSchemaObjectOne],
      });

      expect(data).toEqual({
        additionalErrors: null,
        code: 200,
        data: [
          {
            error: true,
            errorText: 'network-error',
            data: {},
            additionalErrors: null,
            code: 500,
            headers: {
              connection: 'close',
              'content-length': '105',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
        ],
        error: false,
        errorText: '',
        headers: {
          connection: 'close',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
          'content-length': '105',
          'content-type': 'application/json; charset=utf-8',
        },
      });
    });
  });
});
