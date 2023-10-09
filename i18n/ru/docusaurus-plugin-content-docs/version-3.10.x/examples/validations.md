---
title: Валидации ответов сервера
---

import Link from '@docusaurus/Link';

Вы можете использовать валидации ответов сервера на основе трех типов проверок.

- Формат протокола (JSONRPCRequest)
- Формат требований о возращаемом формате данных (RestRequest)
- Клиентская валидация по - <Link to='https://joi.dev/api/'>joi</Link> схемам или ваш кастомный коллбек для валидации ответа

#### Все проверки работают совместно и это делает ваше приложение чрезвычайно устойчивым к неправильным ответам и данным!

#### Если одна из этих проверок не удалась - весь ответ не будет выполнен со структурой ошибок по умолчанию.

### JSON-RPC

Ваш ответ должен содержать эти поля в формате JSON <Link to='https://www.jsonrpc.org/specification'>по стандарту</Link>
Поля result и error являются взаимоисключающими.

```javascript
{
  jsonrpc, result, error, id;
}
```

### RestRequest

```javascript
{
  data, error, errorText, additionalErrors;
}
```

Ответ будет представлять из себя объект с полями:

- data - данные ответа (объект, если запрос прошёл успешно, если не успешно - null)
- error - флаг состояния ошибки (всегда имеет тип boolean)
- errorText - текст ошибки (пустая строка если запрос успешный)
- additionalErrors - любые дополнительные данные с бекенда (для PureRestRequest это весь объект с данными об ошибке, для JSONRPCRequest это поле "errors.data" исходного ответа)
- code - код состояния ошибки, всегда строка

Если код состояния ответа от сервера больше чем 500 - то данные ответа не будут парситься, а будет просто отдан на клиент код ошибки 500 и дефолтный объект данных ошибки
Если ваш клиент находится в оффлайн - вы получите код 600 и можете обработать его как вам нужно (может быть полезно для оффлайн-режимов работы приложения)

### RestRequest - не накладывает никаких ограничений на возращаемый формат данных

### Валидации по схеме

```javascript
import Joi from "joi";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

const responseSchema = Joi.object({
  username: Joi.string().required(),
});

export const getWhateverRequest = (): Promise<IResponse> =>
  new PureRestRequest().getRequest({
    endpoint: "http://localhost:3000",
    responseSchema,
  });
```

### Кастомная валидация

```javascript
import Joi from "joi";
import i18next from "i18next";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

const schema = Joi.object({
    username: Joi.string().required(),
})

export const getWhateverRequest = (): Promise<IResponse> =>
  new PureRestRequest().getRequest({
    endpoint: "http://localhost:3000",
    extraValidationCallback: (data: YourDataType) => {
      // здесь вы можете проверить ответ и вернуть boolean
      // проверка по схеме joi будет отключена
  });
```
