const { RestRequest } = require('../../dist');
const { langDict } = require('../constants');

module.exports.getRestRequest = responseSchema =>
  new RestRequest().getRequest({
    endpoint: 'http://localhost:8080/rest',
    langDict,
    responseSchema,
  });

module.exports.getRestRequestWithCustomResponseValidation = ({
  responseSchema,
  extraValidationCallback,
}) =>
  new RestRequest().getRequest({
    endpoint: 'http://localhost:8080/rest',
    langDict,
    responseSchema,
    extraValidationCallback,
  });

module.exports.postRestRequest = responseSchema =>
  new RestRequest().postRequest({
    endpoint: 'http://localhost:8080/rest',
    langDict,
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
    langDict,
    responseSchema,
    headers: {
      'content-type': 'application/json',
    },
  });

module.exports.patchRestRequest = responseSchema =>
  new RestRequest().patchRequest({
    endpoint: 'http://localhost:8080/rest',
    langDict,
    responseSchema,
    headers: {
      'content-type': 'application/json',
    },
  });

module.exports.deleteRestRequest = responseSchema =>
  new RestRequest().deleteRequest({
    endpoint: 'http://localhost:8080/rest',
    langDict,
    responseSchema,
    headers: {
      'content-type': 'application/json',
    },
  });

module.exports.getNegativeRestRequest = responseSchema =>
  new RestRequest().getRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    langDict,
    responseSchema,
  });

module.exports.getNegativeRestRequestEn = responseSchema =>
  new RestRequest().getRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    langDict,
    responseSchema,
  });

module.exports.getNegativeRestRequestStraightError = responseSchema =>
  new RestRequest().getRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    langDict,
    responseSchema,
    isErrorTextStraightToOutput: true,
  });

module.exports.postNegativeRestRequest = responseSchema =>
  new RestRequest().postRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    langDict,
    responseSchema,
  });

module.exports.putNegativeRestRequest = responseSchema =>
  new RestRequest().putRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    langDict,
    responseSchema,
  });

module.exports.patchNegativeRestRequest = responseSchema =>
  new RestRequest().patchRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    langDict,
    responseSchema,
  });

module.exports.deleteNegativeRestRequest = responseSchema =>
  new RestRequest().deleteRequest({
    endpoint: 'http://localhost:8080/rest/negative',
    langDict,
    responseSchema,
  });
