# @mihanizm56/fetch-api

## Solution for the isomorphic fetch

### Benefits:

- Provides validation for responses (based on @hapi/joi Schema validation and may use your own validation function)
- Provides the ability to make rest-api and json-rpc protocol requests in One interface
- Provides query-params serialize (booleans,strings,numbers,arrays of numbers or strings and variable serialize options for different backend services)
https://www.npmjs.com/package/query-string is used
- Provides cancel-request if the timeout is higher than timeout value (60 seconds by default) 
- Provides error catching (you dont need to use try/catch)
- Provides the ability to match the exact error translation
- Provides different kinds of the response formats to parse
- Returns ALWAYS the hard prepared response structure (data, error, errorText, additionalErrors)
- Works in modern browsers and ie11
- Provides two main classes for REST API - RestRequest and PureRestReques. <br/> The difference is in
  hard-structured responce format or not (both interfaces are the same)
- Provides the ability to cancel the request by throwing the special event (ABORT_REQUEST_EVENT_NAME)
- Provides the ability to handle the response progress

#### Request input options:

- endpoint(string): the request url
- responseSchema: the response Schema that parsed by @hapi/joi <br/>(you must use the @hapi/joi in your project and insert the response Schema into this field)
- body(JSON | FormData): the request body
- mode('cors' | 'no-cors'): the cors type
- queryParams(object): the object with the query parameters (they will be serialized automatically)
- headers(object): the object with the headers
- translateFunction(function): function that will be called with error text key and params (key, params)
- isErrorTextStraightToOutput(boolean): flag not to prepare error text value - it <br/>
  goes straight from backend ("errorText" if REST and "message" if JSON-RPC)
- extraValidationCallback(function): callback that can be used for custom response <br/>
  data validation or if you don't want to use @hapi/joi
- customTimeout(number) - milliseconds for cancel the request on timeout

#### Request output options:

- error (boolean) - the flag of the response status
- errorText (string) - the text error message from the backend
- data (object) - the main data from the backend
- additionalErrors (object) - the additional error data from the backend
- code (number) - status-code from backend

## Features and recommendations

- body will be serialized in JSON if body data NOT FormData
- try to use .unknown() method with objects in Joi Schemas because your backend may be extended
  and without this method the responce data may be not valid

## !!! Attention !!!
### If you need to support ie11 - please add the following polyfills

```javascript
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import 'whatwg-fetch';
```

## Examples of usage

### REST API

#### installation

```javascript
npm install @mihanizm56/fetch-api
```

#### get request

```javascript
import Joi from "@hapi/joi";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getContractsRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    translateFunction = (key, options) => `${key}:${JSON.stringify(options)}`,
    isErrorTextStraightToOutput: true,
    responseSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      info: Joi.object({
        count: Joi.number().required(),
        killers: Joi.array().items(
          Joi.object({
            username: Joi.string().required(),
            count: Joi.number().required(),
          }).unknown()
        ),
      }).unknown(),
    }).unknown(),
  });
```

#### get request with PROGRESS callbacks

```javascript
import Joi from "@hapi/joi";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getContractsRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    translateFunction = (key, options) => `${key}:${JSON.stringify(options)}`,
    isErrorTextStraightToOutput: true,
    responseSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      info: Joi.object({
        count: Joi.number().required(),
        killers: Joi.array().items(
          Joi.object({
            username: Joi.string().required(),
            count: Joi.number().required(),
          }).unknown()
        ),
      }).unknown(),
    }).unknown(),
    progressOptions: {
      onLoaded: (total) => console.log(total) 
      // onLoaded callback will be called after 
      // the whole response will be done
      // WARNING - not availiable on nodejs environment
      onProgress: ({ total, current}) => console.log(total, current)
      // onProgress callback will be triggered during the response progress
      // till the response will be done
      // WARNING - not availiable on nodejs environment
    },
  });
```

#### get request with blob parse

