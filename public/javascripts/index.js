$(document).ready(function() {
	var client = mqtt.connect('ws://' + document.location.hostname + ':' + (parseInt(document.location.port) + 1));

	client.subscribe("/devices/loopback/+/state");
	client.on('message', function(topic, payload) {
		var topicPaths = topic.split('/');
		var devId = topicPaths[topicPaths.length -2];
		var msg = $.parseJSON(payload);
		$('#' + devId + '.state').text(msg.state);
	});

	$('.loopback, .state').text('undefined');
});
