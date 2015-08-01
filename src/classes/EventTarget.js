/**
 * Creates a new EventTarget
 * 
 * @class EventTarget
 * @description todoc
**/
function EventTarget() {
	this.eventList = {};
}

/**
 * Transmits an event handler from an eventTarget to an other
 * 
 * @memberof EventTarget
 * @static
 * @param {String} type
 * @param {EventTarget} source
 * @param {EventTarget} target
 * @returns {EventTarget}
**/
EventTarget.transmit = function(type, source, target) {
	source.on(type, function() {
		target.dispatchEvent(type);
	});
	
	return target;
};

/** @lends EventTarget# **/
var eventTargetProto = EventTarget.prototype = Object.create(null);
eventTargetProto.constructor = EventTarget;

/**
 * Adds a listener to the specified event
 * 
 * @param {String} type
 * @param {Function} listener
 * @returns {EventTarget} this
**/
eventTargetProto.addEventListener = function(type, listener) {
	var events = this.eventList[type] || (this.eventList[type] = []);
	
	events.push(listener);
	
	return this;
};

/**
 * Determines if the eventTarget has eventListeners of the given type
 * 
 * @param {String} type
 * @returns {Boolean}
**/
eventTargetProto.hasEventListener = function(type) {
	var events = this.eventList[type];
	
	return !!events && events.length > 0;
};

/**
 * Removes a listener from the specified event
 * 
 * @param {String} type
 * @param {Function} listener
 * @returns {EventTarget} this
**/
eventTargetProto.removeEventListener = function(type, listener) {
	var events = this.eventList[type],
		index;
	
	if (events !== undefined) {
		index = events.indexOf(listener);
		
		if (index !== -1) events.splice(index, 1);
	}
	
	return this;
};

/**
 * Removes all listeners
 * 
 * @returns {EventTarget} this
**/
eventTargetProto.removeAllEventListeners = function() {
	var eventList = this.eventList,
		hasOwn = Object.prototype.hasOwnProperty,
		key;
	
	for (key in eventList) {
		if (hasOwn.call(eventList, key)) delete eventList[key];
	}
	
	return this;
};

/**
 * Dispatches an Event at the specified EventTarget
 * 
 * @param {String} type
 * @returns {EventTarget} this
**/
eventTargetProto.dispatchEvent = function(type) {
	var events = this.eventList[type],
		args, i, il;
	
	if (events !== undefined) {
		args = Array.prototype.slice.call(arguments, 1);
		
		for (i = 0, il = events.length; i < il; i++) {
			events[i].apply(this, args);
		}
	}
	
	return this;
};

/**
 * Executes a provided function once per event listener
 * 
 * @param {String} type
 * @param {Function} callback
 * @returns {EventTarget} this
**/
eventTargetProto.eachEventListener = function(type, callback) {
	var events, i, il;
	
	if (this.hasEventListener(type)) {
		events = this.eventList[type];
		i = 0;
		il = events.length;
		
		for (; i < il; i++) {
			callback(events[i], i);
		}
	}
	
	return this;
};

/**
 * Adds a listener to the specified event
 * 
 * @method
 * @name EventTarget#on
 * @param {String} type
 * @param {Function} listener
 * @returns {EventTarget} this
 * @see EventTarget#addEventListener
**/
eventTargetProto.on = eventTargetProto.addEventListener;

/**
 * Removes a listener from the specified event
 * 
 * @method
 * @name EventTarget#off
 * @param {String} type
 * @param {Function} listener
 * @returns {EventTarget} this
 * @see EventTarget#removeEventListener
**/
eventTargetProto.off = eventTargetProto.removeEventListener;

/**
 * Removes all listeners
 * 
 * @method
 * @name EventTarget#offAll
 * @returns {EventTarget} this
 * @see EventTarget#removeAllEventListeners
**/
eventTargetProto.offAll = eventTargetProto.removeAllEventListeners;

/**
 * Dispatches an Event at the specified EventTarget
 * 
 * @method
 * @name EventTarget#emit
 * @param {String} type
 * @returns {EventTarget} this
 * @see EventTarget#dispatchEvent
**/
eventTargetProto.emit = eventTargetProto.dispatchEvent;

/**
 * Returns the EventTarget string value
 * 
 * @returns {String}
**/
eventTargetProto.toString = function() {
	return '[object EventTarget]';
};
