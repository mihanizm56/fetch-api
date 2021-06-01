const Joi = require('@hapi/joi');
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
          },
        ],
        error: false,
        errorText: '',
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
          },
        ],
        error: false,
        errorText: '',
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
          },
        ],
        error: false,
        errorText: '',
      });
    });
  });
});
