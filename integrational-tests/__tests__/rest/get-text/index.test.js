const { RestRequest } = require('../../../../dist');

const requestBaseConfig = {
  headers: {
    'Content-type': 'application/json',
  },
  mode: 'cors',
  parseType: 'text',
  queryParams: {
    foo: 'bar',
  },
  translateFunction: (key, options) =>
    `translateFunction got key ${key} and options ${options}`,
};

describe('text requests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('positive response', async () => {
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive/text',
    };

    const {
      data,
      errorText,
      error,
      additionalErrors,
      code,
    } = await new RestRequest().getRequest(requestConfig);

    expect(data).toEqual(
      '.page-119nIxfGdr{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}.content-26JUP_FzJx{margin-top:20px}.page-3xcBAGm9dG{background-color:red;display:-ms-flexbox;display:flex;-ms-flex-positive:1;flex-grow:1;height:100%;width:100%}',
    );
    expect(additionalErrors).toBeNull();
    expect(errorText).toEqual('');
    expect(error).toBeFalsy();
    expect(code).toEqual(200);
  });

  test('negative response', async () => {
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative/text',
    };

    const {
      data,
      errorText,
      error,
      additionalErrors,
      code,
    } = await new RestRequest().getRequest({
      ...requestConfig,
      parseType: 'blob',
    });

    expect(data).toEqual({});
    expect(additionalErrors).toBeNull();
    expect(errorText).toEqual(
      'translateFunction got key network-error and options undefined',
    );
    expect(error).toBeTruthy();
    expect(code).toEqual(500);
  });
});
