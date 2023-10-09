---
title: Request caching
---

You can add some caches per each request individually or per all in one cache class to ship the prev resuld as quickly as possible.

#### Add the cache to request

```javascript
import LRU from 'lru-cache';
import { ICache, IResponse } from '@mihanizm56/fetch-api';

const i18nCacheLRU = new LRU<string, IResponse>({
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});

// you should create simple cache getter/setter
// and implement yout cache logic of the request
export class RequestCache implements ICache {
  async getFromCache({ endpoint }) {
    return i18nCacheLRU.get(endpoint);
  }

  setToCache({ endpoint, response }) {
    i18nCacheLRU.set(endpoint, response);
  }
}


const someFunction = async () => {
    // here you should set your RequestCache class as a param
    const result = await new PureRestRequest().getRequest({
      endpoint: '/test-1',
      requestCache: new RequestCache(),
    });
}
```

#### Add the cache for each request 

##### Only one cache class is availiable and you should incapsulate into it all requests logic

```javascript
import Joi from "joi";
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

// you should create simple cache getter/setter
// and implement yout cache logic of the ALL requests
export class RequestCache implements ICache {
  async getFromCache({ endpoint }) {
    return i18nCacheLRU.get(endpoint);
  }

  setToCache({ endpoint, response }) {
    i18nCacheLRU.set(endpoint, response);
  }
}

// set cache
new CachesController().setCache(RequestCache);

// if you need it - delete cache for all requests
new CachesController().deleteCache();
```

