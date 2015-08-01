/**
 * Copies the values of all enumerable own properties from one or more source objects to a target object
 *
 * @function assign
 * @param {Object} target
 * @param {...Object}
 * @returns {Object}
**/
function assign(target) {
	var sources = Array.prototype.slice.call(arguments, 1),
		i = 0, il = sources.length,
		source;
	
	for (; i < il; i++) {
		source = sources[i];
		
		forIn(source, function(key, value) {
			target[key] = value;
		});
	}
	
	return target;
}

/**
 * Returns a boolean indicating whether an object has the specified property
 *
 * @function has
 * @param {Object} obj
 * @param {String} key
 * @returns {Boolean}
**/
function has(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Copies values from one or more source objects to a target object
 *
 * @function addDefault
 * @param {Object} target
 * @param {...Object}
 * @returns {Object}
**/
function addDefault(target) {
	var sources = Array.prototype.slice.call(arguments, 1),
		i = 0, il = sources.length,
		source;
	
	for (; i < il; i++) {
		source = sources[i];
		
		forIn(source, function(key, value) {
			if (!has(target, key)) target[key] = value;
		});
	}
	
	return target;
}

/**
 * Clones an object
 *
 * @function clone
 * @param {Object} obj
 * @returns {Object}
**/
function clone(obj) {
	return assign({}, obj);
}

/**
 * Returns an array of a given object's own enumerable properties
 *
 * @function keys
 * @param {Object} obj
 * @returns {Array}
**/
function keys(obj) {
	var returnValue = [];
	
	forIn(obj, function(key) {
		returnValue.push(key);
	});
	
	return returnValue;
}

/**
 * Returns an array of a given object's own enumerable values
 *
 * @function values
 * @param {Object} obj
 * @returns {Array}
**/
function values(obj) {
	var returnValue = [];
	
	forIn(obj, function(key, value) {
		returnValue.push(value);
	});
	
	return returnValue;
}

/**
 * Iterates over the enumerable properties of an object
 *
 * @function forIn
 * @param {Object} obj
 * @param {Function} callback
 * @param {Object} [thisArg]
 * @returns {Object}
**/
function forIn(obj, callback, thisArg) {
	var key;
	
	for (key in obj) {
		if (has(obj, key)) {
			if (callback.call(thisArg, key, obj[key], obj) === true) break;
		}
	}
	
	return obj;
}

/**
 * Returns an object with the given properties with the source's values
 *
 * @function getProps
 * @param {Object} obj
 * @param {Array} properties
 * @returns {Object}
**/
function getProps(obj, properties) {
	var returnValue = {},
		i = 0, il = properties.length,
		key;
	
	for (; i < il; i++) {
		key = properties[i];
		
		returnValue[key] = obj[key];
	}
	
	return returnValue;
}
