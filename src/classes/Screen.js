/**
 * Creates a new Screen
 *
 * @class Screen
 * @description todoc
**/
function Screen() {
	this.pos = new Vector2();
}

/** @lends Screen# **/
var screenProto = Screen.prototype = Object.create(null);
screenProto.constructor = Screen;

/**
 * The position of the screen
 *
 * @type Vector2
 * @default null
 * @readonly
**/
screenProto.pos = null;

/**
 * The width of the screen
 *
 * @type Number
 * @default 0
**/
screenProto.width = 0;

/**
 * The height of the screen
 *
 * @type Number
 * @default 0
**/
screenProto.height = 0;

/**
 * Returns the string value of the screen
 *
 * @returns {String}
**/
screenProto.toString = function() {
	return 'Screen[' + this.width + ', ' + this.height + '] at ' + this.pos.x + ', ' + this.pos.y;
};
