# node-infopage

I was tired of getting the generic configuration data out by log and inspect. This is a drop in file, working with IIS (issnode) as well.

![screen](https://user-images.githubusercontent.com/1894723/50869927-599dcc00-13b6-11e9-80f6-f5f14dc46bc3.png)

## USAGE:

### quick use
	
	npx node-infopage

### install

	npm i -g node-infopage


### Standalone, globally installed:

	$   PORT=4567 node-infopage
	PS  $ENV:PORT=4567 ; node-infopage
	\>  set PORT=4567 && node-infopage

### IN code

	// require server to start

	require('node-infopage').server(..optionalPort..);

	// ESM:

	import {server} from 'nodeinfopage';
	server(..optionalPort..);

	// with own server
	let html = require('node-infopage').getInfoHtml();
	//... then serve it with your own server
	ctx.body = html;

## NOTE:
If port is omitted, process.env.PORT is checked, defaulting to 4567