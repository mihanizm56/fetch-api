---
title: Select response fields
---

import Link from '@docusaurus/Link';

When the response data object is very big and you don't need all fields or this is not secure for the development,
you can use the data selection - select only needed fields from the response.

This functionality is built on top of <Link to='https://github.com/nemtsov/json-mask'>json-mask</Link> library


As an example - we have response with fields:
```javascript
{
    username:"Police officer"
    password:"Police officer123",
    info:{
        count:2,
        killers:["Sam", "John"]
    }
}
```
But in our code we want to get only username field and info field with only killers array inside:
```javascript
{
    username:"Police officer"
    info:{
        killers:["Sam", "John"]
    }
}
```

This can be possible because inside in the response formatter there will be called: jsonMask(responseData.data, selectData)

```javascript
import Joi from "joi";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";



export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    selectData: "username,info(killers)",
    responseSchema: Joi.object({
      username: Joi.string().required(),
      info: Joi.object({
        killers: Joi.array().items(
          Joi.object({
            username: Joi.string().required(),
            count: Joi.number().required(),
          })
        ),
      }),
    }),
  });
```

### You can provide your own select function (customSelectorData field)



```javascript
import Joi from "joi";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    selectData: "username,info(killers)",
    customSelectorData: (
        data: YourDataType, 
        selectData: string /*"username,info(killers)" will be transferred*/
    ) => {/*you must return the selected data here*/},

    responseSchema: Joi.object({
      username: Joi.string().required(),
      info: Joi.object({
        killers: Joi.array().items(
          Joi.object({
            username: Joi.string().required(),
            count: Joi.number().required(),
          })
        ),
      }),
    }),
  });
```