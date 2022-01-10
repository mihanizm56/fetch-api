---
title: Files downloading
---

import Link from '@docusaurus/Link';

You can use this library to fetch files. To do that, you should set parseType(json, blob, text) or pureJsonFileResponse parameter when fetching json file

#### pureJsonFileResponse 
  - use with PureRestRequest (getRequest)
  - removes automatic Content-type header (you can set this manually)
  - positive codes are 200,304,404
  - disables schema validation

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