const Joi = require('@hapi/joi');
const { RestRequest, ProxyController } = require('../../../../dist');

const requestBaseConfig = {
  responseSchema: Joi.any(),
  translateFunction: () => '',
};

const formattedResponse = {
  code: 500,
  data: {},
  error: true,
  errorText: '',
  additionalErrors: null,
};

const requestParams = {
  body: undefined,
  cache: 'default',
  credentials: undefined,
  endpoint: 'http://127.0.0.1:8080/rest/negative?internalerror=true',
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

describe.skip('ProxyController negative tests', () => {
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
        endpoint: 'http://127.0.0.1:8080/rest/negative?internalerror=true',
      };

      const response = await new RestRequest().getRequest(requestConfig);

      expect(response).toEqual(formattedResponse);
      expect(resultOptions.pureResponseData).toEqual(null);
      expect(resultOptions.response).toBeDefined();
      expect(resultOptions.requestError).toBeTruthy();
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
        endpoint: 'http://127.0.0.1:8080/rest/negative?internalerror=true',
      };

      const response = await new RestRequest().getRequest(requestConfig);

      expect(response).toEqual(formattedResponse);
      expect(resultOptionsOne.pureResponseData).toEqual(null);
      expect(resultOptionsOne.response).toBeDefined();
      expect(resultOptionsOne.requestError).toBeTruthy();
      expect(resultOptionsOne.formattedResponseData).toEqual(formattedResponse);
      expect(resultOptionsOne.requestParams).toEqual(requestParams);
      expect(response).toEqual(formattedResponse);
      expect(resultOptionsTwo.pureResponseData).toEqual(null);
      expect(resultOptionsTwo.response).toBeDefined();
      expect(resultOptionsTwo.requestError).toBeTruthy();
      expect(resultOptionsTwo.formattedResponseData).toEqual(formattedResponse);
      expect(resultOptionsTwo.requestParams).toEqual(requestParams);
    });
  });
});
