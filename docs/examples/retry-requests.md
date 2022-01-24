---
title: Retry requests
---

import Link from '@docusaurus/Link';

You can use retry parameter to retry your request number of times if it failed.

Request on example below will make three attempts to request the data,
If it fails on 3rd try - the errror response will be provided

You need to know that the retry parameter is binded with the timeoutValue parameter (see <Link to='/docs/examples/request-timeout'>timeoutValue example</Link>)

|-------timeoutValue--------|

|--retry1--retry2--retry3--|

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    responseSchema: Joi.object({
      test_string_field: Joi.string().required(),
    }),
    retry: 3
  });
```


You can use extraVerifyRetry param - that is callback with IResponse response type as params. There you can create different contitionals to retry requests on different situations. For example, if you need to retry request if response code not 401:


```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";
import { ExtraVerifyRetryCallbackType } from '@mihanizm56/fetch-api/dist/types';

export const extraVerifyNotAuthRetry: ExtraVerifyRetryCallbackType = ({
  formattedResponseData: { code, error },
}) => {
  if (!error) {
    return false;
  }

  if (code === 401) {
    return false;
  }

  return true;
};


export const getWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    responseSchema: Joi.object({
      test_string_field: Joi.string().required(),
    }),
    retry: 3,
    extraVerifyRetry: extraVerifyNotAuthRetry,
  });