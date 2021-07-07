---
title: Работа с i18n
---

Вы можете перевести ваше поле errorText ответа - если передадите функцию translateFunction в параметры запроса.
Важно отметить, вы можете для перевода использовать **любой** внешний модуль!
Функция translateFunction в случае ошибки в запросе - будет вызвана с сигнатурой в примере ниже.

Например - вам пришло в ответе значение errorText с ключом 'foo'. Вы предоставляете translateFunction с i18next внутри и получаете на выходе переведенное значение в errorText, которое подставит сама библиотека:

```javascript
import i18next from "i18next";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    translateFunction: (errorText: string, errorTextParams: any) => {
      return i18next.t(`${errorText}`, errorTextParams);

      // errorText - исходное значение, пришеднее с бекенда
      // или обработанное библиотекой (в случае с JSONRPCRequest или PureRestRequest)
      // errorTextParams - подстановка additionalErrors
      // и дальше мы можем перевести значение errorText
      // например если перевод для ключа errorText будет '{{counter}} sheep'
      // и в errorTextParams придёт значение 4 - то на выходе из функции получим '4 sheep'
    },
  });
```
