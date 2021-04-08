---
title: Отслеживание прогресса ответа
---

Вы можете отслеживать прогресс ответа если вам нужно как то реагировать на это (рисовать прогресс бар, например)

Эта функциональность построена на дефолтной функциональности window.fetch и работает только для процесса скачивания, и не для процесса аплоада на сервер.

Пока доступно только в браузерном окружении.

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000"
    progressOptions: {
      onLoaded: (total: number) => {/*ваши действия*/};
      // total - полное количество байтов
      // onLoaded коллбек, который будет вызван после окончания загрузки
      onProgress: ({total: number, current: number}) => {
          /*ваши действия*/
      }
      // onProgress коллбек будет вызываться в процессе загрузки
      // total - полное количество байтов
      // current - количество загруженных байтов
    },
  });
```
