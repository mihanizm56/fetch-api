---
title: Get REST request with BLOB response
sidebar_label: Blob request
---

```javascript
import Joi from "joi";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getPhotoRequest = (): Promise<IResponse> =>
  new RestRequest().getBlobRequest({
    endpoint: "http://localhost:3000",
    responseSchema: Joi.any()
  });
```