const { RestRequest } = require('../../../../dist');

const requestBaseConfig = {
  headers: {
    'Content-type': 'application/json',
  },
  mode: 'cors',
  queryParams: {
    foo: 'bar',
  },
  translateFunction: (key, options) =>
    `translateFunction got key ${key} and options ${options}`,
};

describe('get-blob request', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('positive response', async () => {
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive/blob',
    };

    const {
      data,
      errorText,
      error,
      additionalErrors,
      code,
    } = await new RestRequest().getBlobRequest(requestConfig);

    expect(data).toBeDefined();
    expect(additionalErrors).toBeNull();
    expect(errorText).toEqual('');
    expect(error).toBeFalsy();
    expect(code).toEqual(200);
  });

  test('negative response', async () => {
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative/blob',
    };

    const {
      data,
      errorText,
      error,
      additionalErrors,
      code,
    } = await new RestRequest().getBlobRequest(requestConfig);

    expect(data).toEqual({});
    expect(additionalErrors).toBeNull();
    expect(errorText).toEqual(
      'translateFunction got key network-error and options undefined',
    );
    expect(error).toBeTruthy();
    expect(code).toEqual(500);
  });
});
