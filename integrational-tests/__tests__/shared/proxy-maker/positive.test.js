const Joi = require('@hapi/joi');
const { RestRequest, ProxyController } = require('../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  translateFunction: () => '',
};

const formattedResponse = {
  additionalErrors: null,
  code: 200,
  data: {
    bar: { baz: 0 },
    delta: ['1', '2'],
    foo: 'foo',
  },
  error: false,
  errorText: '',
};

const requestParams = {
  body: undefined,
  cache: 'default',
  credentials: undefined,
  endpoint: 'http://127.0.0.1:8080/rest/positive',
  headers: {
    'Content-type': 'application/json',
  },
  integrity: undefined,
  keepalive: undefined,
  method: 'GET',
  mode: undefined,
  redirect: undefined,
  referrer: undefined,
  referrerPolicy: undefined,
};

const pureResponseData = {
  additionalErrors: null,
  data: {
    bar: { baz: 0 },
    delta: ['1', '2'],
    foo: 'foo',
  },
  error: false,
  errorText: '',
};

describe.skip('ProxyController positive tests', () => {
  beforeEach(() => {
    delete global.window;
  });

  describe('setResponseTrackCallback', () => {
    test('set one tracking callback', async () => {
      let resultOptions;

      new ProxyController().setResponseTrackCallback({
        callback: setResponseTrackCallbackOptions => {
          resultOptions = { ...setResponseTrackCallbackOptions };
        },
        name: 'test',
      });

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
      };

      const response = await new RestRequest().getRequest(requestConfig);

      expect(response).toEqual(formattedResponse);
      expect(resultOptions.pureResponseData).toEqual(pureResponseData);
      expect(resultOptions.response).toBeDefined();
      expect(resultOptions.requestError).toBeFalsy();
      expect(resultOptions.formattedResponseData).toEqual(formattedResponse);
      expect(resultOptions.requestParams).toEqual(requestParams);
    });

    test('set two separate tracking callbacks', async () => {
      let resultOptionsOne;
      let resultOptionsTwo;

      new ProxyController().setResponseTrackCallback({
        callback: setResponseTrackCallbackOptions => {
          resultOptionsOne = { ...setResponseTrackCallbackOptions };
        },
        name: 'test one',
      });
      new ProxyController().setResponseTrackCallback({
        callback: setResponseTrackCallbackOptions => {
          resultOptionsTwo = { ...setResponseTrackCallbackOptions };
        },
        name: 'test two',
      });

      const requestConfig = {
        ...requestBaseConfig,
        endpoint: 'http://127.0.0.1:8080/rest/positive',
      };

      const response = await new RestRequest().getRequest(requestConfig);

      expect(response).toEqual(formattedResponse);
      expect(resultOptionsOne.pureResponseData).toEqual(pureResponseData);
      expect(resultOptionsOne.response).toBeDefined();
      expect(resultOptionsOne.requestError).toBeFalsy();
      expect(resultOptionsOne.formattedResponseData).toEqual(formattedResponse);
      expect(resultOptionsOne.requestParams).toEqual(requestParams);

      expect(response).toEqual(formattedResponse);
      expect(resultOptionsTwo.pureResponseData).toEqual(pureResponseData);
      expect(resultOptionsTwo.response).toBeDefined();
      expect(resultOptionsTwo.requestError).toBeFalsy();
      expect(resultOptionsTwo.formattedResponseData).toEqual(formattedResponse);
      expect(resultOptionsTwo.requestParams).toEqual(requestParams);
    });
  });
});
