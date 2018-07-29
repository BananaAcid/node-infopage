#!/usr/bin/env node

/**
	Nabil Redmann <repo@bananaacid.de>
	License: MIT
**/


const INSPECTION_MAX_DEPTH = 3;


const info = {

	getInfoHtml: (request, response) => {
		reset();

		let head = h(3, 'Server Info', 0);

		let html =
			//h(2.5, 'HTTP headers:') + 
			//table(request.headers) + 
			h(2.5, 'process.env') +
			table(process.env) +
			h(2.5, 'global') + 
			table(global, INSPECTION_MAX_DEPTH) +
			h(2.5, 'request') +
			table(request) +
			h(2.5, 'response') +
			table(response) +
			h(2.5, 'process') +
			table(process) +
			'';
		
		return '' +
			head +
			headers() + 
			html;
	},


	server: (port) => {
		port = port || process.env.PORT || 4567;

		const requestHandler = (request, response) => {
		  response.writeHead(200, {'Content-Type': 'text/html'});

		  response.end( info.getInfoHtml(request, response) );
		};

		require('http').createServer(requestHandler)
		.listen(port, err => {
		  if (err) {
		    return console.error('ERROR:', err);
		  }

		  console.info(`node-infopage is listening on ${port}`);
		});
	}
};


module.exports = info;


// start as server if served directly
if (!isRequired())
	info.server();


// Utilities

let headersInfo=[], pos=0;

function reset() {
	headersInfo=[];
	pos=0;
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

function table(obj, _deep) {
	_deep = _deep || 0;
	_deep++;

	return '<table border="1" style="border-collapse:collapse;">' + Object.keys(obj).map((k) => 
		k[0] == '_' ? '' :
			obj[k] && ['Object', 'Function', 'Array', 'Number', 'String', 'Boolean'].indexOf(obj[k].constructor.name) == -1 ? `<tr><td style="vertical-align: top; padding: .2em;">${k}</td><td style="vertical-align: top; padding: .2em;">[ ` + obj[k].constructor.name + ` ]</td></tr>` :
				isObject(obj[k]) && _deep < INSPECTION_MAX_DEPTH ? '<tr><td style="vertical-align: top; padding: .2em;">' +h(1, k, undefined, _deep) + '</td><td style="vertical-align: top; padding: .2em;">'+ table(obj[k], _deep) +'</td></tr>' :
					`<tr><td style="vertical-align: top; padding: .2em;">${k}</td><td style="vertical-align: top; padding: .2em;">` + require('util').inspect(obj[k], false, 1) + `</td></tr>`
	).join('') + '</table>';
}

function h(lvl, str, top, _deep) {
	top = top == undefined ? lvl : top;
	pos++;
	headersInfo.push([pos, str, _deep]);
	return `<header id="h${pos}"style="font-size: ${lvl}em; margin-top: ${top}em; padding: .2em;}">${str}</header>`;
}

function headers() {
	return '<table>' + headersInfo.map( e => `<tr><td>${'&nbsp;&nbsp;&nbsp;'.repeat(e[2])}${e[2] ? '&ndash;' : ''} <a href="#h${e[0]}">${e[1]}</a></td></tr>` ).join('') + '</table>';
}


function isRequired() {
    const stackLine = (new Error()).stack.split('\n')[2];
    const callerModuleName = /\((.*):\d+:\d+\)$/.exec(stackLine)[1];
    return require.main.filename === callerModuleName;
};