---
title: Единый тип интерфейса ответа
---

import Link from '@docusaurus/Link';

Все типы запросов предоставляют единый интерфейс получения данных

(errorText поле может быть переведено <Link to='./translation'>ссылка на пример</Link>)

```javascript
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

export const createWhateverRequest = (someData) =>
  new RestRequest().postRequest({
    endpoint: "http://localhost:3000",
    body: someData
  });
);

const someFunction = async () => {
    const response = await createWhateverRequest(someData);

    const {data, error, errorText, additionalErrors, code} = response

    // Ответ будет представлять из себя объект с полями:
    // data - данные ответа (объект, если запрос прошёл успешно, если не успешно - null)
    // error - флаг состояния ошибки (всегда имеет тип boolean)
    // errorText - текст ошибки (пустая строка если запрос успешный)
    // additionalErrors - любые дополнительные данные с бекенда (для PureRestRequest это весь объект с данными об ошибке, для JSONRPCRequest это поле "errors.data" исходного ответа)
    // code - код состояния ошибки, всегда строка
    // Если код состояния ответа от сервера больше чем 500 - то данные ответа не будут парситься, а будет просто отдан на клиент код ошибки 500 и дефолтный объект данных ошибки
    //  Если ваш клиент находится в оффлайн - вы получите код 600 и можете обработать его как вам нужно (может быть полезно для оффлайн-режимов работы приложения)
}
```
