---
title: Cancelling requests
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

// at the moment you want cancel the request
// you just dispatch an event with that name (ABORT_REQUEST_EVENT_NAME) and id (abortRequestId) of the request
document.dispatchEvent(
  new CustomEvent(ABORT_REQUEST_EVENT_NAME, {
    detail: { id: '1' },
  }),
);
```