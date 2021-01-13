---
title: Browser Support and Compilation
---

All files from the library will be a combination of thanspiled .js filed with typings (.ts files),

.js files will be transpiled to es5 to be allowed to all modern browsers, enge40+, ie11

You must to use bundler to get it to the browser.

But for ie11 you should install and add those packages below:

```javascript
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import 'whatwg-fetch';
```