---
title: JSON-RPC Request
sidebar_label: JSON-RPC Request with batch
---

### JSON-RPC Request with batching

```javascript
import { JSONRPCRequest, IResponse } from "@mihanizm56/fetch-api";
import Joi from 'joi'

const responseSchemaObjectOne = Joi.object({
  foo: Joi.string().required(),
});

const responseSchemaObjectTwo = Joi.object({
  foo: Joi.string().required(),
});

export const createItemsRequest = (someData): Promise<IResponse> =>
  new JSONRPCRequest().makeRequest({
    endpoint:
      'http://localhost:8080/json-rpc/positive?batch=true&twoSchemas=true',
    body: [
      { method: 'listCountries', params: {} },
      { method: 'listCountries', params: {} },
    ],
    isBatchRequest: true,
    responseSchema: [responseSchemaObjectOne, responseSchemaObjectTwo],
  });
```
