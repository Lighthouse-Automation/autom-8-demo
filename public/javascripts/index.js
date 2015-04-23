$(document).ready(function() {
	var client = mqtt.connect('ws://' + document.location.hostname + ':' + (parseInt(document.location.port) + 1));

	client.subscribe("/devices/loopback/+/state");
	client.on('message', function(topic, payload) {
		var topicPaths = topic.split('/');
		var devId = topicPaths[topicPaths.length -2];
		var msg = $.parseJSON(payload);
		$('#lb-' + devId + ' .state').text(msg.state);
	});

	$('.container-loopback .state').text('undefined');
	$('.container-loopback .control').click(function(event) {
		var targId = '#' + $(this).closest('p').attr('id');
		var targIdx = targId.charAt(targId.length - 1);
		var msg = {};
		msg['action'] = $(targId + ' .state').text() === 'on' ? 'off':'on';
		client.publish('/devices/loopback/' + targIdx + '/newstate', JSON.stringify(msg));
	});
});
