---
title: Query params
---

import Link from '@docusaurus/Link';

By default nor window.fetch nor node-fetch can serialize query params.
But this library can do it for all types of requests!

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    queryParams: {
      id: "test_id_123",
    },
    responseSchema: Joi.object({
      test_string_field: Joi.string().required(),
    }),
  });
```