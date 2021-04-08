---
title: JSON-RPC Запросы
sidebar_label: JSON-RPC батчинг запросов
---

### JSON-RPC Request с батчингом

```javascript
import { JSONRPCRequest, IResponse } from "@mihanizm56/fetch-api";
import Joi from "joi";

const responseSchemaObjectOne = Joi.object({
  foo: Joi.string().required(),
});

const responseSchemaObjectTwo = Joi.object({
  foo: Joi.string().required(),
});

export const createItemsRequest = (someData): Promise<IResponse> =>
  new JSONRPCRequest().makeRequest({
    endpoint:
      "http://localhost:8080/json-rpc/positive?batch=true&twoSchemas=true",
    body: [
      { method: "listCountries", params: {} },
      { method: "listCountries", params: {} },
    ],
    isBatchRequest: true,
    responseSchema: [responseSchemaObjectOne, responseSchemaObjectTwo],
  });
```