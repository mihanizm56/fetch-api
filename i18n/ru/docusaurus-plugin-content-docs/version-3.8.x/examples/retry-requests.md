---
title: Повторные отправки запросов
---

import Link from '@docusaurus/Link';

Вы можете использовать параметр retry, чтобы повторить ваш запрос несколько раз, если он не удался.

Запрос в приведенном ниже примере сделает три попытки запросить данные,
Если не удалось с 3-й попытки - будет выдан ответ об ошибке.


```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    retry: 3,
  });
```


Вы должны знать, что параметр retry привязан к параметру timeoutValue. (описание <Link to='./request-timeout'>тут</Link>)

|-------timeoutValue--------|

|--retry1--retry2--retry3--|


Вы можете использовать параметр extraVerifyRetry - это коллбек с типом ответа IResponse в качестве параметра. Там вы можете создавать разные условия для повторных запросов в разных ситуациях. Например, если вам нужно повторить запрос, если код ответа не 401:


```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";
import { ExtraVerifyRetryCallbackType } from '@mihanizm56/fetch-api/dist/types';

export const extraVerifyNotAuthRetry: ExtraVerifyRetryCallbackType = ({
  formattedResponseData: { code, error },
}) => {
  if (!error) {
    return false;
  }

  if (code === 401) {
    return false;
  }

  return true;
};


export const getWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    responseSchema: Joi.object({
      test_string_field: Joi.string().required(),
    }),
    retry: 3,
    extraVerifyRetry: extraVerifyNotAuthRetry,
  });