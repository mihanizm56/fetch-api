# @mihanizm56/fetch-api

## Sollution for http/1.1 requests based on window.fetch api

### Benefits:

- Provides validation for responses (based on @hapi/joi Schema validation)
- Provides query-params serialize
- Provides cancel-request if the timeout is higher than 60 seconds
- Provides error catching (you dont need to use try/catch)
- Provides the ability to match the exact error from `errorsMap`
- Provides different kinds of the response formats to parse
- Returns ALWAYS the hard prepared response structure

#### RestRequest input options:

- endpoint(string): the request url
- responseSchema: the response Schema that parsed by @hapi/joi <br/>(you must use the @hapi/joi in your project and insert the response Schema into this field)
- body(JSON | FormData): the request body (you have to JSON or FormData it by youself)
- mode('cors' | 'no-cors'): the cors type
- parseType('json' | 'blob'): the type to parse the response (json by default)
- queryParams(object): the object with the query parameters (they will be serialized automatically)
- headers(object): the object with the headers
- errorsMap(object): the object with the errors keys and translated values (TIMEOUT_ERROR and REQUEST_DEFAULT_ERROR fields are required, others must be provided according to the backend errors)

#### RestRequest output options:

- error (boolean) - the flag of the response status
- errorText (string) - the main error message from the backend
- data (object) - the main data from the backend
- additionalErrors (object) - the additional multiple errors from the backend

## Examples of usage

#### installation

```javascript
npm install @mihanizm56/fetch-api
```

#### get request

```javascript
import Joi from "@hapi/joi";
import { RestRequest, IBaseResponse } from "@mihanizm56/fetch-api";

export const getContractsRequest = (): Promise<IBaseResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    errorsMap: {
      TIMEOUT_ERROR: "Превышено ожидание запроса",
      REQUEST_DEFAULT_ERROR: "Системная ошибка",
      [FORBIDDEN]: "Данное действие недоступно"
    },
    responseSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      info: Joi.object({
        count: Joi.number().required(),
        killers: Joi.array().items(
          Joi.object({
            username: Joi.string().required(),
            count: Joi.number().required()
          })
        )
      })
    })
  });
```

#### post(put/patch/delete have the same format) request

```javascript
import { RestRequest, IBaseResponse } from '@mihanizm56/fetch-api';

export const createReviseRequest = (someData): Promise<IBaseResponse> =>
  new RestRequest().postRequest({
    endpoint: 'http://localhost:3000',
    errorsMap: {
        TIMEOUT_ERROR: 'Превышено ожидание запроса',
        REQUEST_DEFAULT_ERROR: 'Системная ошибка',
        [FORBIDDEN]: 'Данное действие недоступно',
    },
    body: JSON.stringify(someData),
    mode: 'cors',
    parseType:'blob',
    queryParams:{
        id:'test_id_123'
    },
    headers:{
          Content-Type:'application/json'
    },
    responseSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    })
  })
```

#### The usage of the request api

```javascript
const { error, errorText, data, additionalErrors } = await createReviseRequest(
  someData
);
```
