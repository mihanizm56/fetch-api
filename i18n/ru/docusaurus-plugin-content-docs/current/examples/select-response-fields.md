---
title: Выборка нужных полей из данных ответа
---

import Link from '@docusaurus/Link';

Когда объект данных ответа очень большой и вам не нужны все поля или это небезопасно для разработки,
вы можете использовать выборку данных - выбирайте только нужные поля из ответа.

Эта функциональность построена на основе <Link to='https://github.com/nemtsov/json-mask'>json-mask</Link> library

В качестве примера - у нас есть ответ с полями:

```javascript
{
    username:"Police officer"
    password:"Police officer123",
    info:{
        count:2,
        killers:["Sam", "John"]
    }
}
```

Но в нашем коде мы хотим получить только поле username и поле info, а внутри - только массив killers:

```javascript
{
  username: "Police officer";
  info: {
    killers: ["Sam", "John"];
  }
}
```

Это может быть возможно, потому что внутри модуля форматирования ответов будет вызываться: jsonMask(responseData.data, selectData)

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    selectData: "username,info(killers)",
  });
```

### Вы можете предоставить свою собственную функцию выборки (поле customSelectorData)

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    selectData: "username,info(killers)",
    customSelectorData: (
      data: YourDataType,
      selectData: string /*"username,info(killers) будет передано*/
    ) => {
      /*Вы должны вернуть выбранные данные из функции*/
    },
  });
```
