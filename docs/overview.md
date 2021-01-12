---
title: Overview
sidebar_label: Overview
---

### Why it is useful
This library was written in purpose to make life easier with simple window.fetch API and not to write from project to project
a lot of error catching and response validating. In common case we usually need to get structured respone from the backend 
and this library helps us with that. RestRequest needs some stricted fields to be in response and PureRestRequest is not need.
What to use is up to you. JSONRPCRequest is build by standard of JSON-RPC with no additions.

Also the killer feature of this package is to validate responses with schemas (on top of @hapi/joi) and to select the responded fields
if we don't need the full response.


### Full list of features
- Validation for the responses
- Universal requests (nodejs 8+ and modern browsers)
- Translation for the responses
- Logging in browser devtools in useful "group" format
- One interface for all types of requests
- Query-params serialize
- Cancel-request if the timeout is higher than timeout value (60 seconds by default) 
- Error catching (you dont need to use try/catch)
- The ability to cancel the request by throwing the special event (ABORT_REQUEST_EVENT_NAME)
- The ability to handle the response progress
- The ability to select necessary fields from the response (https://github.com/nemtsov/json-mask#readme used)
- The ability to use persistent params for all requests
- The ability to retry requests and use it with the timeouts



## If you need to support ie11 

  please add the following polyfills

```javascript
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import 'whatwg-fetch';
```