const Joi = require('@hapi/joi');
const { RestRequest, PureRestRequest } = require('../../../../dist');

const requestBaseConfig = {
  mode: 'cors',
  queryParams: {
    foo: 'bar',
  },
  translateFunction: (key, options) =>
    `translateFunction got key ${key} and options ${options}`,
};

describe('get request (positive)', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('simple response', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
      delta: Joi.array().items(Joi.string()),
    }).unknown();

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
    };

    const {
      data,
      errorText,
      error,
      additionalErrors,
      code,
    } = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({ bar: { baz: 0 }, delta: ['1', '2'], foo: 'foo' });
    expect(additionalErrors).toBeNull();
    expect(errorText).toEqual('');
    expect(error).toBeFalsy();
    expect(code).toEqual(200);
  });

  describe('check PureRestRequest', () => {
    test('simple response pure', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.object({
          baz: Joi.number().required(),
        }).required(),
        delta: Joi.array().items(Joi.string()),
      }).unknown();

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive?pureresponse=true',
        responseSchema,
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: { bar: { baz: 0 }, delta: ['1', '2'], foo: 'foo' },
        error: false,
        errorText: '',
      });
    });

    describe('test selected fields', () => {
      test('get simple array with selected field', async () => {
        const responseSchema = Joi.object({
          foo: Joi.string().required(),
          bar: Joi.object({
            baz: Joi.number().required(),
          }).required(),
          delta: Joi.array().items(Joi.string()),
        }).unknown();

        const requestConfig = {
          ...requestBaseConfig,
          endpoint: 'http://127.0.0.1:8080/rest/positive?pureresponse=true',
          responseSchema,
          selectData: 'delta',
        };

        const response = await new PureRestRequest().getRequest(requestConfig);

        expect(response).toEqual({
          additionalErrors: null,
          code: 200,
          data: { delta: ['1', '2'] },
          error: false,
          errorText: '',
        });
      });

      test('get full data if empty select field provided', async () => {
        const responseSchema = Joi.object({
          foo: Joi.string().required(),
          bar: Joi.object({
            baz: Joi.number().required(),
          }).required(),
          delta: Joi.array().items(Joi.string()),
        }).unknown();

        const requestConfig = {
          ...requestBaseConfig,
          endpoint: 'http://127.0.0.1:8080/rest/positive?pureresponse=true',
          responseSchema,
          selectData: '',
        };

        const response = await new PureRestRequest().getRequest(requestConfig);

        expect(response).toEqual({
          additionalErrors: null,
          code: 200,
          data: {
            bar: { baz: 0 },
            delta: ['1', '2'],
            foo: 'foo',
          },
          error: false,
          errorText: '',
        });
      });

      test('get no data if not correct select field provided', async () => {
        const responseSchema = Joi.object({
          foo: Joi.string().required(),
          bar: Joi.object({
            baz: Joi.number().required(),
          }).required(),
          delta: Joi.array().items(Joi.string()),
        }).unknown();

        const requestConfig = {
          ...requestBaseConfig,
          endpoint: 'http://127.0.0.1:8080/rest/positive?pureresponse=true',
          responseSchema,
          selectData: 'zoo',
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

      test('get data if custom selector provided', async () => {
        const responseSchema = Joi.object({
          foo: Joi.string().required(),
          bar: Joi.object({
            baz: Joi.number().required(),
          }).required(),
          delta: Joi.array().items(Joi.string()),
        }).unknown();

        const requestConfig = {
          ...requestBaseConfig,
          endpoint: 'http://127.0.0.1:8080/rest/positive?pureresponse=true',
          responseSchema,
          customSelectorData: data => data.delta,
        };

        const response = await new PureRestRequest().getRequest(requestConfig);

        expect(response).toEqual({
          additionalErrors: null,
          code: 200,
          data: ['1', '2'],
          error: false,
          errorText: '',
        });
      });
    });

    test('response pure with headers are sent', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.object({
          baz: Joi.number().required(),
        }).required(),
        delta: Joi.array().items(Joi.string()),
        specialheader: Joi.string().required(),
      }).unknown();

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive?pureresponse=true',
        responseSchema,
        headers: {
          specialheader: 'application/json',
        },
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: {
          bar: { baz: 0 },
          delta: ['1', '2'],
          foo: 'foo',
          specialheader: 'application/json',
        },
        error: false,
        errorText: '',
      });
    });
  });

  test('headers are sent', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
      delta: Joi.array().items(Joi.string()),
      specialheader: Joi.string().required(),
    }).unknown();

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      headers: {
        specialheader: 'application/json',
      },
    };

    const data = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: null,
      data: {
        bar: { baz: 0 },
        delta: ['1', '2'],
        foo: 'foo',
        specialheader: 'application/json',
      },
      error: false,
      errorText: '',
      code: 200,
    });
  });

  test('set queryParams full check', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
      delta: Joi.array().items(Joi.string()),
      specialqueryparamBoolean: Joi.boolean().required(),
      specialqueryparamNumber: Joi.number().required(),
      specialqueryparamString: Joi.string().required(),
      specialqueryparamArray: Joi.array().items(Joi.string()),
    }).unknown();

    const data = await new RestRequest().getRequest({
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      queryParams: {
        specialqueryparamBoolean: true,
        specialqueryparamNumber: 10,
        specialqueryparamString: '10',
        specialqueryparamArray: [0, '0', 1, '1'],
      },
    });

    expect(data).toEqual({
      additionalErrors: null,
      code: 200,
      data: {
        bar: { baz: 0 },
        delta: ['1', '2'],
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

  test('extra validation callback returns "true" and was called', async () => {
    const responseSchema = Joi.any();
    const extraValidationCallback = jest.fn().mockReturnValue(true);
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      extraValidationCallback,
    };

    const data = await new RestRequest().getRequest(requestConfig);

    expect(extraValidationCallback).toHaveBeenCalled();
    expect(data).toEqual({
      additionalErrors: null,
      data: { bar: { baz: 0 }, delta: ['1', '2'], foo: 'foo' },
      error: false,
      errorText: '',
      code: 200,
    });
  });

  test('schema was extended and is still valid', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
    }).unknown();

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
    };

    const data = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: null,
      data: {
        bar: { baz: 0 },
        delta: ['1', '2'],
        foo: 'foo',
      },
      error: false,
      errorText: '',
      code: 200,
    });
  });
  describe('extra cases', () => {
    test('get 204 code', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.object({
          baz: Joi.number().required(),
        }).required(),
      }).unknown();

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        responseSchema,
        queryParams: {
          isempty: true,
          pureresponse: true,
        },
      };

      const data = await new PureRestRequest().getRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: false,
        errorText: '',
        code: 204,
      });
    });
    test('get simple array', async () => {
      const responseSchema = Joi.array().items(
        Joi.object({
          username: Joi.string().required(),
          count: Joi.number().required(),
        }).unknown(),
      );

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        responseSchema,
        queryParams: {
          getsimplearray: true,
          pureresponse: true,
        },
      };

      const data = await new PureRestRequest().getRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        data: [
          {
            username: 'username1',
            count: 1,
          },
          {
            username: 'username2',
            count: 2,
          },
        ],
        error: false,
        errorText: '',
        code: 200,
      });
    });
  });
});
