---
title: JSON-RPC Request
sidebar_label: JSON-RPC Request
---

### JSON-RPC Request

```javascript
import { JSONRPCRequest, IResponse } from "@mihanizm56/fetch-api";

export const createItemsRequest = (someData): Promise<IResponse> =>
  new JSONRPCRequest().makeRequest({
    endpoint: "http://localhost:3000",
    body: {
      method: 'some method',
      params: 123
    }
    queryParams: {
      stringId: "123"
      someArray: ['1', 1, '2', 2],
      numberId: 100
    },
    responseSchema: Joi.object({
      items: Joi.array().items(
        Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          name: Joi.string()
        })
      )
    }),
  });
```
