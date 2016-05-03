// networktables stuff

// sets a function that will be called when the robot connects/disconnects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);

// slider setup + config
document.querySelectorAll('input[type="range"]')
	.each(function() {
		var span = document.createElement('span');
	    span.className = 'output';
		span.insertAfter(this);
	})
	.bind('slider:ready slider:changed', function(event, data) {
		$(this)
			.nextAll('.output:first')
			.html(data.value);

	}).bind('change', function(event) {
		if (event.trigger != 'setValue') {
			NetworkTables.setValue('/camera/thresholds/' + this.id, event.value);
		}
	});

$('input:checkbox')
	.each(function() {
		$(this).nt_toggle('/camera/' + this.id);
	});

NetworkTables.addGlobalListener(function(key, value) {
	switch (key) {
		case '/components/autoaim/present':
			$('#present').text(value);
			$('#target_angle').toggle(value);
			$('#target_height').toggle(value);
			break;
		case '/components/autoaim/target_angle':
			$('#target_angle').text(value);
			break;
		case '/components/autoaim/target_height':
			$('#target_height').text(value);
			break;
		case '/camera/logging_error':
			$('#logging_error').text(value ? 'true' : 'false');
			break;
	}

	if (key.startsWith('/camera/thresholds/')) {
		document.getElementById(key.substring(19)).value = value;
	}

}, true);

// Set up camera
var loadCameraOnConnect = {
	container: '#robocam', // where to put the img tag
	proto: null, // optional, defaults to http://
	host: null, // optional, if null will use robot's autodetected IP address
	port: 5802, // webserver port
	image_url: '/?action=stream', // mjpg stream of camera
	data_url: '/program.json', // used to test if connection is up
	wait_img: null, // optional img to show when not connected, can use SVG instead
	error_img: null, // optional img to show when error connecting, can use SVG instead
	attrs: { // optional: attributes set on svg or img element
		width: 640, // optional, stretches image to this width
		height: 480, // optional, stretches image to this width
	}
};