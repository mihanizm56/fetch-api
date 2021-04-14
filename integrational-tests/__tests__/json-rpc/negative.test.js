const Joi = require('@hapi/joi');
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
    });
  });
  describe.only('JSON-PRC batching (negative)', () => {
    test.only('test simply answer code not from whitelist', async () => {
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
          },
          {
            additionalErrors: null,
            code: 200,
            data: {
              foo: '123',
            },
            errorText: '',
            error: false,
          },
        ],
        error: false,
        errorText: '',
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
          },
          {
            additionalErrors: null,
            error: true,
            errorText: 'network-error',
            data: {},
            code: 500,
          },
        ],
        error: false,
        errorText: '',
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
          },
        ],
        error: false,
        errorText: '',
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
          },
          {
            additionalErrors: null,
            error: true,
            errorText: 'network-error',
            data: {},
            code: 500,
          },
        ],
        error: false,
        errorText: '',
      });
    });
  });
});
