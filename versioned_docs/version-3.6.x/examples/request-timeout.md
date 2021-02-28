---
title: Request Timeout
---

import Link from '@docusaurus/Link';

You can use request timeout. The default value is 60 seconds.

There is a race between request and default error response and if timeout is gone - the default error response wins and you will get is as the result.

You need to know that the customTimeout parameter is binded with retry parameter (see <Link to='/docs/examples/request-timeout'>timeoutValue example</Link>)

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
    customTimeout: 30000 // 30 seconds
  });
```