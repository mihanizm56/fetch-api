---
title: Response progress
---

import Link from '@docusaurus/Link';


You are able to track the progress response if you need to paint the progress bar, for example.

This functionality is built on top of default window.fetch API and it works only for the download process and **NOT** for the upload process.

Not availiable in Node.js environment yet.

Be careful - this feature uses response.headers.get('Content-Length') method to get full file length.
So, from the backend you need to provide Content-Length header.
See <Link to='https://stackoverflow.com/questions/16870904/node-express-content-length'>this issue</Link> if you get zero total value and see "Transfer-Encoding: chunked" header in your response. 


```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    progressOptions: {
      onLoaded: (total: number) => {/*do smth with total*/};
      // total - number of bytes that were sent  
      // onLoaded callback will be called after 
      // the whole response will be done
      // WARNING - not availiable on nodejs environment
      onProgress: ({ total, current }:{total: number, current: number}) => {
        /*do smth with total and current*/
      }
      // onProgress callback will be triggered during the response progress when the "current" field will be updated
      // total - number of bytes that all response contains
      // current - number of bytes that were sent at the moment of time
    },
  });
```