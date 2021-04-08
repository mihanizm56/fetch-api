---
title: Отмена запросов
---

Работает только в браузерном окружении!!!

```javascript
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

export const createWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().postRequest({
    endpoint: "http://localhost:3000",
    body: someData,
    abortRequestId: '1',
  });
);

// в тот момент, когда вы хотите отменить запрос
// вам нужно вызывать браузерное событие с именем ABORT_REQUEST_EVENT_NAME
// и с id который был передан в секцию abortRequestId запроса
document.dispatchEvent(
  new CustomEvent(ABORT_REQUEST_EVENT_NAME, {
    detail: { id: '1' },
  }),
);
```
