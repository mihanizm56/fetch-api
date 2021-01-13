---
title: API
---


#### Request input options:

- endpoint(string): the request url
- responseSchema: the response Schema that parsed by joi <br/>(you must use the joi in your project and insert the response Schema into this field)
- body(JSON | FormData): the request body
- mode('cors' | 'no-cors'): the cors type
- queryParams(object): the object with the query parameters (they will be serialized automatically)
- headers(object): the object with the headers
- translateFunction(function): function that will be called with error text key and params (key, params)
- isErrorTextStraightToOutput(boolean): flag not to prepare error text value - it <br/>
  goes straight from backend ("errorText" if REST and "message" if JSON-RPC)
- extraValidationCallback(function): callback that can be used for custom response <br/>
  data validation or if you don't want to use joi
- customTimeout(number) - milliseconds for cancel the request on timeout (or a full package of requests if the "retry" parameter is activated) 
- retry(number) - number of requests try to request if the response is negative


#### Request output options:

- error (boolean) - flag of the response status
- errorText (string) - text error message from the backend
- data (any) - main data from the backend
- additionalErrors (any) - additional error data from the backend (for example for form errors)
- code (number) - response-code from backend