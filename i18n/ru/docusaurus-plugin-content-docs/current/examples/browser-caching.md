---
title: Browser caching
---

import Link from '@docusaurus/Link';

You can define cache strategy for each request individually. This feature is using <Link to='https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage'>The Cache Storage Api</Link>

## Define cache params

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    // here we define params for browser caching
    browserCacheParams: {
      strategy: 'StaleWhileRevalidate',
      requestCacheKey: `some request cache key`,
      storageCacheName: `some storage name`,
      expires: 1000 * 60 * 60 * 24 * 365, // 1 year,
      debug: true,
    },
  });
```

## Cache strategies 


You can read about strategies <Link to='https://developer.chrome.com/docs/workbox/reference/workbox-strategies'>here</Link> but you should understand that we have a fetch-api library instead of a service worker in the scheme

### <Link to='https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-first-falling-back-to-network'>CacheFirst</Link>

- If found not expired value in cache - then return it
- Make request and save to cache if expired or not exists

### <Link to='https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale-while-revalidate'>StaleWhileRevalidate</Link>

- If found not expired value in cache  - then return it
- And after return from cache - make request and update cache

### <Link to='https://developer.chrome.com/docs/workbox/caching-strategies-overview/#network-first-falling-back-to-cache'>NetworkFirst</Link>

- Always make the request
- If error - try to get from cache if not expires 
- If success - update the cache
- If timeout provided - after timeout tries to take cached value

## Parameters 

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
