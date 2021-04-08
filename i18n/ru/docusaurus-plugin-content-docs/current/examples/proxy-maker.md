---
title: Перехват запросов и их трекинг
---

```javascript
import { FetchProxyMaker } from "@mihanizm56/fetch-api";

new FetchProxyMaker().setResponseTrackCallback(
  ({
    requestParams, // все параметры запроса
    response, //  полный объект ответа до обработки
    pureResponseData, // полный объект тела ответа до обработки
    requestError: boolean, // флаг состояния об ошибке самого запроса
    formattedResponseData, // форматтированный объект ошибки (data, error, errorText, additionalErrors, code)
  }) => ({
    // ваши действия здесь
  })
);
```

#### Уставновка коллбека для всех запросов

```javascript
import { FetchProxyMaker } from "@mihanizm56/fetch-api";

new FetchProxyMaker().setPersistentOptions(() => ({
  headers: {
    foo: "bar",
  },
}));
```

#### Уставновка коллбека для одного запроса

```javascript
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

export const createWhateverRequest = (someData) =>
  new RestRequest().postRequest({
    endpoint: 'http://127.0.0.1:8080/rest/positive',
    traceRequestCallback: setResponseTrackCallbackOptions => {
      resultOptions = { ...setResponseTrackCallbackOptions };
    },
    body: someData,
  });
);
```
