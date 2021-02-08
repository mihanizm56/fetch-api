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