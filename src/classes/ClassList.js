/**
 * Creates a new ClassList
 *
 * @class ClassList
 * @extends OrderedList
 * @description todoc
**/
function ClassList() {
	OrderedList.call(this);
}

/** @lends ClassList# **/
var classListProto = ClassList.prototype = Object.create(OrderedList.prototype);
classListProto.constructor = ClassList;

/**
 * Same as OrderedList's add method, but makes sure that every item can appear only once
 *
 * @param {*} item
 * @param {int} [orderID]
 * @returns {ClassList} this
**/
classListProto.add = function(item, orderID) {
	item = String(item);

	this.reOrder(item, orderID);

	return this;
};

/**
 * Toggles an item
 *
 * @param {String} item
 * @param {Number} [orderID]
 * @returns {ClassList} this
**/
classListProto.toggle = function(item, orderID) {
	return this.has(item) ? this.remove(item) : this.add(item, orderID);
};

/**
 * Returns the string value of the classList
 *
 * @returns {String}
**/
classListProto.toString = function() {
	return '[object ClassList]';
};
