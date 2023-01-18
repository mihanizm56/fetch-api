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
| minAllowedQuota        | `number`     | min request cache allowed quota in cache-storage |