/**
 * Creates a new Cursor
 *
 * @class Cursor
 * @extends Vector2
 * @param {String} type
 * @description todoc
**/
function Cursor(type) {
	Vector2.call(this);
	
	this.type = type;
}

/** @lends Cursor# **/
var cursorProto = Cursor.prototype = Object.create(Vector2.prototype);
cursorProto.constructor = Cursor;

/**
 * The type of the cursor
 *
 * @type String
 * @default 'mouse'
 * @readonly
**/
cursorProto.type = 'mouse';

/**
 * The state of the cursor
 *
 * @type Boolean
 * @default false
 * @readonly
**/
cursorProto.onScreen = false;

/**
 * Returns the string value of the cursor
 *
 * @returns {String}
**/
cursorProto.toString = function() {
	return 'Cursor at ' + this.x + ', ' + this.y;
};
