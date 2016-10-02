/**
 * Creates a new Collection
 *
 * @class Collection
 * @description todoc
**/
function Collection() {
	this.items = Object.create(null);
}

/** @lends Collection# **/
var collectionProto = Collection.prototype = Object.create(null);
collectionProto.constructor = Collection;

/**
 * List of items
 *
 * @type Object
 * @default null
 * @readonly
**/
collectionProto.items = null;

/**
 * Returns the count of items
 *
 * @returns {int}
**/
collectionProto.count = function() {
	return this.keys().length;
};

/**
 * Sets the value for the key
 *
 * @param {String} key
 * @param {*} item
 * @returns {Collection} this
**/
collectionProto.set = function(key, item) {
	this.items[key] = item;
	
	return this;
};

/**
 * Sets the value for the key, if it doen't exists already
 *
 * @param {String} key
 * @param {*} item
 * @returns {Collection} this
**/
collectionProto.setSafe = function(key, item) {
	if (!this.has(key)) this.items[key] = item;
	
	return this;
};

/**
 * Gets an item
 *
 * @param {String} key
 * @returns {?*}
**/
collectionProto.get = function(key) {
	return this.has(key) ? this.items[key] : null;
};

/**
 * Checks if items contains a specific item
 *
 * @param {String} key
 * @returns {Boolean}
**/
collectionProto.has = function(key) {
	return key in this.items;
};

/**
 * Removes an item
 *
 * @param {String} key
 * @returns {Collection} this
**/
collectionProto.remove = function(key) {
	delete this.items[key];
	
	return this;
};

/**
 * Removes all items
 *
 * @returns {Collection} this
**/
collectionProto.clear = function() {
	this.items = Object.create(null);
	
	return this;
};

/**
 * Executes a provided callback function once per item
 *
 * @param {Function} callback
 * @param {Object} [thisArg]
 * @returns {Collection} this
**/
collectionProto.each = function(callback, thisArg) {
	var i = 0, key;
	
	for (key in this.items) {
		callback.call(thisArg, key, this.items[key], i++);
	}
	
	return this;
};

/**
 * Returns an array of keys
 *
 * @returns {Array}
**/
collectionProto.keys = function() {
	var keys = [], key;
	
	for (key in this.items) keys.push(key);
	
	return keys;
};

/**
 * Returns an array of values
 *
 * @returns {Array}
**/
collectionProto.values = function() {
	var values = [], key;
	
	for (key in this.items) values.push(this.items[key]);
	
	return values;
};

/**
 * Returns all
 *
 * @returns {Object}
**/
collectionProto.all = function() {
	var all = {}, key;
	
	for (key in this.items) all[key] = this.items[key];
	
	return all;
};
