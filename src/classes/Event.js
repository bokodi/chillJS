/**
 * Creates a new Event
 *
 * @class Event
 * @param {String} type
 * @description todoc
**/
function Event(type) {
	this.type = type;
	this.data = {};
	this.timeStamp = new Date().getTime();
}

/** @lends Event# **/
var eventProto = Event.prototype = Object.create(null);
eventProto.constructor = Event;

/**
 * The type of the event
 *
 * @type String
 * @default null
 * @readonly
**/
eventProto.type = null;

/**
 * The original event
 *
 * @type Event
 * @default null
 * @readonly
**/
eventProto.originalEvent = null;

/**
 * The target of the event
 *
 * @type Object
 * @default null
 * @readonly
**/
eventProto.target = null;

/**
 * Custom data of the event
 *
 * @type Object
 * @default null
 * @readonly
**/
eventProto.data = null;

/**
 * The time (in milliseconds since the epoch) at which the event was created
 *
 * @type Number
 * @default 0
 * @readonly
*/
eventProto.timeStamp = 0;

/**
 * Indicates whether the event is cancelable or not
 *
 * @type Boolean
 * @default true
*/
eventProto.cancelable = true;

/**
 * Returns a boolean indicating whether or not eventProto.preventDefault() was called on the event
 *
 * @type Boolean
 * @default false
*/
eventProto.defaultPrevented = false;

/**
 * Returns a boolean indicating whether or not eventProto.stopPropagation() was called on the event
 *
 * @type Boolean
 * @default false
*/
eventProto.propagationStopped = false;

/**
 * The return value of the event
 *
 * @type *
 * @default null
*/
eventProto.returnValue = null;

/**
 * Cancels the event if it is cancelable, without stopping further propagation of the event
 *
 * @returns {Event} this
*/
eventProto.preventDefault = function() {
	if (this.cancelable === true) {
		this.defaultPrevented = true;
	}
	
	return this;
};

/**
 * Prevents further propagation of the current event
 *
 * @returns {Event} this
*/
eventProto.stopPropagation = function() {
	this.propagationStopped = true;
	
	return this;
};

/**
 * Returns the string value of the event
 *
 * @returns {String}
**/
eventProto.toString = function() {
	return this.type + ' Event';
};
