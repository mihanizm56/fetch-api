---
title: Universal Requests
---

import Link from '@docusaurus/Link';

All Requests are availiable in both node.js and browser environments.

This is because the library use window.fetch and <Link to='https://github.com/node-fetch/node-fetch'>node-fetch</Link>, if it detects your node.js environment.

### Browser
For example with bundler we can use:

```javascript
import Joi from "joi";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
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

### Node.js

In pure Node.js environment wihout any bundlers we can use:

```javascript
const Joi = require("joi");
const { RestRequest, IResponse } = require("@mihanizm56/fetch-api");

module.exports.getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    responseSchema: Joi.object({
      username: Joi.string().required()
    }),
  });
```

With bundlers in Node.js we also can use es6 imports

```javascript
import Joi from "joi";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
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
