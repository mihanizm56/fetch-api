---
title: Get Pure REST request with BLOB response
sidebar_label: Blob request
---

```javascript
import Joi from "@hapi/joi";
import { PureRestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getPhotoRequest = (): Promise<IResponse> =>
  new PureRestRequest().getBlobRequest({
    endpoint: "http://localhost:3000",
    responseSchema: Joi.any()
  });
```