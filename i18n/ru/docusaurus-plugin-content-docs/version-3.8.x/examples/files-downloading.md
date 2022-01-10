---
title: Загрузка файлов
---

import Link from '@docusaurus/Link';

Вы можете использовать запросы для скачивания файлов с каких либо ресурсов кроме текущего домена приложения.

Но вы должны явно указывать это в параметре parseType (json, blob, text),
и если файл является json - то вы можете использовать как parseType: "json", 
так и специальный параметр pureJsonFileResponse.


#### pureJsonFileResponse 
  - используется в связке с PureRestRequest (getRequest)
  - отключает заголовок Content-type
  - разрешает только 200,304,404 коды ответа
  - отключает валидации по схемам

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

// json
export const getWhateverRequest = (someData): Promise<IResponse> =>
  new PureRestRequest().getRequest({
    endpoint: "http://localhost:3000",
    pureJsonFileResponse:true,
  });


// blob
export const getWhateverRequest = (someData): Promise<IResponse> =>
  new PureRestRequest().getRequest({
    endpoint: "http://localhost:3000",
    parseType:"blob"
  });

// text
export const getWhateverRequest = (someData): Promise<IResponse> =>
  new PureRestRequest().getRequest({
    endpoint: "http://localhost:3000",
    parseType:"text"
  });
```