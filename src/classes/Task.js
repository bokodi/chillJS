/**
 * Creates a new Task
 *
 * @class Task
 * @description todoc
 * @param {Function} listener
 * @param {int} [interval = 0]
 * @param {Object} [thisArg = this]
**/
function Task(listener, interval, thisArg) {
	this.listener = listener;
	this.interval = interval || 0;
	this.thisArg = thisArg || this;
	
	this.reset();
}

/** @lends Task# **/
var taskProto = Task.prototype = Object.create(null);
taskProto.constructor = Task;

/**
 * Call the listener
 *
 * @returns {Boolean}
**/
taskProto.execute = function() {
	var now = new Date();
	
	if (now - this.lastTime >= this.interval) {
		this.lastTime = now;
		
		return this.listener.call(this.thisArg, this.tick++, now - this.startTime, this);
	}
	
	return false;
};

/**
 * Resets the task
 *
 * @returns {Task} this
**/
taskProto.reset = function() {
	var now = new Date();
	
	this.startTime = now;
	this.lastTime = now;
	this.tick = 0;
	
	return this;
};

/**
 * Returns the string value of the task
 *
 * @returns {String}
**/
taskProto.toString = function() {
	return '[object Task]';
};
