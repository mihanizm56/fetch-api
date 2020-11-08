const Joi = require('@hapi/joi');
const { RestRequest, PureRestRequest } = require('../../../../dist');

const requestBaseConfig = {
  mode: 'cors',
  translateFunction: (key, options) =>
    `translateFunction got key ${key} and options ${options}`,
};

describe('post request (positive)', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('simple response without body', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
    });

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
    };

    const response = await new RestRequest().postRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo' },
      error: false,
      errorText: '',
    });
  });

  test('simple response with body', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
      bodyparam: Joi.string().required(),
    });

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      body: {
        bodyparam: 'bodyparam',
      },
    };

    const response = await new RestRequest().postRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo', bodyparam: 'bodyparam' },
      error: false,
      errorText: '',
    });
  });

  test('simple response with query params', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
      queryparam: Joi.string().required(),
    });

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      queryParams: {
        queryparam: 'queryparam',
      },
    };

    const response = await new RestRequest().postRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo', queryparam: 'queryparam' },
      error: false,
      errorText: '',
    });
  });

  test('simple response with headers', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
      specialheader: Joi.string().required(),
    });

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      headers: {
        specialheader: 'specialheader',
      },
    };

    const response = await new RestRequest().postRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo', specialheader: 'specialheader' },
      error: false,
      errorText: '',
    });
  });

  test('extra validation callback returns "true" and was called', async () => {
    const responseSchema = Joi.object({
      nonActual: Joi.string().required(),
    });
    const extraValidationCallback = jest.fn().mockReturnValue(true);
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      extraValidationCallback,
    };

    const response = await new RestRequest().postRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo' },
      error: false,
      errorText: '',
    });
  });

  test('schema was extended and is still valid', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
    });

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      queryParams: {
        queryparam: 'queryparam',
      },
    };

    const response = await new RestRequest().postRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 200,
      data: { bar: { baz: 0 }, foo: 'foo', queryparam: 'queryparam' },
      error: false,
      errorText: '',
    });
  });

  test('set json Content-type header', async () => {
    const responseSchema = Joi.object({
      headerValue: Joi.string().required(),
    });

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      queryParams: {
        getcontenttype: true,
      },
    };

    const data = await new RestRequest().postRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: null,
      data: {
        headerValue: 'application/json',
      },
      error: false,
      errorText: '',
      code: 200,
    });
  });

  describe('check PureRestRequest', () => {
    test('simple response', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.object({
          baz: Joi.number().required(),
        }).required(),
      });

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive?pureresponse=true',
        responseSchema,
      };

      const response = await new PureRestRequest().postRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: { bar: { baz: 0 }, foo: 'foo' },
        error: false,
        errorText: '',
      });
    });

    test('response with body', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.object({
          baz: Joi.number().required(),
        }).required(),
        bodyparam: Joi.string().required(),
      });

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive?pureresponse=true',
        responseSchema,
        body: {
          bodyparam: 'bodyparam',
        },
      };

      const response = await new PureRestRequest().postRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: { bar: { baz: 0 }, foo: 'foo', bodyparam: 'bodyparam' },
        error: false,
        errorText: '',
      });
    });

    test('response extra validation callback returns \'true\' and was called', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        testNonValidField: {
          baz: Joi.number().required(),
        },
      });
      const extraValidationCallback = jest.fn().mockReturnValue(true);

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive?pureresponse=true',
        responseSchema,
        body: {
          bodyparam: 'bodyparam',
        },
        extraValidationCallback,
      };

      const response = await new PureRestRequest().postRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: { bar: { baz: 0 }, foo: 'foo', bodyparam: 'bodyparam' },
        error: false,
        errorText: '',
      });
    });

    test('response with headers', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.object({
          baz: Joi.number().required(),
        }).required(),
        specialheader: Joi.string().required(),
      });

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        responseSchema,
        headers: {
          specialheader: 'specialheader',
        },
      };

      const response = await new RestRequest().postRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 200,
        data: { bar: { baz: 0 }, foo: 'foo', specialheader: 'specialheader' },
        error: false,
        errorText: '',
      });
    });
  });
});
