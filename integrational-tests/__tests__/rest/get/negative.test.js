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

describe('get request (negative)', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('simple response with 400 error', async () => {
    const responseSchema = Joi.any();
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notvaliddata=true',
      responseSchema,
    };

    const data = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: null,
      data: {},
      error: true,
      errorText:
        'translateFunction got key not valid data and options undefined',
      code: 400,
    });
  });

  test('simple response with 404 error', async () => {
    const responseSchema = Joi.any();
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notfound=true',
      responseSchema,
    };

    const data = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: null,
      data: {},
      error: true,
      errorText: 'not-found-error',
      code: 404,
    });
  });

  test('simple response with 500 error', async () => {
    const responseSchema = Joi.any();
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?internalerror=true',
      responseSchema,
    };

    const data = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: null,
      data: {},
      error: true,
      errorText:
        'translateFunction got key network-error and options undefined',
      code: 500,
    });
  });

  test('response with not valid base format', async () => {
    const responseSchema = Joi.any();
    const requestConfig = {
      ...requestBaseConfig,
      endpoint:
        'http://127.0.0.1:8080/rest/negative?notvalidbasestructure=true',
      responseSchema,
    };

    const data = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: null,
      data: {},
      error: true,
      errorText:
        'translateFunction got key network-error and options undefined',
      code: 500,
    });
  });

  test('response with not valid schema', async () => {
    const responseSchema = Joi.object({
      foo: Joi.string().required(),
      bar: Joi.object({
        baz: Joi.number().required(),
      }).required(),
      delta: Joi.array().items(Joi.string()),
    });

    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative?notvalidschema=true',
      responseSchema,
    };

    const data = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: null,
      data: {},
      error: true,
      errorText:
        'translateFunction got key network-error and options undefined',
      code: 500,
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

    const data = await new RestRequest().getRequest(requestConfig);

    expect(extraValidationCallback).toHaveBeenCalled();
    expect(data).toEqual({
      additionalErrors: null,
      data: {},
      error: true,
      errorText:
        'translateFunction got key network-error and options undefined',
      code: 500,
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

    const data = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual({
      additionalErrors: { baz: 1, foo: 'bar' },
      data: {},
      error: true,
      errorText: 'test special key',
      code: 400,
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
      };

      const data = await new RestRequest().getRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText: 'not-found-error',
        code: 404,
      });
    });

    test('check 404 error with body', async () => {
      const responseSchema = Joi.any();

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/negative?notfoundwithbody=true',
        responseSchema,
      };

      const data = await new RestRequest().getRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: { foo: 'bar' },
        error: true,
        errorText: 'not-found-error',
        code: 404,
        data: {},
      });
    });
  });

  describe('check PureRestRequest', () => {
    test('simple pure response with 403 error', async () => {
      const responseSchema = Joi.any();
      const translateFunction = jest
        .fn()
        .mockReturnValue('test value from translateFunction');
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/negative?pureresponse=true',
        responseSchema,
        translateFunction,
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(translateFunction).toHaveBeenCalledWith('text', { parameter: 1 });
      expect(translateFunction).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        additionalErrors: { parameter: 1 },
        code: 403,
        data: {},
        error: true,
        errorText: 'test value from translateFunction',
      });
    });

    test('simple pure response with not valid schema', async () => {
      const responseSchema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.object({
          baz: Joi.number().required(),
        }).required(),
        alt: Joi.number().required(),
      });
      const translateFunction = jest
        .fn()
        .mockReturnValue('test value from translateFunction');
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        responseSchema,
        translateFunction,
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(translateFunction).toHaveBeenCalledWith('network-error');
      expect(translateFunction).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText: 'test value from translateFunction',
      });
    });

    test('simple pure response with straight output', async () => {
      const responseSchema = Joi.any();
      const translateFunction = jest
        .fn()
        .mockReturnValue('test value from translateFunction');
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/rest/negative?pureresponse=true&straighterror=true',
        responseSchema,
        translateFunction,
        isErrorTextStraightToOutput: true,
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(translateFunction).toHaveBeenCalledTimes(0);
      expect(response).toEqual({
        additionalErrors: { parameterText: 1 },
        code: 400,
        data: {},
        error: true,
        errorText: 'straighterror',
      });
    });

    test('simple pure response with extra validation callback', async () => {
      const responseSchema = Joi.any();
      const translateFunction = jest
        .fn()
        .mockReturnValue('test value from translateFunction');
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        responseSchema,
        translateFunction,
        extraValidationCallback: jest.fn().mockReturnValue(false),
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(translateFunction).toHaveBeenCalledWith('network-error');
      expect(translateFunction).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText: 'test value from translateFunction',
      });
    });

    test('simple pure response with extra validation callback', async () => {
      const responseSchema = Joi.any();
      const translateFunction = jest
        .fn()
        .mockReturnValue('test value from translateFunction');
      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
        responseSchema,
        translateFunction,
        extraValidationCallback: jest.fn().mockReturnValue(false),
      };

      const response = await new PureRestRequest().getRequest(requestConfig);

      expect(translateFunction).toHaveBeenCalledWith('network-error');
      expect(translateFunction).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        additionalErrors: null,
        code: 500,
        data: {},
        error: true,
        errorText: 'test value from translateFunction',
      });
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

    const response = await new PureRestRequest().getRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: { error: 'text in error' },
      code: 403,
      data: {},
      error: true,
      errorText:
        'translateFunction got key text in error and options [object Object]',
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

    const response = await new PureRestRequest().getRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: { error: 'empty test error in errorText' },
      code: 403,
      data: {},
      error: true,
      errorText: 'translateFunction got key  and options [object Object]',
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

      const data = await new RestRequest().getRequest(requestConfig);

      expect(translateFunction).toHaveBeenCalledWith('test error key');
      expect(translateFunction).toHaveBeenCalledTimes(1);
      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText: 'test value from translateFunction',
        code: 401,
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

      const data = await new RestRequest().getRequest(requestConfig);

      expect(translateFunction).toHaveBeenCalledWith('test special key', {
        baz: 1,
        foo: 'bar',
      });
      expect(translateFunction).toHaveBeenCalledTimes(1);
      expect(data).toEqual({
        additionalErrors: { baz: 1, foo: 'bar' },
        data: {},
        error: true,
        errorText: 'test value from translateFunction',
        code: 400,
      });
    });
  });

  describe('response with not valid response structure', () => {
    test('data was not sent', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/rest/negative?notvalidstructuredata=true',
        responseSchema,
      };

      const data = await new RestRequest().getRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText:
          'translateFunction got key network-error and options undefined',
        code: 500,
      });
    });
    test('error was not sent', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/rest/negative?notvalidstructureerror=true',
        responseSchema,
      };

      const data = await new RestRequest().getRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText:
          'translateFunction got key network-error and options undefined',
        code: 500,
      });
    });
    test('errorText was not sent', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/rest/negative?notvalidstructureerrortext=true',
        responseSchema,
      };

      const data = await new RestRequest().getRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText:
          'translateFunction got key network-error and options undefined',
        code: 500,
      });
    });
    test('additionalErrors was not sent', async () => {
      const responseSchema = Joi.any();
      const requestConfig = {
        ...requestBaseConfig,
        endpoint:
          'http://127.0.0.1:8080/rest/negative?notvalidstructureadditionalerrors=true',
        responseSchema,
      };

      const data = await new RestRequest().getRequest(requestConfig);

      expect(data).toEqual({
        additionalErrors: null,
        data: {},
        error: true,
        errorText:
          'translateFunction got key network-error and options undefined',
        code: 500,
      });
    });
  });
});
