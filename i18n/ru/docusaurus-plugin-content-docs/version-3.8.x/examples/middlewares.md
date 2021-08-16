---
title: Middlewares
---

Вы можете добавить/удалить миддлвары для запросов, чтобы сделать какую то промежуточную работу 

#### Добавление миддлвары

```javascript
import Joi from "joi";
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

new MiddlewaresController().setMiddleware({
  name: 'test', // задаем middleware id (должен быть уникальным)
  middleware: async ({ retryRequest }) => {
    // теперь мы можем обработать наш запрос, например добавив дополнительный запрос (чайстый случай для аутентификации/авторизации)
    const result = await new PureRestRequest().getRequest({
      endpoint: '/test-2',
      // Для того чтобы отключить у данного запроса перехват миддлварами
      // нужно утсановить middlewaresAreDisabled параметр в true
      middlewaresAreDisabled: true, 
    });

    // мы также можем произвести ретрай изначального запроса вручную
    const data = await retryRequest({ middlewaresAreDisabled: true });

    // и передаем значение как результат запроса
    return data;
  },
});


const someFunction = async () => {
    // тут мы получим значение ПОСЛЕ того как все миддлвары отработают
    const result = await new PureRestRequest().getRequest({
      endpoint: '/test-1',
    });
}
```

#### Удаление миддлвары

```javascript
import Joi from "joi";
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

// передаем middleware id
new MiddlewaresController().deleteMiddleware('test');


const someFunction = async () => {
    const result = await new PureRestRequest().getRequest({
      endpoint: '/test-1',
    });
}
```