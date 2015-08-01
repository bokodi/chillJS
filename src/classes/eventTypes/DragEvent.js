/**
 * Creates a new DragEvent
 *
 * @class DragEvent
 * @extends Event
 * @param {String} eventType
 * @param {Number} x
 * @param {Number} y
 * @param {*} dragged
 * @description todoc
**/
function DragEvent(eventType, x, y, dragged) {
	Event.call(this, eventType);
	
	this.dragStartX = x;
	this.dragStartY = y;
	
	this.dragged = Array.prototype.concat(dragged);
}

/** @lends DragEvent# **/
var dragEventProto = DragEvent.prototype = Object.create(Event.prototype);
dragEventProto.constructor = DragEvent;

/**
 * The dragStartX of the event
 *
 * @type Number
 * @default null
 * @readonly
**/
dragEventProto.dragStartX = null;

/**
 * The dragStartY of the event
 *
 * @type Number
 * @default null
 * @readonly
**/
dragEventProto.dragStartY = null;

/**
 * The list of dragged items
 *
 * @type Array
 * @default null
 * @readonly
**/
dragEventProto.dragged = null;
