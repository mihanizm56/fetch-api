const { json } = require('body-parser');
const Joi = require('joi');
const { JSONRPCRequest } = require('../../../dist');

describe('JSON-PRC request (negative)', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('simple response', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
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
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo' },
      error: false,
      errorText: '',
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
  test('set headers', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
      specialheader: Joi.string().required(),
    });

    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/positive',
      responseSchema,
      headers: {
        specialheader: 'specialheader',
      },
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
    });

    expect(data).toEqual({
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo', specialheader: 'specialheader' },
      error: false,
      errorText: '',
      headers: {
        connection: 'close',
        'content-length': '106',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });
  test('set queryParams full check', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
      specialqueryparamBoolean: Joi.boolean().required(),
      specialqueryparamNumber: Joi.number().required(),
      specialqueryparamString: Joi.string().required(),
      specialqueryparamArray: Joi.array().items(Joi.string()),
    });

    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/positive',
      responseSchema,
      queryParams: {
        specialqueryparamBoolean: true,
        specialqueryparamNumber: 10,
        specialqueryparamString: '10',
        specialqueryparamArray: [0, '0', 1, '1'],
      },
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
    });

    expect(data).toEqual({
      additionalErrors: null,
      code: 200,
      data: {
        bar: { baz: 0 },
        foo: 'foo',
        specialqueryparamArray: ['0', '0', '1', '1'],
        specialqueryparamBoolean: 'true',
        specialqueryparamNumber: '10',
        specialqueryparamString: '10',
      },
      error: false,
      errorText: '',
      headers: {
        connection: 'close',
        'content-length': '213',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });
  test('set extra validation callback and this returns true', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      notValidSchema: Joi.object({
        baz: Joi.number().required(),
      }).required(),
      specialqueryparam: Joi.string().required(),
    });

    const extraValidationCallback = jest.fn().mockReturnValue(true);

    const data = await new JSONRPCRequest().makeRequest({
      endpoint: 'http://localhost:8080/json-rpc/positive',
      responseSchema,
      extraValidationCallback,
      body: {
        method: 'test_method',
        options: {
          foo: 'bar',
        },
      },
    });

    expect(data).toEqual({
      additionalErrors: null,
      code: 200,
      data: {
        bar: { baz: 0 },
        foo: 'foo',
      },
      error: false,
      errorText: '',
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
  test('test if ids of request and response are not the same but ignoreResponseIdCompare is set', async () => {
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
      ignoreResponseIdCompare: true,
    });

    expect(data).toEqual({
      additionalErrors: {
        err: 'Тестовая ошибка 2 err',
        param2: 'test param 2',
      },
      code: 400,
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
  describe('JSON-PRC batching (positive)', () => {
    test('test answer one object', async () => {
      const responseSchemaObject = Joi.object({
        foo: Joi.string().required(),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/positive?batch=true&oneSchema=true',
        body: [{ method: 'listCountries', params: {} }],
        isBatchRequest: true,
        responseSchema: [responseSchemaObject],
      });

      expect(data).toEqual({
        additionalErrors: null,
        code: 200,
        data: [
          {
            additionalErrors: null,
            code: 200,
            data: {
              bar: {
                baz: 0,
              },
              foo: 'foo',
            },
            error: false,
            errorText: '',
            headers: {
              connection: 'close',
              'content-length': '76',
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
          'content-length': '76',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('test answer two objects', async () => {
      const responseSchemaObjectOne = Joi.object({
        foo: Joi.string().required(),
      });
      const responseSchemaObjectTwo = Joi.object({
        countries: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            label: Joi.string().required(),
          }),
        ),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/positive?batch=true&twoSchemas=true',
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
            code: 200,
            data: {
              bar: {
                baz: 0,
              },
              foo: 'foo',
            },
            error: false,
            errorText: '',
            headers: {
              connection: 'close',
              'content-length': '316',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
          {
            additionalErrors: null,
            code: 200,
            error: false,
            errorText: '',
            data: {
              countries: [
                {
                  id: 'e128ce0f-852b-5c3c-9b95-f3d9829cc2a2',
                  value: 'ru-RU',
                  label: 'country.label.RU',
                },
                {
                  id: '84fbd842-4051-5702-a638-79bdb73a8f7e',
                  value: 'pl-PL',
                  label: 'country.label.PL',
                },
              ],
            },
            headers: {
              connection: 'close',
              'content-length': '316',
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
          'content-length': '316',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('test answer random order in response', async () => {
      const responseSchemaObjectOne = Joi.object({
        foo: Joi.string().required(),
      });
      const responseSchemaObjectTwo = Joi.object({
        countries: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            label: Joi.string().required(),
          }),
        ),
      });

      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/positive?batch=true&randomIds=true',
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
            code: 200,
            data: {
              bar: {
                baz: 0,
              },
              foo: 'foo',
            },
            error: false,
            errorText: '',
            headers: {
              connection: 'close',
              'content-length': '317',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
          {
            additionalErrors: null,
            code: 200,
            error: false,
            errorText: '',
            data: {
              countries: [
                {
                  id: 'e128ce0f-852b-5c3c-9b95-f3d9829cc2a2',
                  value: 'ru-RU',
                  label: 'country.label.RU',
                },
                {
                  id: '84fbd842-4051-5702-a638-79bdb73a8f7e',
                  value: 'pl-PL',
                  label: 'country.label.PL',
                },
              ],
            },
            headers: {
              connection: 'close',
              'content-length': '317',
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
          'content-length': '317',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test.only('test if ids of request and response are not the same but ignoreResponseIdCompare is set', async () => {
      const data = await new JSONRPCRequest().makeRequest({
        endpoint:
          'http://localhost:8080/json-rpc/positive?batch=true&notCorrectIds=true',
        body: [
          { method: 'listCountries', params: {} },
          { method: 'listCountries', params: {} },
        ],
        isBatchRequest: true,
        ignoreResponseIdCompare: true,
      });

      // console.log(JSON.stringify(data, null, 2));

      expect(data).toEqual({
        errorText: '',
        error: false,
        data: [
          {
            errorText: '',
            error: false,
            data: {
              countries: [
                {
                  id: 'e128ce0f-852b-5c3c-9b95-f3d9829cc2a2',
                  value: 'ru-RU',
                  label: 'country.label.RU',
                },
                {
                  id: '84fbd842-4051-5702-a638-79bdb73a8f7e',
                  value: 'pl-PL',
                  label: 'country.label.PL',
                },
              ],
            },
            additionalErrors: null,
            code: 200,
            headers: {
              connection: 'close',
              'content-length': '304',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
          {
            errorText: '',
            error: false,
            data: {
              foo: 'foo',
              bar: {
                baz: 0,
              },
            },
            additionalErrors: null,
            code: 200,
            headers: {
              connection: 'close',
              'content-length': '304',
              'content-type': 'application/json; charset=utf-8',
              date: 'mock-date',
              etag: 'mock-etag',
              'x-powered-by': 'Express',
            },
          },
        ],
        additionalErrors: null,
        code: 200,
        headers: {
          connection: 'close',
          'content-length': '304',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
  });
});
