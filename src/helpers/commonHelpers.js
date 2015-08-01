/**
 * Creates a new empty object, and returns it
 *
 * @function stdClass
 * @returns {Object}
**/
function stdClass() {
	return Object.create(null);
}

/**
 * Creates a new object inherits from the given constructor
 *
 * @function inherit
 * @param {Function} constructor
 * @returns {?Object}
**/
function inherit(constructor) {
	var obj = null;
	
	if (typeof constructor === 'function') {
		obj = Object.create(constructor.prototype);
		constructor.call(obj);
	}
	
	return obj;
}

/**
 * Generates a UUID
 *
 * @function generateUUID
 * @see http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
 * @returns {String}
**/
var generateUUID = (function() {
	var regex = /[xy]/g;
	
	function replace(c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		
		return v.toString(16);
	}
	
	return function generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regex, replace);
	};
}());

/**
 * Converts arguments to Array
 *
 * @function getArgs
 * @param {Arguments} args
 * @param {int} [begin = 0]
 * @param {int} [end = args.length - 1]
 * @returns {Array}
**/
function getArgs(args, begin, end) {
	return Array.prototype.slice.call(args, begin, end);
}

/**
 * Creates a new function
 *
 * @function parseMethod
 * @param {String} method
 * @param {Object} [thisArg]
 * @param {Array} [args]
 * @returns {Function}
 * @todo Replace "@" character globally (if not string) to "this."
**/
var parseMethod = (function() {
	var mustache = /^{{(.*)}}$/;
	
	function isArray(testValue) {
		return Object.prototype.toString.call(testValue) === '[object Array]';
	}
	
	return function parseMethod(method, thisArg, args) {
		var match = String(method).match(mustache), fn;
		
		if (isArray(match)) {
			fn = new Function(isArray(args) ? args.join(',') : '', match[1]);
			
			return typeof thisArg === 'object' ? fn.bind(thisArg) : fn;
		}
		
		return null;
	};
}());

/**
 * Parse a parcentage to number
 *
 * @function parsePercent
 * @param {String} val
 * @param {Number} relative
 * @returns {Number}
**/
var parsePercent = (function() {
	var regX = /[+-]?(?:\d*\.|)\d+/;
	
	return function parsePercent(val, relative) {
		var num;
		
		if (typeof relative !== 'number') return 0;
		
		val = String(val);
		
		num = val.match(regX);
		
		if (num === null) return 0;
		
		return Number(num[0]) * relative / 100;
	};
}());

/**
 * Determines if a given value is percent
 *
 * @function isPercent
 * @param {String} val
 * @returns {Boolean}
**/
function isPercent(val) {
	return typeof val === 'string' && val.slice(-1) === '%';
}

/**
 * Parses a string and returns an integer
 *
 * @function getInt
 * @param {String} str
 * @returns {int}
**/
function getInt(str) {
	return window.parseInt(str, 10);
}

/**
 * Parses a string and returns a float
 *
 * @function getFloat
 * @param {String} str
 * @returns {float}
**/
function getFloat(str) {
	return window.parseFloat(str);
}

/**
 * Generates a number between two values
 *
 * @function rand
 * @param {int} min
 * @param {int} max
 * @returns {int}
**/
function rand(min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}
	
	min |= 0;
	max |= 0;
	
	return (Math.random() * (max - min + 1)) + min | 0;
}

/**
 * Checks if the given number is between the given min and max values
 *
 * @function between
 * @param {Number} n
 * @param {Number} min
 * @param {Number} max
 * @returns {Boolean}
**/
function between(n, min, max) {
	return n >= min && n <= max;
}

/**
 * Returns a number in a range
 *
 * @function range
 * @param {Number} min
 * @param {Number} max
 * @param {Number} n
 * @returns {Number}
**/
function range(min, max, n) {
	return Math.max(min, Math.min(max, n));
}

/**
 * Converts degree to radian
 *
 * @function deg2rad
 * @param {Number} deg
 * @returns {float}
**/
function deg2rad(deg) {
	return deg * Math.PI / 180;
}

