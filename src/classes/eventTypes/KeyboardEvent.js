/**
 * Creates a new KeyboardEvent
 *
 * @class KeyboardEvent
 * @extends Event
 * @param {String} eventType
 * @param {int} keyCode
 * @description todoc
**/
function KeyboardEvent(eventType, keyCode) {
	Event.call(this, eventType);
	
	this.keyCode = keyCode;
	this.character = String.fromCharCode(keyCode).toLowerCase();
}

/** @lends KeyboardEvent# **/
var keyboardEventProto = KeyboardEvent.prototype = Object.create(Event.prototype);
keyboardEventProto.constructor = KeyboardEvent;

/**
 * The keyCode of the event
 *
 * @type int
 * @default null
 * @readonly
**/
keyboardEventProto.keyCode = null;

/**
 * The character of the event
 *
 * @type String
 * @default null
 * @readonly
**/
keyboardEventProto.character = null;
