const { RestRequest } = require('../../../../dist');

const requestBaseConfig = {
  mode: 'cors',
  translateFunction: (key, options) =>
    `translateFunction got key ${key} and options ${options}`,
  pureJsonFileResponse: true,
  parseType: 'json',
};

describe('get pure json file requests', () => {
  beforeEach(() => {
    delete global.window;
  });

  test('positive response', async () => {
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/positive/json-file',
    };

    const response = await new RestRequest().getRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 200,
      data: {
        loadRef: {
          JS: 'umd/index.6dbcc83480c5e393f89c.js',
          APP_STATIC_NAMESPACE: 'suppliers-portal-business-card-frontend',
          WB_STATIC_URL: 'https://mstatic.wbstatic.net',
          APP_VERSION: 'v2.5.16',
        },
      },
      error: false,
      errorText: '',
      headers: {
        connection: 'close',
        'content-length': '190',
        'content-type': 'application/json; charset=utf-8',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });

  test('negative response', async () => {
    const requestConfig = {
      ...requestBaseConfig,
      endpoint: 'http://127.0.0.1:8080/rest/negative/json-file',
    };

    const response = await new RestRequest().getRequest(requestConfig);

    expect(response).toEqual({
      additionalErrors: null,
      code: 500,
      data: {},
      error: true,
      errorText:
        'translateFunction got key network-error and options undefined',
      headers: {
        connection: 'close',
        'content-length': '111',
        date: 'mock-date',
        etag: 'mock-etag',
        'x-powered-by': 'Express',
      },
    });
  });
});
