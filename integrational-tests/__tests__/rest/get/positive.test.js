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
      bar: {
        baz: Joi.number().required(),
      },
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
        bar: {
          baz: Joi.number().required(),
        },
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

    test('response pure with headers are sent', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: {
          baz: Joi.number().required(),
        },
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
      bar: {
        baz: Joi.number().required(),
      },
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

  test('query parameters are sent', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: {
        baz: Joi.number().required(),
      },
      delta: Joi.array().items(Joi.string()),
      specialparameter: Joi.string().required(),
    }).unknown();

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      queryParams: {
        specialparameter: 'test-parameter',
      },
    };

    const data = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: null,
      data: {
        bar: { baz: 0 },
        delta: ['1', '2'],
        foo: 'foo',
        specialparameter: 'test-parameter',
      },
      error: false,
      errorText: '',
      code: 200,
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
      bar: {
        baz: Joi.number().required(),
      },
    }).unknown();

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      queryParams: {
        specialparameter: 'test-parameter',
      },
    };

    const data = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: null,
      data: {
        bar: { baz: 0 },
        delta: ['1', '2'],
        foo: 'foo',
        specialparameter: 'test-parameter',
      },
      error: false,
      errorText: '',
      code: 200,
    });
  });
});
