var fs = require('fs');
var uglify = require('uglify-js');
var argparse =  require('argparse');

var parser = new argparse.ArgumentParser();

parser.addArgument(['-v', '--version'], {
	required: false
});

var args = parser.parseArgs();

function build(version) {
	var v = !version ? '' : '[' + version + ']';
	var fileName = 'chill';
	var fileNameMin = 'chill.min';
	
	console.log('Build chillJS' + v + '\n');
	
	var includeJSON = fs.readFileSync('builder/include.json', 'utf8');
	var include = JSON.parse(includeJSON);
	var basePath = include.basePath;
	var buffer = [];
	
	console.log('> add head info');
	var info = '// chillJS';
	
	if (version) info += v;
	
	info += '\n// ' + new Date().toDateString() + '\n\n';
	
	buffer.push(info);
	
	var license = fs.readFileSync('LICENSE', 'utf8');
	
	console.log('> add MIT LICENSE');
	buffer.push('/*\n' + license + '*/\n\n');
	
	include.files.forEach(function(file) {
		var content = fs.readFileSync('' + basePath + file, 'utf8');
		
		console.log('> add file: ' + file);
		buffer.push('// File: ' + file + '\n');
		buffer.push(content);
		buffer.push('\n');
	});
	
	var compressed = buffer.join('');
	
	console.log('');
	console.log('Write the file');
	
	fs.writeFileSync(fileName + '.js', compressed, 'utf8');
	
	console.log('Minify the code');
	
	var min = uglify.minify(fileName + '.js');
	fs.writeFileSync(fileNameMin + '.js', min.code, 'utf8');
	
	if (version) {
		console.log('');
		console.log('Copy the version files');
		
		fs.writeFileSync('versions/' + fileName + '-' + version + '.js', compressed, 'utf8');
		fs.writeFileSync('versions/' + fileNameMin + '-' + version + '.js', min.code, 'utf8');
	}
	
	console.log('');
	console.log('done');
}

if (require.main === module) { // called directly
	build(args.version);
} else {
	module.exports = {
		build: build
	};
}
