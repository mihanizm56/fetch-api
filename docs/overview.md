---
title: Overview
sidebar_label: Overview
---

# @mihanizm56/fetch-api

## Solution for the isomorphic fetch

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
