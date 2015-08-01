/**
 * Creates a new MouseEvent
 *
 * @class MouseEvent
 * @extends Event
 * @param {String} eventType
 * @param {Number} x
 * @param {Number} y
 * @param {String} button
 * @description todoc
**/
function MouseEvent(eventType, x, y, button) {
	Event.call(this, eventType);
	
	this.x = x;
	this.y = y;
	this.button = button;
}

/** @lends MouseEvent# **/
var mouseEventProto = MouseEvent.prototype = Object.create(Event.prototype);
mouseEventProto.constructor = MouseEvent;

/**
 * The x position
 *
 * @type Number
 * @default 0
 * @readonly
**/
mouseEventProto.x = 0;

/**
 * The y position
 *
 * @type Number
 * @default 0
 * @readonly
**/
mouseEventProto.y = 0;

/**
 * The button of the event
 *
 * @type String
 * @default null
 * @readonly
**/
mouseEventProto.button = null;
