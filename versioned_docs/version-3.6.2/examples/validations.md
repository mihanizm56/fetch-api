---
title: Validations
---

import Link from '@docusaurus/Link';

You can use validations of the responses base on three types of validations
- Format of the protocol (JSONRPCRequest requirement)
- Requirements for the strictly typed fields in response from the backend (RestRequest requirement)
- Client validation - <Link to='https://joi.dev/api/'>joi</Link> schemas or your custom validate callback

#### All of validations are non splitted from each other and make your response extremely safe!
#### If one of those validations fails - all the response will fail with the default error structure

### JSON-RPC requirements
Your response must contain these fields in JSON <Link to='https://www.jsonrpc.org/specification'>see standart</Link>
Result and Error field are mutually exclusive.

{
    jsonrpc,
    result,
    error,
    id
}

### RestRequest requirements

{
    data,
    error,
    errorText,
    additionalErrors
}

### RestRequest - do not make any requirements for requirement-free using

### Schema validation

```javascript
import Joi from "joi";
import i18next from "i18next";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

const schema = Joi.object({
    username: Joi.string().required(),
})

export const getWhateverRequest = (): Promise<IResponse> =>
  new PureRestRequest().getRequest({
    endpoint: "http://localhost:3000",
    responseSchema: schema
  });
```

### Custom callback validation

```javascript
import Joi from "joi";
import i18next from "i18next";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

const schema = Joi.object({
    username: Joi.string().required(),
})

export const getWhateverRequest = (): Promise<IResponse> =>
  new PureRestRequest().getRequest({
    endpoint: "http://localhost:3000",
    extraValidationCallback: (data:YourDataType) => {
        // here you can validate the response and return boolean value 
        // joi validation will be disabled
  });
```