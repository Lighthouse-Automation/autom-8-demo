$(document).ready(function() {
	var client = mqtt.connect();

	client.subscribe("/devices/loopback/+/state");
	client.on('message', function(topic, payload) {
		alert([topic, payload].join(": "));
	});
});
