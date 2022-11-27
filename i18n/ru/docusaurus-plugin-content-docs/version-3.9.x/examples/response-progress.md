---
title: Отслеживание прогресса ответа
---

import Link from '@docusaurus/Link';

Вы можете отслеживать прогресс ответа если вам нужно как то реагировать на это (рисовать прогресс бар, например)

Эта функциональность построена на дефолтной функциональности window.fetch и работает только для процесса скачивания, и не для процесса аплоада на сервер.

Пока доступно только в браузерном окружении.

Будьте аккуратны, эта функциональность построена поверх response.headers.get('Content-Length') метода для получения полного количества байтов в файле.
Таким образом, от бекенда вам нужно предоставить заголовок Content-Length.
Если получаете 0 в total и заметили заголовок "Transfer-Encoding: chunked", то посмотрите <Link to='https://stackoverflow.com/questions/16870904/node-express-content-length'>этот вопрос</Link>

```javascript
import { PureRestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new PureRestRequest().getRequest({
    endpoint: "http://localhost:3000"
    progressOptions: {
      onLoaded: (total: number) => {/*ваши действия с total*/};
      // total - полное количество байтов
      // onLoaded коллбек, который будет вызван после окончания загрузки
      onProgress: ({total: number, current: number}) => {
          /*ваши действия с total и current*/
      }
      // onProgress коллбек будет вызываться в процессе загрузки
      // total - полное количество байтов
      // current - количество загруженных байтов
    },
  });
```


