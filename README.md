# @mihanizm56/fetch-api

## Solution for the isomorphic fetch
### [Documentation here](https://mihanizm56.github.io/fetch-api/)

### Benefits:
- Provides validation for responses (based on @hapi/joi Schema validation and may use your own validation function)
- Provides the ability to make rest-api and json-rpc protocol requests in One interface
- Provides query-params serialize (booleans,strings,numbers,arrays of numbers or strings and variable serialize options for different backend services, https://www.npmjs.com/package/query-string is used)
- Provides cancel-request if the timeout is higher than timeout value (60 seconds by default) 
- Provides error catching (you dont need to use try/catch)
- Provides the ability to match the exact error translation
- Provides different kinds of the response formats to parse
- Returns ALWAYS the hard prepared response structure (data, error, errorText, additionalErrors)
- Works in modern browsers and ie11
- Provides two main classes for REST API - RestRequest and PureRestReques. <br/> The difference is in the
  hard-structured response format
- Provides the ability to cancel the request by throwing the special event (ABORT_REQUEST_EVENT_NAME)
- Provides the ability to handle the response progress
- Provides the ability to select necessary fields from the response (https://github.com/nemtsov/json-mask#readme used)
- Provides the ability to use persistent params for all requests
- Provides the ability to retry requests
- Provides the ability to logging your error requests

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
- customTimeout(number) - milliseconds for cancel the request on timeout (or a full package of requests if the "retry" parameter is activated) 
- retry - number of requests try to request if the response is negative

#### Request output options:
- error (boolean) - the flag of the response status
- errorText (string) - the text error message from the backend
- data (object) - the main data from the backend
- additionalErrors (object) - the additional error data from the backend
- code (number) - status-code from backend

## Features and recommendations
- body will be serialized in JSON if body data NOT FormData

## !!! Attention !!!
### If you need to support ie11 - please add the following polyfills

```javascript
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import 'whatwg-fetch';
```

#### installation

```javascript
npm install @mihanizm56/fetch-api
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
#### Set persist options to all requests

```javascript
import { ProxyController } from "@mihanizm56/fetch-api";

new ProxyController().setResponseTrackCallback(({
  requestParams, // all request parameters
  response, //  pure response protected object
  pureResponseData, // response body without formatting
  requestError: boolean, // is request crashed
  formattedResponseData // formatted response data in IResponse interface
}) => ({
 // do some metrics or logging here
}));
```

#### Set callback for metrics for all requests

```javascript
import { ProxyController } from "@mihanizm56/fetch-api";

new ProxyController().setPersistentOptions(() => ({
  headers: {
    foo: 'bar',
  },
}));
```