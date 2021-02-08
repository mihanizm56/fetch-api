---
title: Delete Pure REST request (response structure free)
sidebar_label: Delete
---

```javascript
import Joi from "joi";
import { PureRestRequest, IResponse } from "@mihanizm56/fetch-api";

export const deleteContractsRequest = (): Promise<IResponse> =>
  new PureRestRequest().deleteRequest({
    endpoint: "http://localhost:3000",
    responseSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      info: Joi.object({
        count: Joi.number().required(),
        killers: Joi.array().items(
          Joi.object({
            username: Joi.string().required(),
            count: Joi.number().required(),
          })
        ),
      }),
    }),
  });
```