open-browsers
---

Attempts to open the browser with a given URL.
On Mac OS X, attempts to reuse an existing Chrome tab via AppleScript.
Otherwise, falls back to [opn](https://github.com/sindresorhus/opn) behavior. `open-browsers` form [react-dev-utils](https://github.com/facebook/create-react-app/blob/next/packages/react-dev-utils/openBrowser.js).

### Install

```bash
npm install open-browsers --save-dev
```

### Usage

> openBrowsers(url: string): boolean 

```js
var path = require('path');
var openBrowsers = require('open-browsers');

if (openBrowsers('http://localhost:3000')) {
  console.log('The browser tab has been opened!');
}
```