---
title: Браузерное кэширование запросов
---

import Link from '@docusaurus/Link';

ДЖля каждого запроса можно отдельно описать кэширование. Эта функциональность использует <Link to='https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage'>The Cache Storage Api</Link>

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
| disabledCache            | `boolean`    | disabled cache           |
| strategy            | `NetworkFirst, StaleWhileRevalidate, CacheFirst`    | strategy for the request       |
| requestCacheKey        | `string`     | main request cache key |
| storageCacheName             | `string` | main request storage key                             |
| expires | `number`        | time in ms for the request cache to be expired         |
| expiresToDate | `number`        | time in ms for the request cache to be expired to the selected date only         |
| timeout | `number`        | timeout for request - if it is out - the cached previos result will be given (only NetworkFirst strategy has this feature)         |
| onUpdateCache | `function`        | callback is called if cache was updated         |
| onRequestError | `function`        | callback is called if the request has an error      |
| debug             | `boolean`     | flag for logging in the browser developer tools  |
