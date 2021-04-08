---
title: JSON-RPC запросы
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

### Важно отметить

В ответе, если сам запрос прошёл, то он будет возвращён в состоянии "успешно", даже если часть батчинг частей не будет корректна.
Считать ли что запрос завершился неудачно если какая либо из таких частей не прошла валидацию или все разом, или ни одной - вам решать это нужно будет самим. По многим наблюдениям, клиенту нужно гибкое поведение - для этого данный кейс никак не обработан и отдан в чистом виде клиенту библиотеки.