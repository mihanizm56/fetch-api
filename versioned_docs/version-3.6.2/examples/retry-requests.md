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