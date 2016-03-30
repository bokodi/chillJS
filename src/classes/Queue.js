/**
 * Creates a new Queue
 *
 * @class Queue
 * @description todoc
**/
function Queue() {
	this.taskList = [];
}

/** @lends Queue# **/
var queueProto = Queue.prototype = Object.create(null);
queueProto.constructor = Queue;

/**
 * Adds a task to the taskList
 *
 * @param {Task} task
 * @param {Boolean} [autoReset = true]
 * @returns {Queue} this
**/
queueProto.add = function(task, autoReset) {
	this.taskList.push(task);
	
	if (autoReset !== false) task.reset();
	
	return this;
};

/**
 * Removes a task from the taskList
 *
 * @param {Task} task
 * @returns {Queue} this
**/
queueProto.remove = function(task) {
	var index = this.taskList.indexOf(task);
	
	if (index !== -1) this.taskList.splice(index, 1);
	
	return this;
};

/**
 * Removes all the tasks from the taskList
 *
 * @returns {Queue} this
**/
queueProto.clear = function() {
	var taskList = this.taskList;
	
	while (taskList.length) taskList.pop();
	
	return this;
};

/**
 * Restores a task
 *
 * @param {Task} task
 * @returns {Queue} this
**/
queueProto.restoreTask = function(task) {
	this.remove(task).add(task, true);
	
	return this;
};

/**
 * Executes the provided callback function once per element of taskList
 *
 * @param {Function} callback
 * @returns {Queue} this
**/
queueProto.each = function(callback) {
	this.taskList.forEach(callback, this);
	
	return this;
};

/**
 * Executes all the tasks from the taskList in order
 *
 * @returns {Queue} this
**/
queueProto.perform = (function() {
	function execute(task) {
		if (task.execute() === true) this.remove(task);
	}
	
	return function perform() {
		this.each(execute);
		
		return this;
	};
}());

/**
 * Returns the string value of the queue
 *
 * @returns {String}
**/
queueProto.toString = function() {
	return '[object Queue]';
};
