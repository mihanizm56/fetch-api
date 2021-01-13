---
title: Overview
sidebar_label: Overview
---

import Link from '@docusaurus/Link';

### Why it is useful
This library was written in purpose to make life easier with simple window.fetch API and not to write from project to project
a lot of error catching and response validating. In common case we usually need to get structured respone from the backend 
and this library helps us with that. RestRequest needs some stricted fields to be in response and PureRestRequest is not need.
What to use is up to you. JSONRPCRequest is build by standard of JSON-RPC with no additions.

Also the killer feature of this package is to validate responses with schemas and to select the responded fields
if we don't need the full response.


### Full list of features
- Written in Typescript
- Validation for the responses
- Universal requests (nodejs 8+ and modern browsers)
- Output is not built - you are to build it with your own builder(webpack, rollup, etc)
- Translation for the responses
- Logging in browser devtools in useful "group" format
- One interface for all types of requests
- Query-params serialize
- Cancel-request if the timeout is higher than timeout value (60 seconds by default) 
- Error catching (you dont need to use try/catch)
- The ability to cancel the request by throwing the special event (ABORT_REQUEST_EVENT_NAME)
- The ability to handle the response progress
- The ability to select necessary fields from the response
- The ability to retry requests and use it with the timeouts

Please check out <Link to="docs/examples/cancel-requests">examples section</Link>

## Attentions

- ### The request body will be serialized in JSON if body data NOT FormData

- ### If you need to support ie11 

Please install and add the following polyfills to your project

```javascript
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import 'whatwg-fetch';
```