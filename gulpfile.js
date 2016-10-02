var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');

var pkg = require('./package.json');

var banner = [
	'/**',
	' * <%= pkg.name %> - <%= pkg.description %>',
	' * ',
	' * @version <%= pkg.version %>',
	' * @link <%= pkg.homepage %>',
	' * @license <%= pkg.license %>',
	' * ',
	' * ',
	' * Date: ' + new Date().toDateString(),
	' */',
	'', '', ''
].join('\n');

var sourceRoot = 'src/';
var sourceFiles = [
	'moduleHeader.js',
	
	'helpers/polyfills.js',
	'helpers/regexHelpers.js',
	
	'helpers/typeHelpers.js',
	'helpers/commonHelpers.js',
	'helpers/stringHelpers.js',
	'helpers/arrayHelpers.js',
	'helpers/objectHelpers.js',
	'helpers/DOMHelpers.js',
	
	'classes/HTTP.js',
	'classes/Enum.js',
	'classes/Event.js',
	'classes/EventTarget.js',
	'classes/OrderedList.js',
	'classes/Storage.js',
	'classes/Vector2.js',
	'classes/Screen.js',
	'classes/Cursor.js',
	'classes/ClassList.js',
	'classes/Loader.js',
	'classes/Queue.js',
	'classes/Task.js',
	'classes/Collection.js',
	
	'classes/eventTypes/MouseEvent.js',
	'classes/eventTypes/KeyboardEvent.js',
	'classes/eventTypes/DragEvent.js',
	'classes/eventTypes/LoadEvent.js',
	'classes/eventTypes/CollisionEvent.js',
	
	'core/utils/methods.js',
	'core/utils/enums.js',
	'core/utils/elements.js',
	'core/utils/abstracts.js',
	'core/utils/classes.js',
	'core/utils/masks.js',
	'core/utils/plugins.js',
	'core/utils/assets.js',
	'core/utils/canvas.js',
	
	'core/Element.js',
	'core/Layer.js',
	'core/Scene.js',
	
	'core/elementTypes/AbstractElement.js',
	'core/elementTypes/ContainerElement.js',
	'core/elementTypes/PolygonElement.js',
	'core/elementTypes/LineElement.js',
	'core/elementTypes/TriangleElement.js',
	'core/elementTypes/RectangleElement.js',
	'core/elementTypes/PentagonElement.js',
	'core/elementTypes/HexagonElement.js',
	'core/elementTypes/StarElement.js',
	'core/elementTypes/CircleElement.js',
	'core/elementTypes/EllipseElement.js',
	'core/elementTypes/TextElement.js',
	'core/elementTypes/ImageElement.js',
	'core/elementTypes/PatternElement.js',
	'core/elementTypes/SpriteSheetElement.js',
	
	'main.js',
	
	'moduleFooter.js'
];

gulp.task('build', function() {
	return gulp.src(sourceFiles, { cwd: sourceRoot })
		
		.pipe(concat('chill.js'))
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('./'))
		
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify({ preserveComments: 'license' }))
		.pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
	gulp.watch(sourceRoot + '*.js', ['build']);
});
