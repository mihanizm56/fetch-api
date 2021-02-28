---
title: API
---

import Link from '@docusaurus/Link';

## Request input options:

|  Name | Type | Comments |
|---|---|---|
| endpoint  | ```string```  | the request url  |
| responseSchema  | ```joi schema``` |  the response Schema that parsed by joi (you must use the joi in your project and insert the response Schema into this field)  |
| body  | ```<YourType>``` | the request body  |
| queryParams  | ```Record<string,any>```  | the object with the query parameters (they will be serialized automatically)  |
| translateFunction  | ```(key,options) => string```  |  function that will be called with error text key and params (key, params) |
| isErrorTextStraightToOutput  | ```boolean```  | flag not to prepare error text value - it goes straight from backend ("errorText" if REST and "message" if JSON-RPC) |
| extraValidationCallback  | ```(response:<YourType>)=>boolean```  | callback that can be used for custom response data validation or if you don't want to use joi  |
| customTimeout  | ```number```  |  milliseconds for cancel the request on timeout (or a full package of requests if the "retry" parameter is activated) |
| retry  |  ```number``` | number of requests try to request if the response is negative  |

### Also consists of a lot of default fetch options (headers, mode, etc), see <Link to='https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch'>api docs</Link>


## Request output options:

|  Name | Type | Comments |
|---|---|---|
| error  | ```boolean```  | flag if the request successful |
| errorText  |  ```string``` | main text of the error (can be translated) |
| data  | ```<YourType>```  | response data  |
| additionalErrors  |  ```any``` | additional error data from backend |
| code  | ```number```  |  response code number,always less than 501 |