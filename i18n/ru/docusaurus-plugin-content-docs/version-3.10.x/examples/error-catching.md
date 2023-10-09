---
title: Обработка ошибок
---

```javascript
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

export const createWhateverRequest = (someData): Promise<IResponse> =>
  new RestRequest().postRequest({
    endpoint: "http://localhost:3000",
    body: someData
  });
);

const someFunction = async() => {
    const response = await createWhateverRequest(someData)

    // error, errorText, additionalErrors, code поля в
    // ответе будут в соответствии с ответом сервера
    // вам не нужно дополнительно производить обработку ошибок
    // поле data в случае ошибки будет представлено как null
}
```
