/**
 * Creates a new CollisionEvent
 *
 * @class CollisionEvent
 * @extends Event
 * @param {String} eventType
 * @param {*} objectives
 * @description todoc
**/
function CollisionEvent(eventType, objectives) {
	Event.call(this, eventType);
	
	this.objectives = Array.prototype.concat(objectives);
}

/** @lends CollisionEvent# **/
var collisionEventProto = CollisionEvent.prototype = Object.create(Event.prototype);
collisionEventProto.constructor = CollisionEvent;

/**
 * The objectives of the event
 *
 * @type Array
 * @default null
 * @readonly
**/
collisionEventProto.objectives = null;