```javascript
import Joi from "@hapi/joi";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getPhotoRequest = (): Promise<IResponse> =>
  new RestRequest().getBlobRequest({
    endpoint: "http://localhost:3000",
    translateFunction = (key, options) => `${key}:${JSON.stringify(options)}`,
    responseSchema: Joi.any()
  });
```

#### get PURE REST request

```javascript
import Joi from "@hapi/joi";
import { PureRestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getContractsRequest = (): Promise<IResponse> =>
  new PureRestRequest().getRequest({
    endpoint: "http://localhost:3000",
    translateFunction = (key, options) => `${key}:${JSON.stringify(options)}`,
    isErrorTextStraightToOutput: true,
    responseSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      info: Joi.object({
        count: Joi.number().required(),
        killers: Joi.array().items(
          Joi.object({
            username: Joi.string().required(),
            count: Joi.number().required(),
          }).unknown()
        ),
      }).unknown(),
    }).unknown(),
  });
```

#### post(put/patch/delete have the same format) request

```javascript
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const createReviseRequest = (someData): Promise<IResponse> =>
  new RestRequest().postRequest({
    endpoint: "http://localhost:3000",
    body: someData,
    mode: "cors",
    queryParams: {
      id: "test_id_123",
    },
    headers: {
      "Content-Type": "application/json",
    },
    responseSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    }).unknown(),
  });
```

#### The usage of the request api

```javascript
const { error, errorText, data, additionalErrors } = await createReviseRequest(
  someData
);
```

### JSON-RPC API

```javascript
import { JSONRPCRequest, IResponse } from "@mihanizm56/fetch-api";

export const createItemsRequest = (someData): Promise<IResponse> =>
  new JSONRPCRequest().makeRequest({
    endpoint: "http://localhost:3000",
    body: {
      method: 'some method',
      params: 123
    }
    queryParams: {
      stringId: "123"
      someArray: ['1', 1, '2', 2],
      numberId: 100
    },
    responseSchema: Joi.object({
      items: Joi.array().items(
        Joi.object({
          id: Joi.string().required(),
          name: Joi.string().required(),
          name: Joi.string()
        }).unknown()
      )
    }).unknown(),
  });
```

### JSON-RPC API (with batching)

```javascript
import { JSONRPCRequest, IResponse } from "@mihanizm56/fetch-api";
import Joi from '@hapi/joi'

const responseSchemaObjectOne = Joi.object({
  foo: Joi.string().required(),
}).unknown();

const responseSchemaObjectTwo = Joi.object({
  foo: Joi.string().required(),
}).unknown();

export const createItemsRequest = (someData): Promise<IResponse> =>
  new JSONRPCRequest().makeRequest({
    endpoint:
      'http://localhost:8080/json-rpc/positive?batch=true&twoSchemas=true',
    body: [
      { method: 'listCountries', params: {} },
      { method: 'listCountries', params: {} },
    ],
    isBatchRequest: true,
    responseSchema: [responseSchemaObjectOne, responseSchemaObjectTwo],
  });
```

#### Please, be careful. The response will be the object:
```javascript
{
  error: boolean,
  data: Array<IResponse>,
  additionalErrors: null,
  errorText: string,
  code: number
}
```

#### The usage of the request api

```javascript
const { error, errorText, data, additionalErrors } = await createItemsRequest(
  someData
);
```

#### Cancelling the request

```javascript
import { RestRequest, IResponse, ABORT_REQUEST_EVENT_NAME } from "@mihanizm56/fetch-api";

export const createReviseRequest = (someData): Promise<IResponse> =>
  new RestRequest().postRequest({
    endpoint: "http://localhost:3000",
    body: someData,
    abortRequestId: '1',
    responseSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    }).unknown(),
  });
);

document.dispatchEvent(
  new CustomEvent(ABORT_REQUEST_EVENT_NAME, {
    detail: { id: '1' },
  }),
);
```