---
title: Изоморфные запросы
---

import Link from '@docusaurus/Link';

Все типы запросов по умолчанию доступны в окружении браузера и Node.js

Это достигнуто использованием window.fetch и <Link to='https://github.com/node-fetch/node-fetch'>node-fetch</Link>, обнаруживается Node.js окружение. Вы можете не устанавливать пакет node-fetch если ваша среда node поддерживает fetch

### Браузер

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
  });
```

### Node.js

```javascript
const { RestRequest, IResponse } = require("@mihanizm56/fetch-api");

module.exports.getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
  });
```

Используя сборщик или .mjs файлы в среде Node.js - можно использовать современный синтаксис импортов

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
  });
```
