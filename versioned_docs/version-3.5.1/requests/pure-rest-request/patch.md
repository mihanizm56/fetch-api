---
title: Patch Pure REST request (response structure free)
sidebar_label: Patch
---

```javascript
import Joi from "joi";
import { PureRestRequest, IResponse } from "@mihanizm56/fetch-api";

export const patchContractsRequest = (): Promise<IResponse> =>
  new PureRestRequest().patchRequest({
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