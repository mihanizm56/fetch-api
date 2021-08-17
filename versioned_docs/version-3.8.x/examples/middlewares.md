---
title: Middlewares
---

You can add some middlewares to do some job with the response and ship you result as the final result for the request.

#### Add the middleware

```javascript
import Joi from "joi";
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

new MiddlewaresController().setMiddleware({
  name: 'test', // middleware id
  middleware: async ({ retryRequest }) => {
    // we can add some additional requests to get some data (for example, retry some auth)
    const result = await new PureRestRequest().getRequest({
      endpoint: '/test-2',
      // If you don't want to get your "inside" request to be catched by middleware
      // then set the middlewaresAreDisabled parameter to true
      middlewaresAreDisabled: true, 
    });

    // then we can retry the initial request
    const data = await retryRequest({ middlewaresAreDisabled: true });

    // and ship the final result
    return data;
  },
});


const someFunction = async () => {
    // here we will get the result AFTER ALL middlewares finish to work
    const result = await new PureRestRequest().getRequest({
      endpoint: '/test-1',
    });
}
```

#### Delete the middleware

```javascript
import Joi from "joi";
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

// here we insert the middleware id
new MiddlewaresController().deleteMiddleware('test');


const someFunction = async () => {
    const result = await new PureRestRequest().getRequest({
      endpoint: '/test-1',
    });
}
```