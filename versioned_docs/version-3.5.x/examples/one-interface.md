---
title: One interface for all types of requests
---

import Link from '@docusaurus/Link';

All request types provide the same interface to get data from them

(errorText field can be translated inside the Request function, see <Link to='/docs/examples/translation'>example</Link>)

```javascript
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

export const createWhateverRequest = (someData) =>
  new RestRequest().postRequest({
    endpoint: "http://localhost:3000",
    body: someData,
    abortRequestId: '1',
    responseSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    }),
  });
);

const someFunction = async () => {
    const response = await createWhateverRequest(someData)

    // The response will be an object with fields:
    // data - reponse data
    // error - boolean flag to check if the response not success
    // errorText - text of an error
    // additionalErrors - any type of additional data from the backend (for PureRestRequest it is an object with all responded error data, for JSONRPCRequest it is field "errors.data" in the response)
    // code - response code number 
    // if the browser gets code 501 and more then you will get the error response with 500 code and browser will not try to parse and validate responded data
    // if you are offline - you will get 600 and you are able to do smth with that code for you offline-mode
}
```