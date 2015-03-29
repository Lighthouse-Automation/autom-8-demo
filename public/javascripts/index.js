$(document).ready(function() {
	var client = mqqt.connect();

	client.subscribe("/devices/loopback/+/state");
	client.on('message', function(topic, payload) {
		alert([topic, payload].join(": "));
	});
});
