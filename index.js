#!/usr/bin/env node

/**
	Nabil Redmann <repo@bananaacid.de>
	License: MIT
**/


/** the maximum levels to inspect objects */
const INSPECTION_MAX_DEPTH = 3;


const info = {
	/** 
	 * Generate HTML with server and connection info
	 * @param request   nodejs request object
	 * @param response  nodejs response object
	 * @return string HTML
	 */
	getInfoHtml: (request, response) => {
		reset();

		let head = h(3, 'Server Info', 0);

		let html =
			d('margin-left: 300px; max-width: 100%; max-height: 100%; overflow: auto;', 
				//h(2.5, 'HTTP headers:') + 
				//table(request.headers) + 
				h(2.5, 'process.env', 0) +
				table(process.env) +
				h(2.5, 'global') + 
				table(global, INSPECTION_MAX_DEPTH) +
				h(2.5, 'request') +
				table(request) +
				h(2.5, 'response') +
				table(response) +
				h(2.5, 'process') +
				table(process) +
				d('height: 4em', '<!-- spacer -->') +
				''
			);

		let head_all = 
			d('position: fixed; top: 0; left: 0; width: 300px; max-height: 100%; overflow: auto; padding: 1em; box-sizing: border-box;', 
				head +
				headers() +
				d('margin-top: 2em', '&copy; BananaAcid')
			);
		
		return '' +
			head_all +
			html;
	},

	/**
	 * Start a standalone server on specific port
	 *
	 * @param port defaults to 4567
	 */
	server: (port) => {
		port = port || 4567;

		const requestHandler = (request, response) => {
		  response.writeHead(200, {'Content-Type': 'text/html'});

		  let content =
			'<!DOCTYPE html>\n<html>\n<head>\n<title>Server Info</title>\n<meta charset="utf-8"/>\n</head>\n<body>' +
			info.getInfoHtml(request, response) +
			'\n</body>\n</html>';

		  response.end( content );
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

// provide the html content generator and the server fn for including script
module.exports = info;


// start as server if served directly
if (!isRequired())
	info.server(process.env.INFOPAGE_PORT || process.env.PORT || process.env.NODE_PORT);


// Utilities

let headersInfo=[], pos=0;

/**
 * Reset the internal headers info array
 */
function reset() {
	headersInfo=[];
	pos=0;
}

/**
 * Checks if a param is really an object
 * 
 * @param obj the object to be checked
 * @returns  bool
 */
function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

/**
 * Build the details html of an object
 * 
 * @param obj  the object to be inspected
 * @param _deep internal counter to keep track on how deep the object got inspected
 * @returns a html string
 */
function table(obj, _deep) {
	_deep = _deep || 0;
	_deep++;

	return '<table border="1" style="border-collapse:collapse;">' + Object.keys(obj).map((k) => 
		k[0] == '_' ? '' :
			obj[k] && ['Object', 'Function', 'Array', 'Number', 'String', 'Boolean'].indexOf(obj[k].constructor.name) == -1 ? `<tr><td style="vertical-align: top; padding: .2em; font-weight: bold;">${k}</td><td style="vertical-align: top; padding: .2em;">[ ` + obj[k].constructor.name + ` ]</td></tr>` :
				isObject(obj[k]) && _deep < INSPECTION_MAX_DEPTH ? '<tr><td style="vertical-align: top; padding: .2em; font-weight: bold;">' + h(1, k, undefined, _deep) + '</td><td style="vertical-align: top; padding: .2em;">'+ table(obj[k], _deep) +'</td></tr>' :
					`<tr><td style="vertical-align: top; padding: .2em; font-weight: bold;">${k}</td><td style="vertical-align: top; padding: .2em;">` + require('util').inspect(obj[k], false, 1) + `</td></tr>`
	).join('') + '</table>';
}

/**
 * Build a section for multiple headers and tables / or the menu (hence the style)
 * 
 * @param style  the style for the main area sections or the menu
 * @param str    content html
 * @returns 
 */
function d(style, str) {
	return `<div style="${style}">${str}</div>`;
}

/**
 * Create the header for a table
 * 
 * @param lvl font size in em
 * @param str caption
 * @param top margin top
 * @param _deep nesting level
 * @returns html string of the header
 */
function h(lvl, str, top, _deep) {
	top = top == undefined ? lvl : top;
	pos++;
	headersInfo.push([pos, str, _deep]);
	return `<header id="h${pos}"style="font-size: ${lvl}em; margin-top: ${top}em; padding: .2em ${lvl > 1 ? .2 : 0}em;}">${str}</header>`;
}

/**
 * Creates the menu, based of the headers
 *
 * @returns html string of the headers as menu links
 */
function headers() {
	return '<table>' + headersInfo.map( e => `<tr><td>${'&nbsp;&nbsp;&nbsp;'.repeat(e[2])}${e[2] ? '&ndash;' : ''} <a href="#h${e[0]}">${e[1]}</a></td></tr>` ).join('') + '</table>';
}

/**
 * Check if this code file was `required()` by another script
 * @returns bool
 */
function isRequired() {
    const stackLine = (new Error()).stack.split('\n')[2];
    const callerModuleName = /\((.*):\d+:\d+\)$/.exec(stackLine)[1];
    return !(require.main.filename === callerModuleName);
};