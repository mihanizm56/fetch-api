const { JSONRPCRequest } = require('../../dist');
const { errorsMap } = require('../constants');

module.exports.JSONRPCRequest = responseSchema =>
  new JSONRPCRequest().makeRequest({
    endpoint: 'http://localhost:8080/json-rpc',
    errorsMap,
    responseSchema,
    body: {
      method: 'test_method',
      options: {
        foo: 'bar',
      },
    },
  });

module.exports.JSONRPCNegativeRequest = responseSchema =>
  new JSONRPCRequest().makeRequest({
    endpoint: 'http://localhost:8080/json-rpc/negative',
    errorsMap,
    responseSchema,
    body: {
      method: 'test_method',
      options: {
        foo: 'bar',
      },
    },
  });

module.exports.JSONRPCNegativeRequestEn = responseSchema =>
  new JSONRPCRequest().makeRequest({
    endpoint: 'http://localhost:8080/json-rpc/negative',
    errorsMap,
    responseSchema,
    body: {
      method: 'test_method',
      options: {
        foo: 'bar',
      },
    },
    locale: 'en',
  });

module.exports.JSONRPCRequestWithCustomResponseValidation = ({
  responseSchema,
  extraValidationCallback,
}) =>
  new JSONRPCRequest().makeRequest({
    endpoint: 'http://localhost:8080/json-rpc',
    errorsMap,
    responseSchema,
    body: {
      method: 'test_method',
      options: {
        foo: 'bar',
      },
    },
    extraValidationCallback,
  });

module.exports.JSONRPCNegativeErrorsRequestStraightError = responseSchema =>
  new JSONRPCRequest().makeRequest({
    endpoint: 'http://localhost:8080/json-rpc/negative',
    errorsMap,
    responseSchema,
    body: {
      method: 'test_method',
      options: {
        foo: 'bar',
      },
    },
    isErrorTextStraightToOutput: true,
  });

module.exports.JSONRPCNegativeErrorsRequest = responseSchema =>
  new JSONRPCRequest().makeRequest({
    endpoint: 'http://localhost:8080/json-rpc/negative/errors',
    errorsMap,
    responseSchema,
    body: {
      method: 'test_method',
      options: {
        foo: 'bar',
      },
    },
  });
