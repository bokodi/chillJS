/**
 * Creates a new LoadEvent
 *
 * @class LoadEvent
 * @extends Event
 * @param {String} eventType
 * @param {*} target
 * @description todoc
**/
function LoadEvent(eventType, target) {
	Event.call(this, eventType);
	
	this.target = target;
}

/** @lends LoadEvent# **/
var loadEventProto = LoadEvent.prototype = Object.create(Event.prototype);
loadEventProto.constructor = LoadEvent;
