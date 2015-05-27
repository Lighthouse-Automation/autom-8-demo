/*
The MIT License (MIT)

Copyright (c) 2015 Lighthouse Automation

https://github.com/Lighthouse-Automation/autom-8-demo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*jslint node: true */
"use strict";

var RED = require('node-red'),
  path = require('path'),
  debug = require('debug')('autom-8-RED');

// Create the settings object - see default settings.js file for other options
var REDsettings = {
    httpAdminRoot:"/control",
    httpNodeRoot: "/control-api",
    userDir:path.join(__dirname, '../control/node-red'),
    flowFile: "autom-8-control-flows.json",
    functionGlobalContext: { }    // enables global context
};

//
debug('Initialising RED');

//Parent app, assumes this will be 'required' from a higher level module
//that exports an express app.
APP = module.parent.exports;

//Server attached to parent app, assumes that APP has a setting 'server' already setup.
server = APP.get('server');

// Initialise the runtime with a server and settings
RED.init(server, REDsettings);

//Add the two node-red apps to the parent app routes
APP.use(REDsettings.httpAdminRoot, RED.httpAdmin);
APP.use(REDsettings.httpNodeRoot, RED.httpNode);

server.on('listening', function() {
	debug('Starting RED.');
	RED.start();
});

//This module exports nothing at this stage.
module.exports = 	{};
