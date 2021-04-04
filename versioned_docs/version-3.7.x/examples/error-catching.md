---
title: Errors catching
---

```javascript
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

export const createWhateverRequest = (someData): Promise<IResponse> =>
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

const someFunction = async() => {
    const response = await createWhateverRequest(someData)

    // the error, errorText, additionalErrors, code fields in the 
    // response will be accordingly to your backend response
    // you dont need to provide additional try/catch blocks
}
```