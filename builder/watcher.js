var builder = require('./build.js');

require('watch').createMonitor('src', function(monitor) {
	monitor.on('changed', function(f, curr, prev) {
		console.log('\n\n\n\tFile changed: ' + f + '\n\n');
		
		builder.build();
	});
});
