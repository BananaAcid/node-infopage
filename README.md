# node-infopage

I was tired of getting the generic configuration data out by log and inspect. This is a drop in file, working with IIS (issnode) as well.

![screen](https://user-images.githubusercontent.com/1894723/50869927-599dcc00-13b6-11e9-80f6-f5f14dc46bc3.png)

## USAGE:

### quick use
```bash
npx node-infopage
```

### install
```bash
npm i -g node-infopage
```

### Standalone, globally installed:
```
$   PORT=4567 node-infopage
PS  $ENV:PORT=4567 ; node-infopage
\>  set PORT=4567 && node-infopage
```

Does also work with `npx`, just put `npx` right before `node-infopage`.

### IN code start server
```js
// ESM:

import {server} from 'nodeinfopage';
server(..optionalPort..);

// old require way

require('node-infopage').server(..optionalPort..);
```

### IN code, with own server get HTML content
```js
// ESM:

import {getInfoHtml} from 'nodeinfopage';
let html = getInfoHtml(request, response);

// old require way

let html = require('node-infopage').getInfoHtml(request, response);
```

### example with own server

You can use it with express, koa and others. The `request` and `response` objects can be anything.

```js
import {getInfoHtml} from 'nodeinfopage';

//const app = new (require('http').Server)();
import Server from 'http';
let app = new Server();

app.on('request', (request, response) => {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	
	let html = getInfoHtml(request, response);
	
	res.send( html );  // or how ever your own server needs the html
	res.end('\n');
});
app.listen(8888);
```

## NOTE:
If **port** is omitted, on `server()` function, default is `4567`

If started **standalone**, `process.env.INFOPAGE_PORT`, then `process.env.NODE_PORT`, then `process.env.PORT` is checked, then fallback to default `4567`