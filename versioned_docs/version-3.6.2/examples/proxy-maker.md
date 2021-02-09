---
title: Additional request callbacks
---

```javascript
import { FetchProxyMaker } from "@mihanizm56/fetch-api";

new FetchProxyMaker().setResponseTrackCallback(({
  requestParams, // all request parameters
  response, //  pure response protected object
  pureResponseData, // response body without formatting
  requestError: boolean, // is request crashed
  formattedResponseData // formatted response data in IResponse interface
}) => ({
 // do some metrics or logging here
}));
```

#### Set callback for metrics for all requests

```javascript
import { FetchProxyMaker } from "@mihanizm56/fetch-api";

new FetchProxyMaker().setPersistentOptions(() => ({
  headers: {
    foo: 'bar',
  },
}));
```

#### Set callback for metrics for one request

```javascript
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

export const createWhateverRequest = (someData) =>
  new RestRequest().postRequest({
    endpoint: 'http://127.0.0.1:8080/rest/positive',
    traceRequestCallback: setResponseTrackCallbackOptions => {
      resultOptions = { ...setResponseTrackCallbackOptions };
    },
    body: someData,
  });
);
```
