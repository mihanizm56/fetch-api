const { RestRequest } = require('../../dist');
const { translateFunction } = require('../constants');

module.exports.getRestRequest = responseSchema =>
  new RestRequest().getRequest({
    endpoint: 'http://localhost:8080/rest',
    responseSchema,
  });

module.exports.getRestRequestWithCustomResponseValidation = ({
  responseSchema,
  extraValidationCallback,
}) =>
  new RestRequest().getRequest({
    endpoint: 'http://localhost:8080/rest',
    translateFunction,
    responseSchema,
    extraValidationCallback,
  });

module.exports.postRestRequest = responseSchema =>
  new RestRequest().postRequest({
    endpoint: 'http://localhost:8080/rest',
    translateFunction,
    responseSchema,
    body: {
      value: 123,
    },
    headers: {
      'content-type': 'application/json',
    },
  });

module.exports.putRestRequest = responseSchema =>
  new RestRequest().putRequest({
    endpoint: 'http://localhost:8080/rest',
    translateFunction,
    responseSchema,
    headers: {
      'content-type': 'application/json',
    },
  });

module.exports.patchRestRequest = responseSchema =>
  new RestRequest().patchRequest({
    endpoint: 'http://localhost:8080/rest',
    translateFunction,
    responseSchema,
    headers: {
      'content-type': 'application/json',
    },
  });

module.exports.deleteRestRequest = responseSchema =>
  new RestRequest().deleteRequest({
    endpoint: 'http://localhost:8080/rest',
    translateFunction,
    responseSchema,
    headers: {
      'content-type': 'application/json',
    },
  });

module.exports.getNegativeRestRequest = responseSchema =>
  new RestRequest().getRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    translateFunction: key => `test translate key ${key}`,
    responseSchema,
  });

module.exports.getNegativeRestRequestEn = responseSchema =>
  new RestRequest().getRequest({
    endpoint: 'http://localhost:8080/rest/negative/en',
    translateFunction: key => `test translate en key ${key}`,
    responseSchema,
  });

module.exports.getNegativeRestRequestStraightError = responseSchema =>
  new RestRequest().getRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    translateFunction,
    responseSchema,
    isErrorTextStraightToOutput: true,
  });

module.exports.postNegativeRestRequest = responseSchema =>
  new RestRequest().postRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    translateFunction,
    responseSchema,
  });

module.exports.putNegativeRestRequest = responseSchema =>
  new RestRequest().putRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    translateFunction,
    responseSchema,
  });

module.exports.patchNegativeRestRequest = responseSchema =>
  new RestRequest().patchRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    translateFunction,
    responseSchema,
  });

module.exports.deleteNegativeRestRequest = responseSchema =>
  new RestRequest().deleteRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    translateFunction,
    responseSchema,
  });
