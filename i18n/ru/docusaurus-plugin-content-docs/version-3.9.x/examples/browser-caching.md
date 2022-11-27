---
title: Браузерное кэширование запросов
---

import Link from '@docusaurus/Link';

Для каждого запроса можно отдельно описать кэширование. Эта функциональность использует <Link to='https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage'>The Cache Storage Api</Link>

## Включение кэширования

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    // здесь опредеяем параметры кэширования
    browserCacheParams: {
      strategy: 'StaleWhileRevalidate',
      requestCacheKey: `some request cache key`,
      storageCacheName: `some storage name`,
      expires: 1000 * 60 * 60 * 24 * 365, // 1 year,
      debug: true,
    },
  });
```

## Стратегии кэширование

Вы можете ознакомиться с принципами данных стратегий <Link to='https://developer.chrome.com/docs/workbox/reference/workbox-strategies'>тут</Link> но вы должны понимать что вместо технологии Service worker в данной схеме участвует текущая библиотека

### <Link to='https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-first-falling-back-to-network'>CacheFirst</Link>

- Если найден не просроченный кэшированный результат - вернуть его
- Иначе сделать запрос и сохранить результат в кэш для дальнейшего извлечения 

### <Link to='https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale-while-revalidate'>StaleWhileRevalidate</Link>

- Если найден не просроченный кэшированный результат - вернуть его
- И всегда сразу после отдачи кэшированного результата сделать запрос для обновления кэша

### <Link to='https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-first-falling-back-to-cache'>NetworkFirst</Link>

- Сделать запрос и вернуть ответ если нет ошибки запроса
- Если есть ошибка и не просроченный кэшированный результат то вернуть его 

## Описание параметров 

| Name             | Type         | Comments                                   |
| ---------------- | ------------ | ------------------------------------------ |
| disabledCache            | `boolean`    | флаг выключения кэша           |
| strategy            | `NetworkFirst, StaleWhileRevalidate, CacheFirst`    | стратегия кэширования запроса      |
| requestCacheKey        | `string`     | ключ кэширования запроса |
| storageCacheName             | `string` | имя ячейки хранилища                             |
| expires | `number`     | время кэширования в ms                   |
| expiresToDate | `number`     | время кэширования до определенной даты в ms                   |
| timeout | `number`        | таймаут запроса (только NetworkFirst в стратегии) - если истекает раньше ответа сервера - то возвращается закэшированное ранее значение         |
| onUpdateCache | `function`        | коллбек, вызывающийся во время обновления кэша         |
| onRequestError | `function`        | коллбек, вызывающийся во время ошибки ответа сервера      |
| debug             | `boolean`     | флаг для включения логгирования в консоль  |



#### Пример использования с обычным нативным fetch запросом

```javascript
import { getBrowserCachedRequest } from "@mihanizm56/fetch-api";

const someRequest = async (params) => {
    try {
        const result = await fetch(/* your params */).then(data => data.json());

        return { result };
    } catch (error) {
        // поле error является обязательным для определения был ли успешный запрос
        return { error: error.message };
    }
}

export const getSomeCachedRequest = (
  someParams,
) => {
  return getBrowserCachedRequest({
    request: () => someRequest(someParams),
    /* browserCacheParams параметры */
    strategy: 'StaleWhileRevalidate',
    requestCacheKey: `some request cache key`,
    storageCacheName: `some storage name`,
    expires: 1000 * 60 * 60 * 24 * 365, // 1 year,
    debug: true,
  })
};

```