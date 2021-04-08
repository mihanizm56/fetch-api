---
title: Таймауты запросов
---

import Link from '@docusaurus/Link';

Могут быть использованы таймауты для ограничения времени ожидания запросов.
По умолчанию значение равно 60 секундам

Работает механизм таймаутов за счёт гонки между промисом запроса и промисом с таймером ошибки.

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    customTimeout: 30000, // 30 секунд
  });
```

Необходимо уточнить, что если вы используете параметр retry то параметр таймаута не продлевается на попытку.
Он один для всего ряда повторных запросов и основного.

|-------timeoutValue--------|

|--retry1--retry2--retry3--|

(пример <Link to='./retry-requests'>тут</Link>)
