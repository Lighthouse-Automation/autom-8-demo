var RED = require('node-red');
var path = require('path');
var debug = require('debug')('autom-8-RED');

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
