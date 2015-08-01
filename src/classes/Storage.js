/**
 * Creates a new PublicStorage
 *
 * @class PublicStorage
 * @description todoc
**/
function PublicStorage() {
	/**
	 * The data object of the storage
	 *
	 * @alias PublicStorage#data
	 * @type Object
	**/
	this.data = {};
}

/** @lends PublicStorage# **/
var publicStorageProto = PublicStorage.prototype = Object.create(null);
publicStorageProto.constructor = PublicStorage;

/**
 * Gets data
 *
 * @param {String} key
 * @returns {*}
**/
publicStorageProto.get = function(key) {
	return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : null;
};

/**
 * Sets data
 *
 * @param {String} key
 * @param {*} value
 * @returns {*}
**/
publicStorageProto.set = function(key, value) {
	return this.data[key] = value;
};

/**
 * Edits data
 *
 * @param {Object} source
 * @returns {PublicStorage} this
**/
publicStorageProto.edit = function(source) {
	var hasOwn = Object.prototype.hasOwnProperty,
		data = this.data,
		key;
	
	for (key in source) {
		if (hasOwn.call(source, key)) {
			data[key] = source[key];
		}
	}
	
	return this;
};



/**
 * Creates a new PrivateStorage
 *
 * @class PrivateStorage
 * @description todoc
**/
function PrivateStorage() {
	var hasOwn = Object.prototype.hasOwnProperty,
		data = {};
	
	/**
	 * Returns an item of the storage or null
	 *
	 * @alias PrivateStorage#get
	 * @param {String} key
	 * @returns {?*}
	**/
	this.get = function(key) {
		return hasOwn.call(data, key) ? data[key] : null;
	};
	
	/**
	 * Sets a value of the given key
	 *
	 * @alias PrivateStorage#set
	 * @param {String} key
	 * @param {*} value
	 * @returns {*} value
	**/
	this.set = function(key, value) {
		return data[key] = value;
	};
	
	/**
	 * Sets multiple values of the storage
	 *
	 * @alias PrivateStorage#edit
	 * @param {Object} source
	 * @returns {PrivateStorage} this
	**/
	this.edit = function(source) {
		var key;
		
		for (key in source) {
			if (hasOwn.call(source, key)) {
				data[key] = source[key];
			}
		}
		
		return this;
	};
	
	/**
	 * Returns all data
	 *
	 * @alias PrivateStorage#getAll
	 * @returns {Object}
	**/
	this.getAll = function() {
		var returnValue = {},
			key;
		
		for (key in data) {
			if (hasOwn.call(data, key)) {
				returnValue[key] = data[key];
			}
		}
		
		return returnValue;
	};
}

/** @lends PrivateStorage# **/
var privateStorageProto = PrivateStorage.prototype = Object.create(null);
privateStorageProto.constructor = PrivateStorage;

/**
 * Creates a new Storage
 *
 * @class Storage
 * @description todoc
**/
function Storage() {
	var hasOwn = Object.prototype.hasOwnProperty,
		data = {};
	
	/**
	 * Returns an item of the storage or null
	 *
	 * @alias Storage#get
	 * @param {String} key
	 * @returns {?*}
	**/
	this.get = function(key) {
		return hasOwn.call(data, key) ? data[key] : null;
	};
	
	/**
	 * Sets a value of the given key
	 *
	 * @alias Storage#set
	 * @param {String} key
	 * @param {*} value
	 * @returns {*} value
	**/
	this.set = function(key, value) {
		return data[key] = value;
	};
}

/** @lends Storage# **/
var storageProto = Storage.prototype = Object.create(null);
storageProto.constructor = Storage;
