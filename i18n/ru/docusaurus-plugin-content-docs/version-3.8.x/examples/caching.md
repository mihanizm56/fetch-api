---
title: Кэширование запросов
---

Вы можете добавить кэши для ускорения работы с запросами. Как для каждого запроса по-отдельности, так и для все запросов разом.

#### Добавление кэша к каждому запросу по отдельности

```javascript
import LRU from 'lru-cache';
import { ICache, IResponse, PureRestRequest } from '@mihanizm56/fetch-api';

const i18nCacheLRU = new LRU<string, IResponse>({
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});

// вы должны создать класс getter/setter
// и вставить всю логику кэширования внутрь
export class RequestCache implements ICache {
  async getFromCache({ endpoint }) {
    return i18nCacheLRU.get(endpoint);
  }

  setToCache({ endpoint, response }) {
    i18nCacheLRU.set(endpoint, response);
  }
}


const someFunction = async () => {
    // и потом передать этот класс getter/setter как параметр в запрос
    const result = await new PureRestRequest().getRequest({
      endpoint: '/test-1',
      requestCache: new RequestCache(),
    });
}
```

#### Добавление кэша к каждому запросу разом

##### Только один такой класс доступен для установки в приложении!

```javascript
import Joi from "joi";
import { CachesController } from "@mihanizm56/fetch-api";

// вы должны создать класс getter/setter
// и вставить всю логику  ВСЕХ ЗАПРОСОВ внутрь
export class RequestCache implements ICache {
  async getFromCache({ endpoint }) {
    return i18nCacheLRU.get(endpoint);
  }

  setToCache({ endpoint, response }) {
    i18nCacheLRU.set(endpoint, response);
  }
}

// установить кэш
new CachesController().setCache(RequestCache);

// при необходимости удалить кэш
new CachesController().deleteCache();
```

