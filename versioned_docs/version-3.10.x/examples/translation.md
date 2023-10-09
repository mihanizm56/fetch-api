---
title: Translation
---


You can translate your errorText field with providing translateFunction callback into request options.
An Important factor that you can use **any** module to translate the response text.

For example - you have an errorText from backend with key 'foo'. You provide translateFunction with i18next and get tranlated output in your request function


```javascript
import Joi from "joi";
import i18next from "i18next";
import { RestRequest, IResponse } from "@mihanizm56/fetch-api";

export const getWhateverRequest = (): Promise<IResponse> =>
  new RestRequest().getRequest({
    endpoint: "http://localhost:3000",
    translateFunction: (errorText: string, errorTextParams: any)=>{
        // and here we can add params to you translation key if it contains them
        // for example the translation is 'sheep {{counter}} value'
        return i18next.t(`${errorText}`, errorTextParams)
    },
    responseSchema: Joi.object({
      username: Joi.string().required(),
    }),
  });
```