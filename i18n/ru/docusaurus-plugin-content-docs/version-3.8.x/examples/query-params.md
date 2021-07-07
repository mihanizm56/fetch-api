---
title: Query параметры
---

import Link from '@docusaurus/Link';

По умолчанию, window.fetch не умеет в сериализацию query параметров.
Но данная библиотека имеет такую функциональность для всех типов запросов!

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
