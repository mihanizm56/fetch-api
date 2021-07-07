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

describe('delete request (negative)', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('simple response with 400 error', async () => {
    const responseSchema = Joi.any();
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative',
      responseSchema,
    };

    const response = await new RestRequest().deleteRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 400,
      data: {},
      error: true,
      errorText: 'translateFunction got key test error and options undefined',
      headers: {
        connection: 'close',
        'content-length': '75',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });

  test('simple response with additionalErrors', async () => {
    const responseSchema = Joi.any();
    const translateFunction = jest
      .fn()
      .mockReturnValue('test value from translateFunction');
    const requestConfig = {
      ...requestBaseConfig,
      translateFunction,
      endpoint:
        'http://127.0.0.1:8080/rest/negative?errorwithadditionalerrors=true',
      responseSchema,
    };

    const response = await new RestRequest().deleteRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: { parameter: 1 },
      code: 402,
      data: {},
      error: true,
      errorText: 'test value from translateFunction',
      headers: {
        connection: 'close',
        'content-length': '110',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });

  test('simple response with 500 error (not parsed)', async () => {
    const responseSchema = Joi.any();
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?internalerror=true',
      responseSchema,
    };

    const response = await new RestRequest().deleteRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText:
        'translateFunction got key network-error and options undefined',
      headers: {
        connection: 'close',
        'content-length': '98',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });
  test('response with not valid schema', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      notValidValue: Joi.object({
        baz: Joi.number().required(),
      }).required(),
    });
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
    };

    const response = await new RestRequest().deleteRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText:
        'translateFunction got key network-error and options undefined',
      headers: {
        connection: 'close',
        'content-length': '91',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });
  test('extra validation callback test returns false', async () => {
    const responseSchema = Joi.any();
    const extraValidationCallback = jest.fn().mockReturnValue(false);

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive',
      responseSchema,
      extraValidationCallback,
    };

    const data = await new RestRequest().deleteRequest(requestConfig);

    expect(extraValidationCallback).toHaveBeenCalled();
    expect(data).toEqual({
      additionalErrors: null,
      data: {},
      error: true,
      errorText:
        'translateFunction got key network-error and options undefined',
      code: 500,
      headers: {
        connection: 'close',
        'content-length': '91',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });
  test('straight error output parameter is set', async () => {
    const responseSchema = Joi.any();

    const requestConfig = {
      ...requestBaseConfig,
      endpoint:
        'http://127.0.0.1:8080/rest/negative?errorwithadditionalerrors=true',
      responseSchema,
      isErrorTextStraightToOutput: true,
    };

    const data = await new RestRequest().deleteRequest(requestConfig);

    expect(data).toEqual({
      code: 402,
      error: true,
      errorText: 'test errors with additional params',
      data: {},
      additionalErrors: { parameter: 1 },
      headers: {
        connection: 'close',
        'content-length': '110',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });

  describe('test 404 error', () => {
    test('check 404 error without body', async () => {
      const responseSchema = Joi.any();

      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/rest/negative?notfoundwithoutbody=true',
        responseSchema,
        body: {},
      };

      const data = await new RestRequest().deleteRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText: 'not-found-error',
        code: 404,
        headers: {
          connection: 'close',
          'content-length': '111',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });

    test('check 404 error with body', async () => {
      const responseSchema = Joi.any();

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithbody=true',
        responseSchema,
        body: {},
      };

      const data = await new RestRequest().deleteRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: { foo: 'bar' },
        error: true,
        errorText: 'not-found-error',
        code: 404,
        data: {},
        headers: {
          connection: 'close',
          'content-length': '83',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
  });

  describe('check PureRestRequest', () => {
    test('simple pure response with 403 error', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/negative?pureresponse=true',
        responseSchema,
      };

      const data = await new PureRestRequest().deleteRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: {},
        code: 403,
        data: {},
        error: true,
        errorText:
          'translateFunction got key test errors with additional params and options [object Object]',
        headers: {
          connection: 'close',
          'content-length': '50',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('simple pure response with not valid schema', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.object({
          baz: Joi.number().required(),
        }),
      });
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        responseSchema,
      };

      const data = await new PureRestRequest().deleteRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText:
          'translateFunction got key network-error and options undefined',
        headers: {
          connection: 'close',
          'content-length': '91',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('simple pure response with error when text error is provided in "error" field', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/rest/negative?errorastext=true&pureresponse=true',
        responseSchema,
      };

      const response = await new PureRestRequest().deleteRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: { error: 'text in error' },
        code: 403,
        data: {},
        error: true,
        errorText:
          'translateFunction got key text in error and options [object Object]',
        headers: {
          connection: 'close',
          'content-length': '25',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });

    test('simple pure response with error when text error is provided in "error" field but errorText is string and empty', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/rest/negative?errorastext=true&pureresponse=true&errortextexist=true',
        responseSchema,
      };

      const response = await new PureRestRequest().deleteRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: { error: 'empty test error in errorText' },
        code: 403,
        data: {},
        error: true,
        errorText: 'translateFunction got key  and options [object Object]',
        headers: {
          connection: 'close',
          'content-length': '56',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('simple pure response with straight output', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.object({
          baz: Joi.number().required(),
        }),
      });
      const translateFunction = jest
        .fn()
        .mockReturnValue('test value from translateFunction');
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/rest/negative?straighterror=true&pureresponse=true',
        translateFunction,
        responseSchema,
        isErrorTextStraightToOutput: true,
      };

      const data = await new PureRestRequest().deleteRequest(requestConfig);

      expect(translateFunction).toHaveBeenCalledTimes(0);
      expect(data).toEqual({
        additionalErrors: { foo: 1 },
        code: 403,
        data: {},
        error: true,
        errorText: 'test straight error',
        headers: {
          connection: 'close',
          'content-length': '64',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('simple pure response with extra validation callback', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.object({
          baz: Joi.number().required(),
        }),
      });
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/negative?pureresponse=true',
        responseSchema,
        extraValidationCallback: jest.fn().mockReturnValue(false),
      };

      const data = await new PureRestRequest().deleteRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText:
          'translateFunction got key network-error and options undefined',
        headers: {
          connection: 'close',
          'content-length': '50',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
  });

  describe('check translateFunction got valid params', () => {
    test('translateFunction got valid key', async () => {
      const responseSchema = Joi.any();
      const translateFunction = jest
        .fn()
        .mockReturnValue('test value from translateFunction');
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/negative',
        responseSchema,
        translateFunction,
      };

      const data = await new RestRequest().deleteRequest(requestConfig);

      expect(translateFunction).toHaveBeenCalledWith('test error');
      expect(translateFunction).toHaveBeenCalledTimes(1);
      expect(data).toEqual({
        additionalErrors: null,
        code: 400,
        data: {},
        error: true,
        errorText: 'test value from translateFunction',
        headers: {
          connection: 'close',
          'content-length': '75',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('translateFunction got valid key and options', async () => {
      const responseSchema = Joi.any();
      const translateFunction = jest
        .fn()
        .mockReturnValue('test value from translateFunction');
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/rest/negative?errorwithadditionalerrors=true',
        responseSchema,
        translateFunction,
      };

      const data = await new RestRequest().deleteRequest(requestConfig);

      expect(translateFunction).toHaveBeenCalledWith(
        'test errors with additional params',
        {
          parameter: 1,
        },
      );
      expect(translateFunction).toHaveBeenCalledTimes(1);
      expect(data).toEqual({
        additionalErrors: { parameter: 1 },
        code: 402,
        data: {},
        error: true,
        errorText: 'test value from translateFunction',
        headers: {
          connection: 'close',
          'content-length': '110',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
  });

  describe('response with not valid response structure', () => {
    test('data was not sent', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/negative?notsentdata=true',
        responseSchema,
      };

      const data = await new RestRequest().deleteRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText:
          'translateFunction got key network-error and options undefined',
        code: 500,
        headers: {
          connection: 'close',
          'content-length': '63',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('error was not sent', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/negative?notsenterror=true',
        responseSchema,
      };

      const response = await new RestRequest().deleteRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText:
          'translateFunction got key network-error and options undefined',
        headers: {
          connection: 'close',
          'content-length': '63',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('errorText was not sent', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/negative?notsenterrortext=true',
        responseSchema,
      };

      const response = await new RestRequest().deleteRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText:
          'translateFunction got key network-error and options undefined',
        headers: {
          connection: 'close',
          'content-length': '63',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
    test('additionalErrors was not sent', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/negative?notsentadderr=true',
        responseSchema,
      };

      const response = await new RestRequest().deleteRequest(requestConfig);

      expect(response).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText:
          'translateFunction got key network-error and options undefined',
        headers: {
          connection: 'close',
          'content-length': '63',
          'content-type': 'application/json; charset=utf-8',
          date: 'mock-date',
          etag: 'mock-etag',
          'x-powered-by': 'Express',
        },
      });
    });
  });
});
