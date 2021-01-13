---
title: Get Pure REST request with TEXT response
sidebar_label: Text request
---

```javascript
import Joi from "joi";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getPhotoRequest = (): Promise<IResponse> =>
  new RestRequest().getTextRequest({
    endpoint: "http://localhost:3000",
    responseSchema: Joi.any()
  });
```