/**
 * Repeats a string n times
 *
 * @function repeatChar
 * @param {String} s
 * @param {int} n
 * @returns {String}
**/
function repeatString(s, n) {
	var str = '';
	
	while (n-- > 0) str += s;
	
	return str;
}

/**
 * Outputs an object to the Web Console
 *
 * @function debug
 * @param {*} obj
 * @param {String} message
 * @returns {undefined}
**/
function debug(obj, message) {
	if (message !== undefined) {
		console.info(message);
	}
	
	if (typeof obj === 'object') {
		console.dir(obj);
	} else {
		console.log(obj);
	}
	
	return undefined;
}

/**
 * Outputs a message to the Web Console
 *
 * @function log
 * @param {...String}
 * @returns {undefined}
**/
function log() {
	console.log.apply(console, Array.prototype.slice.call(arguments));
	
	return undefined;
}

/**
 * Outputs a warning to the Web Console
 *
 * @function warning
 * @param {String} message
 * @returns {undefined}
**/
function warning(message) {
	console.warn(message);
	
	return undefined;
}

/**
 * Outputs an error to the Web Console
 *
 * @function error
 * @param {String} message
 * @returns {undefined}
**/
function error(message) {
	console.error(message);
	
	return undefined;
}

/**
 * Throws an error
 *
 * @function die
 * @param {String} message
 * @throws {Error}
**/
function die(message) {
	throw new Error(message);
}

/**
 * Repeats the given function n times
 *
 * @function repeat
 * @param {int} n
 * @param {Function} callback
 * @param {Object} [thisArg]
 * @returns {*} thisArg
**/
function repeat(n, callback, thisArg) {
	var i = -1;
	
	while (++i < n) callback.call(thisArg, i);
	
	return thisArg;
}

/**
 * Modifies an object by complex rules
 *
 * @function use
 * @param {Object} target
 * @param {Object} data
 * @returns {Object} target
**/
var use = (function() {
	var types = ['string', 'number', 'boolean', 'undefined', 'function'],
		toString = Object.prototype.toString;
	
	function inArray(arr, testValue) {
		var i = 0, il = arr.length;
		
		for (; i < il; i++) {
			if (arr[i] === testValue) return true;
		}
		
		return false;
	}
	
	function smartType(testValue) {
		var type = typeof testValue;
		
		if (inArray(types, type)) return type;
		if (testValue === null) return 'null';
		if (toString.call(testValue) === '[object Array]') return 'array';
		
		return 'object';
	}
	
	return function use(target, data) {
		var hasOwn = Object.prototype.hasOwnProperty,
			key, targetVal, dataVal, dataValType, i, il;
		
		for (key in data) {
			if (hasOwn.call(data, key)) {
				targetVal = target[key];
				dataVal = data[key];
				dataValType = smartType(dataVal);
				
				if (targetVal === undefined) continue;
				
				switch (smartType(targetVal)) {
					case 'function':
						if (dataValType === 'array') {
							il = dataVal.length;
							
							if (il === 0) {
								targetVal.call(target);
							} else {
								for (i = 0; i < il; i++) {
									if (smartType(dataVal[i]) === 'array') {
										targetVal.apply(target, dataVal[i]);
									} else {
										targetVal.call(target, dataVal[i]);
									}
								}
							}
						} else {
							targetVal.call(target, dataVal);
						}
						
						break;
					
					case 'string':
					case 'boolean':
					case 'number':
					case 'date':
					case 'undefined':
					case 'null':
						target[key] = dataVal;
						
						break;
					
					case 'array':
						if (dataValType === 'array') {
							targetVal.push.apply(targetVal, dataVal);
						} else {
							targetVal.push(dataVal);
						}
						
						break;
					
					case 'object':
						if (dataValType === 'object') {
							use(targetVal, dataVal);
						} else {
							target[key] = dataVal;
						}
						
						break;
				}
			}
		}
		
		return target;
	};
}());
