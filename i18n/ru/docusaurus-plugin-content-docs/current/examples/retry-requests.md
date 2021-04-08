---
title: Повторные отправки запросов
---

import Link from '@docusaurus/Link';

Вы можете использовать параметр retry, чтобы повторить ваш запрос несколько раз, если он не удался.

Запрос в приведенном ниже примере сделает три попытки запросить данные,
Если не удалось с 3-й попытки - будет выдан ответ об ошибке.

Вы должны знать, что параметр retry привязан к параметру timeoutValue. (описание <Link to='/docs/examples/request-timeout'>тут</Link>)

|-------timeoutValue--------|

|--retry1--retry2--retry3--|

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    retry: 3,
  });
```
