// chillJS[0.1.0]
// Sat Aug 01 2015

/*
The MIT License (MIT)

Copyright (c) 2015 Gábor Bokodi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// File: moduleHeader.js
(function(window) {
'use strict';

// File: helpers/polyfills.js
window.requestAnimationFrame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame;

window.cancelAnimationFrame =
	window.cancelAnimationFrame ||
	window.webkitCancelAnimationFrame ||
	window.mozCancelAnimationFrame ||
	window.msCancelAnimationFrame ||
	window.oCancelAnimationFrame;

// File: helpers/regexHelpers.js
var numRegX = /[+-]?(?:\d*\.|)\d+/;
var lineBreakRegX = /\n/;

/**
 * Returns the first match of the regex in the given string or null
 *
 * @function findFirstRegX
 * @param {RegExp} regX
 * @param {String} str
 * @returns {?String}
**/
function findFirstRegX(regX, str) {
	var val = str.match(regX);
	
	return val === null ? null : val[0];
}

// File: helpers/typeHelpers.js
/**
 * Determines whether a value is Array or not
 *
 * @function isArray
 * @param {*} testValue
 * @returns {Boolean}
**/
function isArray(testValue) {
	return Object.prototype.toString.call(testValue) === '[object Array]';
}

/**
 * Determines whether a value is Boolean or not
 *
 * @function isBoolean
 * @param {*} testValue
 * @returns {Boolean}
**/
function isBoolean(testValue) {
	return typeof testValue === 'boolean';
}

/**
 * Determines whether a value is Function or not
 *
 * @function isFunction
 * @param {*} testValue
 * @returns {Boolean}
**/
function isFunction(testValue) {
	return typeof testValue === 'function';
}

/**
 * Determines whether a value is Object or not
 *
 * @function isObject
 * @param {*} testValue
 * @returns {Boolean}
**/
function isObject(testValue) {
	return Object.prototype.toString.call(testValue) === '[object Object]';
}

/**
 * Determines whether a value is String or not
 *
 * @function isString
 * @param {*} testValue
 * @returns {Boolean}
**/
function isString(testValue) {
	return typeof testValue === 'string';
}

/**
 * Determines whether a value is Number or not
 *
 * @function isNumber
 * @param {*} testValue
 * @returns {Boolean}
**/
function isNumber(testValue) {
	return typeof testValue === 'number';
}

/**
 * Determines whether a value is NaN or not
 *
 * @function isNaN
 * @param {*} testValue
 * @returns {Boolean}
**/
function isNaN(testValue) {
	return testValue !== testValue;
}

/**
 * Determines whether a value is undefined or not
 *
 * @function isUndefined
 * @param {*} testValue
 * @returns {Boolean}
**/
function isUndefined(testValue) {
	return testValue === void 0;
}

/**
 * Determines whether a value is null or not
 *
 * @function isNull
 * @param {*} testValue
 * @returns {Boolean}
**/
function isNull(testValue) {
	return testValue === null;
}

/**
 * Determines whether a value is null or undefined
 *
 * @function isNullOrUndefined
 * @param {*} testValue
 * @returns {Boolean}
**/
function isNullOrUndefined(testValue) {
	return testValue === void 0 || testValue === null;
}

/**
 * Determines whether an object is instance of another object
 *
 * @function is
 * @param {Object} o1
 * @param {Object} o2
 * @returns {Boolean}
**/
function is(o1, o2) {
	return o1 instanceof o2;
}

// File: helpers/commonHelpers.js
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

// File: helpers/stringHelpers.js
/**
 * Determines whether a string begins with the characters of another string
 *
 * @function startsWith
 * @param {String} str
 * @param {String} searchString
 * @returns {Boolean}
**/
function startsWith(str, searchString) {
	return str.indexOf(searchString) === 0;
}

/**
 * Determines whether a string ends with the characters of another string
 *
 * @function endsWith
 * @param {String} str
 * @param {String} searchString
 * @returns {Boolean}
**/
function endsWith(str, searchString) {
	var lastIndex = str.lastIndexOf(searchString);
	
	return lastIndex !== -1 && lastIndex === str.length - searchString.length;
}

/**
 * Capitalizes a given string
 *
 * @function capitalize
 * @param {String} text
 * @returns {String}
**/
var capitalize = (function() {
	var regex = /(?:^|\s)\S/g;
	
	function toUpper(c) {
		return c.toUpperCase();
	}
	
	return function capitalize(text) {
		return text.replace(regex, toUpper);
	};
}());

// File: helpers/arrayHelpers.js
/**
 * Removes item(s) from an array
 *
 * @function remove
 * @param {Array} arr
 * @param {*} removeItem
 * @param {int} [limit = 1]
 * @returns {int} removedCount
**/
function remove(arr, removeItem, limit) {
	var removedCount = 0,
		index;
	
	if (limit === undefined) limit = 1;
	
	while ((index = arr.indexOf(removeItem)) !== -1) {
		arr.splice(index, 1);
		
		if (++removedCount >= limit) break;
	}
	
	return removedCount;
}

/**
 * Empties an array
 *
 * @function empty
 * @param {Array} arr
 * @returns {Array} arr
**/
function empty(arr) {
	while (arr.length > 0) arr.pop();
	
	return arr;
}

/**
 * Checks if an item exists in an array
 *
 * @function inArray
 * @param {Array} arr
 * @param {*} searchItem
 * @returns {Boolean}
**/
function inArray(arr, searchItem) {
	return arr.indexOf(searchItem) !== -1;
}

/**
 * Adds an item to the array if the array doesn't contains it
 *
 * @function addUnique
 * @param {Array} arr
 * @param {*} item
 * @returns {Array}
**/
function addUnique(arr, item) {
	if (!inArray(arr, item)) arr.push(item);
	
	return arr;
}

/**
 * Counts how many times an item exists in an array
 *
 * @function count
 * @param {Array} arr
 * @param {*} searchItem
 * @returns {int}
**/
function count(arr, searchItem) {
	var n = 0;
	
	forEach(arr, function(item) {
		if (item === searchItem) ++n;
	});
	
	return n;
}

/**
 * Returns array
 *
 * @function toArray
 * @param {*} item
 * @returns {Array}
**/
function toArray(item) {
	return Object.prototype.toString.call(item) === '[object Array]' ? item : [item];
}

/**
 * Returns the first item of an array
 *
 * @function first
 * @param {Array} arr
 * @returns {*}
**/
function first(arr) {
	return arr[0];
}

/**
 * Returns the last item of an array
 *
 * @function last
 * @param {Array} arr
 * @returns {*}
**/
function last(arr) {
	return arr.slice(-1)[0];
}

/**
 * Executes a provided callback function once per array element
 *
 * @function forEach
 * @param {Array} arr
 * @param {Function} callback
 * @param {Object} [thisArg]
 * @returns {Array}
**/
function forEach(arr, callback, thisArg) {
	var i = 0,
		il = arr.length;
	
	for (; i < il; i++) {
		if (callback.call(thisArg, arr[i], i, arr) === true) break;
	}
	
	return arr;
}

/**
 * Executes a provided callback function once per array element, and sets it's this value to the currentValue
 *
 * @function callEach
 * @param {Array} arr
 * @param {Function} callback
 * @returns {Array}
**/
function callEach(arr, callback) {
	var i = 0,
		il = arr.length;
	
	for (; i < il; i++) {
		if (callback.call(arr[i], i, arr) === true) break;
	}
	
	return arr;
}

/**
 * Executes a provided callback function once per array element with the given arguments, sets it's this value to the currentValue
 *
 * @function applyEach
 * @param {Array} arr
 * @param {Function} callback
 * @param {...*}
 * @returns {Array}
**/
function applyEach(arr, callback) {
	var args = Array.prototype.slice.call(arguments, 2),
		i = 0,
		il = arr.length;
	
	for (; i < il; i++) {
		callback.apply(arr[i], args);
	}
	
	return arr;
}

/**
 * Executes a provided callback function once per array element, returns a value
 *
 * @function execute
 * @param {Array} arr
 * @param {Function} callback
 * @param {Object} [thisArg]
 * @returns {Array}
**/
function execute(arr, callback, thisArg) {
	var i = 0,
		il = arr.length,
		returnValue;
	
	for (; i < il; i++) {
		returnValue = callback.call(thisArg, arr[i], i, arr);
		
		if (returnValue !== undefined) return returnValue;
	}
	
	return null;
}

/**
 * Fills an array
 *
 * @function fillArray
 * @param {Array} arr
 * @param {*} fillValue
 * @returns {Array}
**/
function fillArray(arr, fillValue) {
	if (typeof fillValue === 'function') {
		forEach(arr, function(item, index, arr) {
			arr[index] = fillValue(item, index, arr);
		});
	} else {
		forEach(arr, function(item, index) {
			arr[index] = fillValue;
		});
	}
	
	return arr;
}

/**
 * Creates a new array
 *
 * @function createArray
 * @param {int} length
 * @param {*} fillValue
 * @returns {Array}
**/
function createArray(length, fillValue) {
	return fillArray(new Array(length), fillValue);
}

// File: helpers/objectHelpers.js
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

// File: helpers/DOMHelpers.js
/**
 * window.document
 *
 * @global
**/
var doc = window.document,

/**
 * window.document.body
 *
 * @global
**/
body = doc.body;

/**
 * Cancels the event if it is cancelable, without stopping further propagation of the event
 *
 * @function preventDefault
 * @param {Event} e
 * @returns {Boolean} false
**/
function preventDefault(e) {
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
	
	return false;
}

/**
 * Prevents further propagation of the current event
 *
 * @function stopPropagation
 * @param {Event} e
 * @returns {Boolean} false
**/
function stopPropagation(e) {
	e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	
	return false;
}

/**
 * Checks if the browser support audios
 *
 * @function ifBrowserSupportAudio
 * @returns {Boolean}
**/
function ifBrowserSupportAudio() {
	return window.Audio !== undefined;
}

/**
 * Gets the preferred audio type
 *
 * @function getPreferredAudioType
 * @returns {?String}
**/
function getPreferredAudioType() {
	var audioTypes, i, il, audio;
	
	if (ifBrowserSupportAudio()) {
		audioTypes = ['ogg', 'mp3', 'mpeg', 'wav'];
		i = 0;
		il = audioTypes.length;
		audio = new Audio();
		
		for (; i < il; i++) {
			if (audio.canPlayType('audio/' + audioTypes[i])) {
				return audioTypes[i];
			}
		}
	}
	
	return null;
}

/**
 * Plays an audio
 *
 * @function playAudio
 * @param {Audio} audio
 * @param {int} [volume]
 * @param {Boolean} [reset]
 * @param {Function} [callback]
 * @returns {Audio}
**/
function playAudio(audio, volume, reset, callback) {
	var callbackWrapper;
	
	if (audio.readyState > 0) {
		if (reset === true) {
			audio.pause();
			audio.currentTime = 0;
		}
		
		if (typeof callback === 'function') {
			callbackWrapper = function(e) {
				callback.call(this, e);
				audio.removeEventListener('ended', callbackWrapper);
			};
			
			audio.addEventListener('ended', callbackWrapper);
		}
		
		if (volume !== undefined) {
			audio.volume = Math.min(Math.max(0, volume / 100), 1);
		}
		
		audio.play();
	}
	
	return audio;
}

/**
 * Creates an HTML element
 *
 * @function createElement
 * @param {String} tagName
 * @param {HTMLElement} [parentElement]
 * @param {String} [textContent]
 * @returns {HTMLElement}
**/
function createElement(tagName, parentElement, textContent) {
	var elem = window.document.createElement(tagName);
	
	if (parentElement !== undefined) {
		parentElement.appendChild(elem);
	}
	
	if (textContent !== undefined) {
		elem.textContent = textContent;
	}
	
	return elem;
}

// File: classes/HTTP.js
/**
 * HTTP namespace
 *
 * @namespace HTTP
 * @description todoc
**/
var HTTP = Object.create(null);

/**
 * HTTP get
 *
 * @method
 * @name HTTP.get
 * @param {String} url
 * @param {Function} callback
 * @returns {XMLHttpRequest}
 * @todo Error handling
**/
HTTP.get = (function() {
	function onLoad(callback, e) {
		var xmlhttp = e.target;
		
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			callback(xmlhttp.responseText);
		}
	}
	
	return function get(url, callback) {
		var httpRequest = new XMLHttpRequest();
		
		httpRequest.open('GET', url, true);
		httpRequest.onreadystatechange = onLoad.bind(httpRequest, callback);
		httpRequest.send(null);
		
		return httpRequest;
	};
}());

/**
 * HTTP getJSON
 *
 * @memberof HTTP
 * @param {String} url
 * @param {Function} callback
 * @returns {XMLHttpRequest}
 * @todo Invalid JSON handling
**/
HTTP.getJSON = function(url, callback) {
	return HTTP.get(url, function(data) {
		callback(JSON.parse(data));
	});
};

/**
 * HTTP post
 *
 * @memberof HTTP
 * @param {String} url
 * @param {String} data
 * @param {Function} callback
 * @returns {XMLHttpRequest}
 * @todo Error handling
**/
HTTP.post = function(url, data, callback) {
	var httpRequest = new XMLHttpRequest();
	
	httpRequest.open('POST', url, true);
	httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	httpRequest.onreadystatechange = callback;
	httpRequest.send(null);
	
	return httpRequest;
};

// File: classes/Enum.js
/**
 * Creates a new Enum
 *
 * @class Enum
 * @param {...*}
 * @description todoc
**/
function Enum() {
	enumAssign.apply(this, Array.prototype.slice.call(arguments));
}

/**
 * Loops through the given enum
 *
 * @memberof Enum
 * @static
 * @param {Enum} enumerable
 * @param {Function} callback
 * @returns {Enum}
**/
Enum.each = function(enumerable, callback) {
	var hasOwn = Object.prototype.hasOwnProperty
	, key;
	
	for (key in enumerable) {
		if (hasOwn.call(enumerable, key)) {
			callback(key, enumerable[key]);
		}
	}
	
	return enumerable;
};

/** @lends Enum# **/
var enumProto = Enum.prototype = Object.create(null);
enumProto.constructor = Enum;

function enumAssign() {
	var i = 0
	, il = arguments.length
	, toString = Object.prototype.toString
	, hasOwn = Object.prototype.hasOwnProperty
	, arg
	, key;
	
	for (; i < il; i++) {
		arg = arguments[i];
		
		if (typeof arg === 'string') {
			this[arg] = arg;
		} else if (toString.call(arg) === '[object Array]') {
			enumAssign.apply(this, arg);
		} else if (toString.call(arg) === '[object Object]') {
			for (key in arg) {
				if (hasOwn.call(arg, key)) {
					this[key] = arg[key];
				}
			}
		}
	}
}

// File: classes/Event.js
/**
 * Creates a new Event
 *
 * @class Event
 * @param {String} type
 * @description todoc
**/
function Event(type) {
	this.type = type;
	this.data = {};
	this.timeStamp = new Date().getTime();
}

/** @lends Event# **/
var eventProto = Event.prototype = Object.create(null);
eventProto.constructor = Event;

/**
 * The type of the event
 *
 * @type String
 * @default null
 * @readonly
**/
eventProto.type = null;

/**
 * The original event
 *
 * @type Event
 * @default null
 * @readonly
**/
eventProto.originalEvent = null;

/**
 * The target of the event
 *
 * @type Object
 * @default null
 * @readonly
**/
eventProto.target = null;

/**
 * Custom data of the event
 *
 * @type Object
 * @default null
 * @readonly
**/
eventProto.data = null;

/**
 * The time (in milliseconds since the epoch) at which the event was created
 *
 * @type Number
 * @default 0
 * @readonly
*/
eventProto.timeStamp = 0;

/**
 * Indicates whether the event is cancelable or not
 *
 * @type Boolean
 * @default true
*/
eventProto.cancelable = true;

/**
 * Returns a boolean indicating whether or not eventProto.preventDefault() was called on the event
 *
 * @type Boolean
 * @default false
*/
eventProto.defaultPrevented = false;

/**
 * Returns a boolean indicating whether or not eventProto.stopPropagation() was called on the event
 *
 * @type Boolean
 * @default false
*/
eventProto.propagationStopped = false;

/**
 * The return value of the event
 *
 * @type *
 * @default null
*/
eventProto.returnValue = null;

/**
 * Cancels the event if it is cancelable, without stopping further propagation of the event
 *
 * @returns {Event} this
*/
eventProto.preventDefault = function() {
	if (this.cancelable === true) {
		this.defaultPrevented = true;
	}
	
	return this;
};

/**
 * Prevents further propagation of the current event
 *
 * @returns {Event} this
*/
eventProto.stopPropagation = function() {
	this.propagationStopped = true;
	
	return this;
};

/**
 * Returns the string value of the event
 *
 * @returns {String}
**/
eventProto.toString = function() {
	return this.type + ' Event';
};

// File: classes/EventTarget.js
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

// File: classes/OrderedList.js
/**
 * Creates a new OrderedList
 *
 * @class OrderedList
 * @description todoc
**/
function OrderedList() {
	var list = Object.create(null)
	, isDirty = true;
	
	/**
	 * The number of items in the OrderedList
	 *
	 * @alias OrderedList#count
	 * @type int
	 * @readonly
	**/
	this.count = 0;
	
	/**
	 * Adds an item to the OrderedList
	 *
	 * @alias OrderedList#add
	 * @param {*} item
	 * @param {int} [orderID]
	 * @returns {OrderedList} this
	**/
	this.add = function(item, orderID) {
		if (!(typeof orderID === 'number' && orderID === orderID | 0 && isFinite(orderID))) {
			orderID = this.lastID() || 0;
		}
		
		if (list[orderID] === undefined) {
			list[orderID] = [];
			isDirty = true;
		}
		
		list[orderID].push(item);
		
		++this.count;
		
		return this;
	};
	
	/**
	 * Adds an item to the OrderedList exactly before the given reference item
	 *
	 * @alias OrderedList#addBefore
	 * @param {*} item
	 * @param {*} reference
	 * @returns {OrderedList} this
	**/
	this.addBefore = function(item, reference) {
		var orderID = this.getOrderOf(reference)
		, index;
		
		if (orderID !== null) {
			index = list[orderID].indexOf(reference);
			
			if (index !== -1) {
				list[orderID].splice(index, 0, item);
				
				++this.count;
			}
		}
		
		return this;
	};
	
	/**
	 * Adds an item to the OrderedList exactly after the given reference item
	 *
	 * @alias OrderedList#addAfter
	 * @param {*} item
	 * @param {*} reference
	 * @returns {OrderedList} this
	**/
	this.addAfter = function(item, reference) {
		var orderID = this.getOrderOf(reference)
		, index;
		
		if (orderID !== null) {
			index = list[orderID].indexOf(reference);
			
			if (index !== -1) {
				list[orderID].splice(index + 1, 0, item);
				
				++this.count;
			}
		}
		
		return this;
	};
	
	/**
	 * Removes an item from the OrderedList
	 *
	 * @alias OrderedList#remove
	 * @param {*} item
	 * @returns {?*} removed
	**/
	this.remove = function(item) {
		var orderID = this.getOrderOf(item)
		, removed = null
		, index;
		
		if (orderID !== null) {
			index = list[orderID].indexOf(item);
			
			if (index !== -1) {
				removed = list[orderID].splice(index, 1)[0];
				
				--this.count;
			}
		}
		
		return removed;
	};
	
	/**
	 * Checks if the OrderedList contains a specific item
	 *
	 * @alias OrderedList#has
	 * @param {*} item
	 * @returns {Boolean}
	**/
	this.has = function(item) {
		return this.getOrderOf(item) !== null;
	};
	
	/**
	 * Changes the place of the given item to the given order
	 *
	 * @alias OrderedList#reOrder
	 * @param {*} item
	 * @param {int} orderID
	 * @returns {OrderedList} this
	**/
	this.reOrder = function(item, orderID) {
		return this.remove(item).add(item, orderID);
	};
	
	/**
	 * Removes all items from the OrderedList
	 *
	 * @alias OrderedList#clear
	 * @returns {OrderedList} this
	**/
	this.clear = function() {
		this.order = {};
		
		this.count = 0;
		isDirty = true;
		
		return this;
	};
	
	/**
	 * Executes a provided callback function once per item in ascending order
	 *
	 * @alias OrderedList#each
	 * @param {Function} callback
	 * @param {*} [thisArg]
	 * @returns {OrderedList} this
	**/
	this.each = function(callback, thisArg) {
		var i = 0;
		
		this.getOrders().forEach(function(orderID) {
			list[orderID].forEach(function(item) {
				callback.call(thisArg, item, i++);
			});
		});
		
		return this;
	};
	
	/**
	 * Executes a provided callback function once per item in descending, stops when the callback's return value is not undefined and returns
	 *
	 * @alias OrderedList#execute
	 * @param {Function} callback
	 * @param {*} [thisArg]
	 * @returns {?*}
	**/
	this.execute = function(callback, thisArg) {
		var order = this.getOrders()
		, i = 0
		, j = order.length - 1
		, k, items, returnValue;
		
		for (; j >= 0; --j) {
			items = list[order[j]];
			k = items.length - 1;
			
			for (; k >= 0; --k) {
				returnValue = callback.call(thisArg, items[k], i++);
				
				if (returnValue !== undefined) return returnValue;
			}
		}
		
		return null;
	};
	
	/**
	 * Returns the lowest orderID of the OrderedList
	 *
	 * @alias OrderedList#firstID
	 * @returns {?int}
	**/
	this.firstID = function() {
		var id = this.getOrders()[0];
		
		return id === undefined ? null : id;
	};
	
	/**
	 * Returns the highest orderID of the OrderedList
	 *
	 * @alias OrderedList#lastID
	 * @returns {?int}
	**/
	this.lastID = function() {
		var id = this.getOrders().slice(-1)[0];
		
		return id === undefined ? null : id;
	};
	
	/**
	 * Returns the first element of the lowset orderID
	 *
	 * @alias OrderedList#first
	 * @returns {?*}
	**/
	this.first = function() {
		var items = list[this.firstID()];
		
		return items !== undefined && items.length > 0 ? items[0] : null;
	};
	
	/**
	 * Returns the last element of the highest orderID
	 *
	 * @alias OrderedList#last
	 * @returns {?*}
	**/
	this.last = function() {
		var items = list[this.lastID()];
		
		return items !== undefined && items.length > 0 ? items.slice(-1)[0] : null;
	};
	
	/**
	 * Returns an array of all the orderIDs in ascending order
	 *
	 * @method
	 * @name OrderedList#getOrders
	 * @returns {Array}
	**/
	this.getOrders = (function() {
		var cache = null;
		
		function sortFn(a, b) {
			return a - b;
		}
		
		return function getOrders() {
			if (isDirty) {
				cache = Object.keys(list).sort(sortFn);
				isDirty = false;
			}
			
			return cache;
		};
	}());
	
	/**
	 * Returns an array of all the items
	 *
	 * @alias OrderedList#all
	 * @returns {Array}
	**/
	this.all = function() {
		var items = [];
		
		this.each(function(item) {
			items.push(item);
		});
		
		return items;
	};
	
	/**
	 * Returns the orderID of the given item
	 *
	 * @alias OrderedList#getOrderOf
	 * @param {*} item
	 * @returns {?int}
	**/
	this.getOrderOf = function(item) {
		var returnValue = null,
			hasOwn = Object.prototype.hasOwnProperty,
			orderID;
		
		for (orderID in list) {
			if (hasOwn.call(list, orderID)) {
				if (list[orderID].indexOf(item) !== -1) {
					returnValue = orderID;
					
					break;
				}
			}
		}
		
		return returnValue;
	};
}

/** @lends OrderedList# **/
var orderedListProto = OrderedList.prototype = Object.create(null);
orderedListProto.constructor = OrderedList;

/**
 * Returns the string value of the orderedList
 *
 * @returns {String}
**/
orderedListProto.toString = function() {
	return '[object OrderedList]';
};

// File: classes/Storage.js
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

// File: classes/Vector2.js
/**
 * Creates a Vector2
 *
 * @class Vector2
 * @param {Number} [x = 0]
 * @param {Number} [y = 0]
 * @description todoc
**/
function Vector2(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

/** @lends Vector2# **/
var vector2Proto = Vector2.prototype = Object.create(null);
vector2Proto.constructor = Vector2;

/**
 * The x position of the vector
 *
 * @type Number
 * @default 0
**/
vector2Proto.x = 0;

/**
 * The y position of the vector
 *
 * @type Number
 * @default 0
**/
vector2Proto.y = 0;

/**
 * Sets the x and y values of the vector
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {Vector2} this
**/
vector2Proto.set = function(x, y) {
	this.x = x;
	this.y = y;
	
	return this;
};

/**
 * Sets the x value of the vector
 *
 * @param {Number} x
 * @returns {Vector2} this
**/
vector2Proto.setX = function(x) {
	this.x = x;
	
	return this;
};

/**
 * Sets the y value of the vector
 *
 * @param {Number} y
 * @returns {Vector2} this
**/
vector2Proto.setY = function(y) {
	this.y = y;
	
	return this;
};

/**
 * Modifies the x and y values of the vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.add = function(v) {
	this.x += v.x;
	this.y += v.y;
	
	return this;
};

/**
 * Sets the x and y values of the vector to the summ of the two given vectors
 *
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @returns {Vector2} this
**/
vector2Proto.addVectors = function(v1, v2) {
	this.x = v1.x + v2.x;
	this.y = v1.y + v2.y;
	
	return this;
};

/**
 * Modifies the x and y values of the vector by the given scalar value
 *
 * @param {Number} s
 * @returns {Vector2} this
**/
vector2Proto.addScalar = function(s) {
	this.x += s;
	this.y += s;
	
	return this;
};

/**
 * Modifies the x and y values of the vector by the given vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.sub = function(v) {
	this.x -= v.x;
	this.y -= v.y;
	
	return this;
};

/**
 * Sets the x and y values of the vector to the subtraction of the two given vectors
 *
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @returns {Vector2} this
**/
vector2Proto.subVectors = function(v1, v2) {
	this.x = v1.x - v2.x;
	this.y = v1.y - v2.y;
	
	return this;
};

/**
 * Modifies the x and y values of the vector by the given scalar value
 *
 * @param {Number} s
 * @returns {Vector2} this
**/
vector2Proto.subScalar = function(s) {
	this.x -= s;
	this.y -= s;
	
	return this;
};

/**
 * Multiplies the x and y values of the vector by the given vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.multiply = function(v) {
	this.x *= v.x;
	this.y *= v.y;
	
	return this;
};

/**
 * Multiplies the x and y values of the vector by the given scalar value
 *
 * @param {Number} s
 * @returns {Vector2} this
**/
vector2Proto.multiplyScalar = function(s) {
	this.x *= s;
	this.y *= s;
	
	return this;
};

/**
 * Divides the x and y values of the vector by the given vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.divide = function(v) {
	this.x = v.x === 0 ? 0 : this.x / v.x;
	this.y = v.y === 0 ? 0 : this.y / v.y;
	
	return this;
};

/**
 * Divides the x and y values of the vector by the given scalar value
 *
 * @param {Number} s
 * @returns {Vector2} this
**/
vector2Proto.divideScalar = function(s) {
	this.x = s === 0 ? 0 : this.x / s;
	this.y = s === 0 ? 0 : this.y / s;
	
	return this;
};

/**
 * Sets the vector x and y values to the minimum from it's value and the given vector's value
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.min = function(v) {
	if (this.x > v.x) this.x = v.x;
	if (this.y > v.y) this.y = v.y;
	
	return this;
};

/**
 * Sets the vector x and y values to the maximum from it's value and the given vector's value
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.max = function(v) {
	if (this.x < v.x) this.x = v.x;
	if (this.y < v.y) this.y = v.y;
	
	return this;
};

/**
 * Sets the vector x and y values to the largest integer less than or equal to it's value
 *
 * @returns {Vector2} this
**/
vector2Proto.floor = function() {
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
	
	return this;
};

/**
 * Sets the vector x and y values to the smallest integer greater than or equal to it's value
 *
 * @returns {Vector2} this
**/
vector2Proto.ceil = function() {
	this.x = Math.ceil(this.x);
	this.y = Math.ceil(this.y);
	
	return this;
};

/**
 * Sets the vector x and y values to the nearest integer to it's value
 *
 * @returns {Vector2} this
**/
vector2Proto.round = function() {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	
	return this;
};

/**
 * Negates the vectors x and y values
 *
 * @returns {Vector2} this
**/
vector2Proto.negate = function() {
	this.x = -this.x;
	this.y = -this.y;
	
	return this;
};

/**
 * Rotates the vector by a given radian
 *
 * @param {Number} rad
 * @returns {Vector2} this
**/
vector2Proto.rotate = function(rad) {
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	
	var x = this.x * cos - this.y * sin;
	var y = this.x * sin + this.y * cos;
	
	this.x = x;
	this.y = y;
	
	return this;
};

/**
 * Sets the length of the vector to the length of the given vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.setLength = function(v) {
	this.normalize().multiplyScalar(v.length());
	
	return this;
};


/**
 * Returns the dot product between this and the given vector
 *
 * @param {Vector2} v
 * @returns {Number}
**/
vector2Proto.dot = function(v) {
	return this.x * v.x + this.y * v.y;
};

/**
 * Returns the 2D cross product between this and the given vector
 *
 * @param {Vector2} v
 * @returns {Number}
**/
vector2Proto.cross = function(v) {
	return this.x * v.y - this.y * v.x;
};

/**
 * Returns the length of the vector
 *
 * @returns {Number}
**/
vector2Proto.length = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * Normalizes the vector
 *
 * @returns {Vector2} this
**/
vector2Proto.normalize = function() {
	return this.divideScalar(this.length());
};

/**
 * Rotates the vector to a given angle
 *
 * @param {Number} rad
 * @returns {Vector2} this
**/
vector2Proto.toAngle = function(rad) {
	this.rotate(2 * Math.PI - Math.atan2(this.y, this.x) + rad);
	
	return this;
};

/**
 * Projects the vector to the given 2D line
 *
 * @param {Line2} line
 * @returns {Vector2}
**/
vector2Proto.projectTo = function(line) {
	var bs = line.start;
	var bd = line.delta();
	var dir = this.angleTo(bd) > 0 ? new Vector2(bd.y, -bd.x) : new Vector2(-bd.y, bd.x);
	
	var u = (this.y * bd.x + bd.y * bs.x - bs.y * bd.x - bd.y * this.x) / (dir.x * bd.y - dir.y * bd.x);
	var v = (this.x + dir.x * u - bs.x) / bd.x;
	
	if (u < 0 || v < 0) return null;
	
	return new Vector2(this.x + dir.x * u, this.y + dir.y * u);
};

/**
 * Returns the distance between this and the given vector
 *
 * @param {Vector2} v
 * @returns {Number}
**/
vector2Proto.distanceTo = function(v) {
	var dx = this.x - v.x;
	var dy = this.y - v.y;
	
	return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Returns the angle between this and the given vector
 *
 * @param {Vector2} v
 * @returns {Number}
**/
vector2Proto.angleTo = function(v) {
	return Math.atan2(v.cross(this), v.dot(this));
};

/**
 * Determines if the given vector is equal to this vector
 *
 * @param {Vector2} v
 * @returns {Boolean}
**/
vector2Proto.equals = function(v) {
	return this.x === v.x && this.y === v.y;
};

/**
 * Copies the given vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.copy = function(v) {
	this.x = v.x;
	this.y = v.y;
	
	return this;
};

/**
 * Clones the vector
 *
 * @returns {Vector2}
**/
vector2Proto.clone = function() {
	return new this.constructor(this.x, this.y);
};

/**
 * Returns the string value of the vector
 *
 * @returns {String}
**/
vector2Proto.toString = function() {
	return 'Vector2 at ' + this.x + ' ' + this.y;
};

// File: classes/Screen.js
/**
 * Creates a new Screen
 *
 * @class Screen
 * @description todoc
**/
function Screen() {
	this.pos = new Vector2();
}

/** @lends Screen# **/
var screenProto = Screen.prototype = Object.create(null);
screenProto.constructor = Screen;

/**
 * The position of the screen
 *
 * @type Vector2
 * @default null
 * @readonly
**/
screenProto.pos = null;

/**
 * The width of the screen
 *
 * @type Number
 * @default 0
**/
screenProto.width = 0;

/**
 * The height of the screen
 *
 * @type Number
 * @default 0
**/
screenProto.height = 0;

/**
 * Returns the string value of the screen
 *
 * @returns {String}
**/
screenProto.toString = function() {
	return 'Screen[' + this.width + ', ' + this.height + '] at ' + this.pos.x + ', ' + this.pos.y;
};

// File: classes/Cursor.js
/**
 * Creates a new Cursor
 *
 * @class Cursor
 * @extends Vector2
 * @param {String} type
 * @description todoc
**/
function Cursor(type) {
	Vector2.call(this);
	
	this.type = type;
}

/** @lends Cursor# **/
var cursorProto = Cursor.prototype = Object.create(Vector2.prototype);
cursorProto.constructor = Cursor;

/**
 * The type of the cursor
 *
 * @type String
 * @default 'mouse'
 * @readonly
**/
cursorProto.type = 'mouse';

/**
 * The state of the cursor
 *
 * @type Boolean
 * @default false
 * @readonly
**/
cursorProto.onScreen = false;

/**
 * Returns the string value of the cursor
 *
 * @returns {String}
**/
cursorProto.toString = function() {
	return 'Cursor at ' + this.x + ', ' + this.y;
};

// File: classes/ClassList.js
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
 * @param {String} item
 * @param {Number} [orderID]
 * @returns {ClassList} this
**/
classListProto.add = function(item, orderID) {
	return this.reOrder(item, orderID);
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

// File: classes/Loader.js
/**
 * Creates a new Loader
 *
 * @class Loader
 * @extends EventTarget
 * @description todoc
 * @param {String} [basePath = '/']
**/
function Loader(basePath) {
	EventTarget.call(this);
	
	this.reset();
}

/**
 * The status of the loader
 *
 * @memberof Loader
 * @property IMG
 * @type String
 * @static
 * @const
**/
Loader.IMG = 'Image';

/**
 * The status of the loader
 *
 * @memberof Loader
 * @property AUDIO
 * @type String
 * @static
 * @const
**/
Loader.AUDIO = 'Audio';

/** @lends Loader# **/
var loaderProto = Loader.prototype = Object.create(EventTarget.prototype);
loaderProto.constructor = Loader;

/**
 * The status of the loader
 *
 * @type String
 * @default 'pending'
 * @readonly
**/
loaderProto.status = 'pending';

/**
 * The loading queue of the loader
 *
 * @type Array
 * @default null
 * @readonly
**/
loaderProto.loadQueue = null;

/**
 * List of functions to set the queued element's src
 *
 * @type Array
 * @default null
 * @readonly
**/
loaderProto.setPathList = null;

/**
 * Starts the loader
 *
 * @returns {Loader} this
**/
loaderProto.start = function() {
	var setPath;
	
	this.emit('start');
	
	while (setPath = this.setPathList.pop()) setPath();
	
	if (this.loadQueue.length === 0) {
		this.status = 'complete';
		this.emit('complete');
	} else {
		this.status = 'processing';
	}
	
	return this;
};

/**
 * Clears the loader
 *
 * @returns {Loader} this
**/
loaderProto.clear = function() {
	this.loadQueue = [];
	this.setPathList = [];
	
	return this;
};

/**
 * Resets the loader
 *
 * @returns {Loader} this
**/
loaderProto.reset = function() {
	this.status = 'pending';
	
	this.clear();
	this.offAll();
	
	return this;
};

/**
 * Loads an item
 *
 * @param {String} type
 * @param {String} path
 * @param {Function} [callback]
 * @returns {?*}
**/
loaderProto.load = function(type, path, callback) {
	var method = this['load' + type];
	
	if (typeof method === 'function') {
		return method.call(this, path, callback, true);
	}
	
	return null;
};

/**
 * Loads an image
 *
 * @param {String} path
 * @param {Function} [callback]
 * @param {Boolean} [autoLoad]
 * @returns {Image}
**/
loaderProto.loadImage = function(path, callback, autoLoad) {
	var scope = this
	, img = new Image()
	, listener = function(e) {
		var loadEvent = new LoadEvent(e.type, img);
		
		loadEvent.originalEvent = e;
		loadEvent.data.type = Loader.IMG;
		loadEvent.data.src = path;
		
		scope.remove(img);
		
		if (!autoLoad) scope.emit(e.type, loadEvent);
		if (typeof callback === 'function') callback.call(img, e);
	};
	
	img.addEventListener('load', listener);
	img.addEventListener('error', listener);
	
	if (autoLoad === true) img.src = path;
	
	return img;
};

/**
 * Loads an audio
 *
 * @param {String} path
 * @param {Function} [callback]
 * @param {Boolean} [autoLoad]
 * @returns {Audio}
**/
loaderProto.loadAudio = function(path, callback, autoLoad) {
	var scope = this
	, audio = new Audio()
	, listener = function(e) {
		var loadEvent = new LoadEvent(e.type, audio);
		
		loadEvent.originalEvent = e;
		loadEvent.data.type = Loader.AUDIO;
		loadEvent.data.src = path;
		
		scope.remove(audio);
		
		if (!autoLoad) scope.emit(e.type, loadEvent);
		if (typeof callback === 'function') callback.call(audio, e);
	};
	
	audio.addEventListener('canplaythrough', listener);
	audio.addEventListener('error', listener);
	
	if (autoLoad) audio.src = path;
	
	return audio;
};

/**
 * Adds an item to the loading queue
 *
 * @param {String} type
 * @param {String} path
 * @returns {?*}
**/
loaderProto.add = function(type, path) {
	var method = this['add' + type];
	
	if (typeof method === 'function') {
		return method.call(this, path);
	}
	
	return null;
};

/**
 * Adds an image to the loading queue
 *
 * @param {String} path
 * @returns {Image}
**/
loaderProto.addImage = function(path) {
	var scope = this
	, img = this.loadImage(path, null, false);
	
	this.setPathList.push(function() { img.src = path; });
	this.loadQueue.push(img);
	
	return img;
};

/**
 * Adds an audio to the loading queue
 *
 * @param {String} path
 * @returns {Audio}
**/
loaderProto.addAudio = function(path) {
	var scope = this
	, audio = this.loadAudio(path, null, false);
	
	this.setPathList.push(function() { audio.src = path; });
	this.loadQueue.push(audio);
	
	return audio;
};

/**
 * Removes an item from the loading queue
 *
 * @param {*} item
 * @returns {?*}
 * @todo Remove function from setPathList
**/
loaderProto.remove = function(item) {
	var index = this.loadQueue.indexOf(item)
	, removed;
	
	if (index !== -1) {
		removed = this.loadQueue.splice(index, 1)[0];
		
		if (this.loadQueue.length === 0) this.emit('complete');
		
		return removed;
	}
	
	return null;
};

// File: classes/Queue.js
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
queueProto.perform = function() {
	this.each(function(task) {
		if (task.execute() === true) this.remove(task);
	});
	
	return this;
};

/**
 * Returns the string value of the queue
 *
 * @returns {String}
**/
queueProto.toString = function() {
	return '[object Queue]';
};

// File: classes/Task.js
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

// File: classes/Collection.js
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
 * Checks if the items contains a specific item
 *
 * @param {String} key
 * @returns {Boolean}
**/
collectionProto.has = function(key) {
	// return Object.prototype.toString.call(this.items, key);
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

// File: classes/eventTypes/MouseEvent.js
/**
 * Creates a new MouseEvent
 *
 * @class MouseEvent
 * @extends Event
 * @param {String} eventType
 * @param {Number} x
 * @param {Number} y
 * @param {String} button
 * @description todoc
**/
function MouseEvent(eventType, x, y, button) {
	Event.call(this, eventType);
	
	this.x = x;
	this.y = y;
	this.button = button;
}

/** @lends MouseEvent# **/
var mouseEventProto = MouseEvent.prototype = Object.create(Event.prototype);
mouseEventProto.constructor = MouseEvent;

/**
 * The x position
 *
 * @type Number
 * @default 0
 * @readonly
**/
mouseEventProto.x = 0;

/**
 * The y position
 *
 * @type Number
 * @default 0
 * @readonly
**/
mouseEventProto.y = 0;

/**
 * The button of the event
 *
 * @type String
 * @default null
 * @readonly
**/
mouseEventProto.button = null;

// File: classes/eventTypes/KeyboardEvent.js
/**
 * Creates a new KeyboardEvent
 *
 * @class KeyboardEvent
 * @extends Event
 * @param {String} eventType
 * @param {int} keyCode
 * @description todoc
**/
function KeyboardEvent(eventType, keyCode) {
	Event.call(this, eventType);
	
	this.keyCode = keyCode;
	this.character = String.fromCharCode(keyCode).toLowerCase();
}

/** @lends KeyboardEvent# **/
var keyboardEventProto = KeyboardEvent.prototype = Object.create(Event.prototype);
keyboardEventProto.constructor = KeyboardEvent;

/**
 * The keyCode of the event
 *
 * @type int
 * @default null
 * @readonly
**/
keyboardEventProto.keyCode = null;

/**
 * The character of the event
 *
 * @type String
 * @default null
 * @readonly
**/
keyboardEventProto.character = null;

// File: classes/eventTypes/DragEvent.js
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

// File: classes/eventTypes/LoadEvent.js
/**
 * Creates a new LoadEvent
 *
 * @class LoadEvent
 * @extends Event
 * @param {String} eventType
 * @param {*} target
 * @description todoc
**/
function LoadEvent(eventType, target) {
	Event.call(this, eventType);
	
	this.target = target;
}

/** @lends LoadEvent# **/
var loadEventProto = LoadEvent.prototype = Object.create(Event.prototype);
loadEventProto.constructor = LoadEvent;

// File: classes/eventTypes/CollisionEvent.js
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

// File: core/utils/enums.js
/**
 * $enums namespace
 *
 * @namespace $enums
 * @description todoc
**/
var $enums = stdClass();

/**
 * Enumeration of the element flow types
 *
 * @memberof $enums
 * @type Enum
 * @enum {String}
 * @readonly
**/
$enums.ELEMENT_FLOWS = new Enum('none', 'horizontal', 'vertical');

// File: core/utils/elements.js
/**
 * $elements namespace
 *
 * @namespace $elements
 * @description todoc
**/
var $elements = stdClass();

/**
 * List of types
 *
 * @memberof $elements
 * @type Object
**/
$elements.types = stdClass();

/**
 * Adds a type
 *
 * @memberof $elements
 * @param {String} type
 * @param {Function} elementConstructor
 * @param {Boolean} [instantiatable = true]
 * @param {Boolean} [extendable = true]
 * @returns {Object} $elements
**/
$elements.addType = function(type, elementConstructor, instantiatable, extendable) {
	this.types[type] = assign(stdClass(), {
		constructor: elementConstructor,
		instantiatable: instantiatable !== false,
		extendable: extendable !== false
	});
	
	return this;
};

/**
 * Checks if $elements contains a specific element type
 *
 * @memberof $elements
 * @param {String} type
 * @returns {Boolean}
**/
$elements.hasType = function(type) {
	return type in this.types;
};

/**
 * Gets an element type
 *
 * @memberof $elements
 * @param {String} type
 * @returns {?Object}
**/
$elements.getType = function(type) {
	return this.hasType(type) ? this.types[type] : null;
};

/**
 * Gets an instantiatable element type
 *
 * @memberof $elements
 * @param {String} type
 * @returns {?Function}
**/
$elements.getInstantiatable = function(type) {
	var typeDescriptor = this.getType(type);
	
	return (!isNull(typeDescriptor) && typeDescriptor.instantiatable === true) ? typeDescriptor.constructor : null;
};

/**
 * Gets an extendable element type
 *
 * @memberof $elements
 * @param {String} type
 * @returns {?Function}
**/
$elements.getExtendable = function(type) {
	var typeDescriptor = this.getType(type);
	
	return (!isNull(typeDescriptor) && typeDescriptor.extendable === true) ? typeDescriptor.constructor : null;
};

/**
 * Removes an element type
 *
 * @memberof $elements
 * @param {String} type
 * @returns {Object} $elements
**/
$elements.removeType = function(type) {
	delete this.types[type];
	
	return this;
};

// File: core/utils/abstracts.js
/**
 * $abstracts namespace
 *
 * @namespace $abstracts
 * @extends Collection
 * @description todoc
**/
var $abstracts = inherit(Collection);

// File: core/utils/classes.js
/**
 * $classes namespace
 *
 * @namespace $classes
 * @extends Collection
 * @description todoc
**/
var $classes = inherit(Collection);

/**
 * Creates a new class from a prototype
 *
 * @memberof $classes
 * @param {Object} proto
 * @param {Array} [ignore]
 * @returns {Object}
**/
$classes.fromPrototype = function(proto, ignore) {
	var returnValue = stdClass();
	
	if (!isArray(ignore)) ignore = [];
	
	forIn(proto, function(propertyKey, propertyVal) {
		var desc = Object.getOwnPropertyDescriptor(proto, propertyKey);
		
		if (
			isNull(propertyVal) ||
			isFunction(desc.get) ||
			isFunction(desc.set) ||
			isFunction(propertyVal) ||
			inArray(ignore, propertyKey)
		) return undefined;
		
		returnValue[propertyKey] = propertyVal;
	});
	
	return returnValue;
};

// File: core/utils/masks.js
/**
 * $masks namespace
 *
 * @namespace $masks
 * @extends Collection
 * @description todoc
**/
var $masks = inherit(Collection);

// File: core/utils/plugins.js
/**
 * $plugins namespace
 *
 * @namespace $plugins
 * @extends Collection
 * @description todoc
**/
var $plugins = inherit(Collection);

// File: core/utils/assets.js
/**
 * $assets namespace
 *
 * @namespace $assets
 * @description todoc
**/
var $assets = stdClass();

/**
 * List of types
 *
 * @memberof $assets
 * @type Object
 * @readonly
**/
$assets.types = stdClass();

/**
 * List of loaders
 *
 * @memberof $assets
 * @type Array
 * @readonly
**/
$assets.loaders = [];

/**
 * Gets a "free" loader
 *
 * @memberof $assets
 * @returns {Loader}
**/
$assets.getLoader = function() {
	var i = 0
	, il = this.loaders.length
	, loader;
	
	for (; i < il; i++) {
		loader = this.loaders[i];
		
		if (loader.status === 'pending') return loader;
	}
	
	loader = new Loader();
	
	this.loaders.push(loader);
	
	return loader;
};

/**
 * Adds a type
 *
 * @memberof $assets
 * @param {String} type
 * @returns {Object} $assets
**/
$assets.addType = function(type) {
	if (!this.hasType(type)) {
		type = this.types[type] = stdClass();
		
		type.sourceMap = stdClass();
		type.IDMap = stdClass();
	}
	
	return this;
};

/**
 * Determines if has type
 *
 * @memberof $assets
 * @param {String} type
 * @returns {Object} $assets
**/
$assets.hasType = function(type) {
	return !isUndefined(this.types[type]);
};

/**
 * Gets an item by ID
 *
 * @memberof $assets
 * @param {String} type
 * @param {String} ID
 * @returns {*}
**/
$assets.getByID = function(type, ID) {
	return this.hasType(type) ? this.types[type].IDMap[ID] || null : null;
};

/**
 * Gets an item by source
 *
 * @memberof $assets
 * @param {String} type
 * @param {String} src
 * @returns {*}
**/
$assets.getBySrc = function(type, src) {
	return this.hasType(type) ? this.types[type].sourceMap[src] || null : null;
};

/**
 * Gets all item of type
 *
 * @memberof $assets
 * @param {String} type
 * @returns {Array}
**/
$assets.getAll = function(type) {
	var returnValue = [];
	
	if (this.hasType(type)) {
		forIn(this.types[type].sourceMap, function(src, item) {
			addUnique(returnValue, item);
		});
		
		forIn(this.types[type].IDMap, function(ID, item) {
			addUnique(returnValue, item);
		});
	}
	
	return returnValue;
};

/**
 * Deletes all type
 *
 * @memberof $assets
 * @returns {Object} $assets
**/
$assets.clear = function() {
	this.types = stdClass();
	
	return this;
};

/**
 * Adds an item
 *
 * @memberof $assets
 * @param {String} type
 * @param {*} item
 * @param {String} src
 * @param {String} [id]
 * @returns {Object} $assets
**/
$assets.addItem = function(type, item, src, id) {
	var items = this.addType(type).types[type];
	
	items.sourceMap[src] = item;
	if (!isUndefined(id)) items.IDMap[id] = item;
	
	return this;
};

$assets.addType(Loader.IMG);
$assets.addType(Loader.AUDIO);

// File: core/utils/canvas.js
/**
 * $canvas namespace
 *
 * @namespace $canvas
 * @description todoc
**/
var $canvas = stdClass();

/**
 * The canvas DOM element
 *
 * @memberof $canvas
 * @type HTMLCanvasElement
**/
$canvas.DOMElement = createElement('canvas');

/**
 * The 2d context of the canvas
 *
 * @memberof $canvas
 * @type CanvasRenderingContext2D
**/
$canvas.ctx = $canvas.DOMElement.getContext('2d');

// File: core/Element.js
/**
 * Creates a new Element
 *
 * @class Element
 * @extends EventTarget
 * @description todoc
**/
function Element() {
	EventTarget.call(this);
	Storage.call(this);
	addElementPropertyHandlers.call(this);
	
	this.uuid = generateUUID();
	this.velocity = new Vector2(0, 0);
	
	this.classList = new ClassList();
	this.classList.add(elementProto.elementType, 0);
	
	forIn(elementClass, this.addProp, this);
}

/** @lends Element# **/
var elementProto = Element.prototype = Object.create(EventTarget.prototype);
elementProto.constructor = Element;

var addElementPropertyHandlers = (function() {
	/**
	 * Creates a new ElementProperty
	 *
	 * @class ElementProperty
	 * @param {String} propertyKey
	 * @param {*} primitiveValue
	 * @param {Boolean} inheritable
	 * @description todoc
	**/
	function ElementProperty(propertyKey, primitiveValue, inheritable) {
		this.key = propertyKey;
		this.edit(primitiveValue, inheritable);
		this.initialValue = this.value;
		
		this.value = 'inherit';
	}
	
	/** @lends ElementProperty# **/
	var elementPropertyProto = ElementProperty.prototype = stdClass();
	elementPropertyProto.constructor = ElementProperty;
	
	/**
	 * Edits the property, sets it's primitiveValue and inheritable properties
	 *
	 * @param {*} primitiveValue
	 * @param {Boolean} [inheritable]
	 * @returns {ElementProperty} this
	**/
	elementPropertyProto.edit = function(primitiveValue, inheritable) {
		var parsed = parseMethod(primitiveValue);
		
		this.primitiveValue = primitiveValue;
		this.value = isNull(parsed) ? primitiveValue : parsed;
		this.type = isFunction(this.value) ? 'method' : 'property';
		
		if (isBoolean(inheritable)) this.inheritable = inheritable;
		
		return this;
	};
	
	return function propertyHandlers() {
		var _properties = stdClass();
		
		/**
		 * Adds a property to the Element
		 *
		 * @alias Element#addProp
		 * @param {String} propertyKey
		 * @param {*} primitiveValue
		 * @param {Boolean} [inheritable]
		 * @returns {Element} this
		 * @todo Need to rewrite the property handler methods
		**/
		this.addProp = function(propertyKey, primitiveValue, inheritable) {
			var prop;
			
			if (!isBoolean(inheritable)) inheritable = true;
			
			if (this.hasProp(propertyKey)) {
				warning(this.toString() + ' already has property ' + propertyKey);
			}
			
			_properties[propertyKey] = new ElementProperty(propertyKey, primitiveValue, inheritable);
			
			Object.defineProperty(this, propertyKey, {
				configurable: true,
				enumerable: false,
				get: function () {
					var val = _properties[propertyKey].value;
					
					if (val === 'inherit') val = this.classList.execute(function(className) {
						var classData = $classes.get(className);
						
						if (
							!isNull(classData) &&
							!isUndefined(classData[propertyKey]) &&
							classData[propertyKey] !== 'inherit'
						) return classData[propertyKey] === 'initial' ? _properties[propertyKey].initialValue : classData[propertyKey];
					}, this);
					
					return isFunction(val) ? val.call(this) : val;
				},
				set: function (propertyVal) {
					return _properties[propertyKey].edit(propertyVal).value;
				}
			});
			
			return this;
		};
		
		/**
		 * Adds a property to the Element if it doesn't has it already
		 *
		 * @alias Element#addPropSafe
		 * @param {String} propertyKey
		 * @param {*} primitiveValue
		 * @param {Boolean} [inheritable]
		 * @returns {Element} this
		**/
		this.addPropSafe = function(propertyKey, primitiveValue, inheritable) {
			if (!this.hasProp(propertyKey)) this.addProp(propertyKey, primitiveValue, inheritable);
			
			return this;
		};
		
		/**
		 * Checks if the Element has a specific property
		 *
		 * @alias Element#hasProp
		 * @param {String} propertyKey
		 * @returns {Boolean}
		**/
		this.hasProp = function(propertyKey) {
			return has(_properties, propertyKey);
		};
		
		/**
		 * Removes a property from the Element
		 *
		 * @alias Element#removeProp
		 * @param {String} propertyKey
		 * @returns {Element} this
		**/
		this.removeProp = function(propertyKey) {
			if (has(_properties, propertyKey)) {
				delete _properties[propertyKey];
				delete this[propertyKey];
			}
			
			return this;
		};
		
		/**
		 * Edits a property of the Element
		 *
		 * @alias Element#setProp
		 * @param {String} propertyKey
		 * @param {*} primitiveValue
		 * @param {Boolean} [inheritable]
		 * @returns {Element} this
		**/
		this.setProp = function(propertyKey, primitiveValue, inheritable) {
			if (has(_properties, propertyKey)) {
				_properties[propertyKey].edit(primitiveValue, inheritable);
			}
			
			return this;
		};
		
		/**
		 * Returns an ElementProperty of the Element by key
		 *
		 * @alias Element#getProp
		 * @param {String} propertyKey
		 * @returns {?ElementProperty}
		**/
		this.getProp = function(propertyKey) {
			return _properties[propertyKey] || null;
		};
		
		/**
		 * Returns all ElementProperty from the Element (reduced by the given filter)
		 *
		 * @alias Element#getProps
		 * @param {Function} [filter]
		 * @returns {Array}
		**/
		this.getProps = function(filter) {
			var props = [];
			
			forIn(_properties, function(propertyKey, property) {
				if (isUndefined(filter) || filter.call(this, propertyKey, property) === true) props.push(property);
				
				return false;
			}, this);
			
			return props;
		};
		
		return this;
	};
}());

/**
 * The type of the element
 *
 * @type String
 * @default 'Element'
 * @readonly
**/
elementProto.elementType = 'Element';

/**
 * The name of the element
 *
 * @type String
 * @default 'Element'
 * @readonly
**/
elementProto.elementName = 'Element';

/**
 * The id of the element
 *
 * @type String
 * @default null
 * @readonly
**/
elementProto.id = null;

/**
 * The uuid of the element
 *
 * @type String
 * @default null
 * @readonly
**/
elementProto.uuid = null;

/**
 * The classes of the element
 *
 * @name Element#className
 * @type String
 * @readonly
**/
Object.defineProperty(elementProto, 'className', {
	get: function() {
		return this.classList.all().join(' ');
	}
});

/**
 * The parentLayer of the element
 *
 * @type Layer
 * @default null
 * @readonly
**/
elementProto.parentLayer = null;

/**
 * The parentElement of the element
 *
 * @type ContainerElement
 * @default null
 * @readonly
**/
elementProto.parentElement = null;

/**
 * The classes of the element
 *
 * @type ClassList
 * @default null
 * @readonly
**/
elementProto.classList = null;

/**
 * The velocity of the element
 *
 * @type Vector2
 * @default null
**/
elementProto.velocity = null;

/**
 * The horizontal velocity of the element
 *
 * @name Element#vX
 * @type Number
**/
Object.defineProperty(elementProto, 'vX', {
	get: function() {
		return this.velocity.x;
	},
	set: function(xVal) {
		return this.velocity.setX(xVal).x;
	}
});

/**
 * The vertical velocity of the element
 *
 * @name Element#vY
 * @type Number
**/
Object.defineProperty(elementProto, 'vY', {
	get: function() {
		return this.velocity.y;
	},
	set: function(yVal) {
		return this.velocity.setY(yVal).y;
	}
});

/**
 * The x position of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.x = 0;

/**
 * The y position of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.y = 0;

/**
 * The maximum x position of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.maxX = 'none';

/**
 * The maximum y position of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.maxY = 'none';

/**
 * The minimum x position of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.minX = 'none';

/**
 * The minimum y position of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.minY = 'none';

/**
 * The horizontal offset of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.offsetX = 0;

/**
 * The vertical offset of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.offsetY = 0;

/**
 * The width of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.width = 0;

/**
 * The height of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.height = 0;

/**
 * The maximum width of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.maxWidth = 'none';

/**
 * The maximum height of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.maxHeight = 'none';

/**
 * The minimum width of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.minWidth = 'none';

/**
 * The minimum height of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.minHeight = 'none';

/**
 * The top position of the element on the screen, including margin
 *
 * @type Number
 * @default 0
 * @readonly
 * @todo Force reflow (if necessary)
**/
elementProto.top = 0;

/**
 * The right position of the element on the screen, including margin
 *
 * @type Number
 * @default 0
 * @readonly
 * @todo Force reflow (if necessary)
**/
elementProto.right = 0;

/**
 * The bottom position of the element on the screen, including margin
 *
 * @type Number
 * @default 0
 * @readonly
 * @todo Force reflow (if necessary)
**/
elementProto.bottom = 0;

/**
 * The left position of the element on the screen, including margin
 *
 * @type Number
 * @default 0
 * @readonly
 * @todo Force reflow (if necessary)
**/
elementProto.left = 0;

/**
 * The x position of the element, relative to the scene
 *
 * @type Number
 * @default 0
 * @readonly
 * @todo Force reflow (if necessary)
**/
elementProto.screenX = 0;

/**
 * The y position of the element, relative to the scene
 *
 * @type Number
 * @default 0
 * @readonly
 * @todo Force reflow (if necessary)
**/
elementProto.screenY = 0;

/**
 * The x position of the element, relative to it's parent
 *
 * @type Number
 * @default 0
 * @readonly
 * @todo Force reflow (if necessary)
**/
elementProto.parentX = 0;

/**
 * The y position of the element, relative to it's parent
 *
 * @type Number
 * @default 0
 * @readonly
 * @todo Force reflow (if necessary)
**/
elementProto.parentY = 0;

/**
 * The layout width of the element
 *
 * @type Number
 * @default 0
 * @readonly
 * @todo Force reflow (if necessary)
**/
elementProto.renderWidth = 0;

/**
 * The layout height of the element
 *
 * @type Number
 * @default 0
 * @readonly
 * @todo Force reflow (if necessary)
**/
elementProto.renderHeight = 0;

/**
 * The horizontal center position of the element, relative to the scene
 *
 * @name Element#screenXC
 * @type Number
 * @readonly
 * @todo Force reflow (if necessary)
**/
/**
 * The vertical center position of the element, relative to the scene
 *
 * @name Element#screenYC
 * @type Number
 * @readonly
 * @todo Force reflow (if necessary)
**/
/**
 * The horizontal end position of the element, relative to the scene
 *
 * @name Element#screenXE
 * @type Number
 * @readonly
 * @todo Force reflow (if necessary)
**/
/**
 * The vertical end position of the element, relative to the scene
 *
 * @name Element#screenYE
 * @type Number
 * @readonly
 * @todo Force reflow (if necessary)
**/
/**
 * The horizontal center position of the element, relative to it's parent
 *
 * @name Element#parentXC
 * @type Number
 * @readonly
 * @todo Force reflow (if necessary)
**/
/**
 * The vertical center position of the element, relative to it's parent
 *
 * @name Element#parentYC
 * @type Number
 * @readonly
 * @todo Force reflow (if necessary)
**/
/**
 * The horizontal end position of the element, relative to it's parent
 *
 * @name Element#parentXE
 * @type Number
 * @readonly
 * @todo Force reflow (if necessary)
**/
/**
 * The vertical end position of the element, relative to it's parent
 *
 * @name Element#parentYE
 * @type Number
 * @readonly
 * @todo Force reflow (if necessary)
**/
Object.defineProperties(elementProto, {
	screenXC: { get: function() { return this.screenX + this.renderWidth / 2 } },
	screenYC: { get: function() { return this.screenY + this.renderHeight / 2 } },
	
	screenXE: { get: function() { return this.screenX + this.renderWidth } },
	screenYE: { get: function() { return this.screenY + this.renderHeight } },
	
	
	parentXC: { get: function() { return this.parentX + this.renderWidth / 2 } },
	parentYC: { get: function() { return this.parentY + this.renderHeight / 2 } },
	
	parentXE: { get: function() { return this.parentX + this.renderWidth } },
	parentYE: { get: function() { return this.parentY + this.renderHeight } }
});

/**
 * The width ratio of the element
 *
 * @type Number
 * @default 1
**/
elementProto.scaleX = 1;

/**
 * The height ratio of the element
 *
 * @type Number
 * @default 1
**/
elementProto.scaleY = 1;

/**
 * The clockwise rotation of the entry
 *
 * @type Number
 * @default 0
**/
elementProto.angle = 0;

/**
 * If the element should be mirrored horizontally
 *
 * @type Boolean
 * @default false
**/
elementProto.flipX = false;

/**
 * If the element should be mirrored vertically
 *
 * @type Boolean
 * @default false
**/
elementProto.flipY = false;

/**
 * The flow of the element
 *
 * @type ('none'|'horizontal'|'vertical')
 * @default 'none'
**/
elementProto.flow = 'none';

/**
 * The wrap of the element
 *
 * @type Boolean
 * @default true
**/
elementProto.wrap = true;

/**
 * The dragging status of the element
 *
 * @type Boolean
 * @default false
 * @todo Implement dragState
**/
elementProto.dragState = false;

/**
 * The focus status of the element
 *
 * @type Boolean
 * @default false
 * @todo Implement onFocus
**/
elementProto.onFocus = false;

/**
 * If the element allows mouse events through transparent pixel
 *
 * @type Boolean
 * @default true
 * @todo Implement isBlock
**/
elementProto.isBlock = true;

/**
 * The cursor type of the element
 *
 * @type String
 * @default 'default'
 * @todo Implement cursor
**/
elementProto.cursor = 'default';

/**
 * If the element allows drop on it
 *
 * @type Boolean
 * @default false
 * @todo Implement allowDrop
**/
elementProto.allowDrop = false;

/**
 * The title of the element
 *
 * @type String
 * @default ''
 * @todo Implement title
**/
elementProto.title = '';

/**
 * The transparency of the element
 *
 * @type Number
 * @default 1
 * @todo Implement opacity
**/
elementProto.opacity = 1;

/**
 * The background of the element
 *
 * @type String
 * @default ''
**/
elementProto.background = '';

/**
 * The mask id of the element
 *
 * @type String
 * @default ''
**/
elementProto.mask = '';

/**
 * The horizontal align of the element
 *
 * @type ('left'|'center'|'right')
 * @default 'left'
**/
elementProto.horizontalAlign = 'left';

/**
 * The vertical align of the element
 *
 * @type ('top'|'middle'|'bottom')
 * @default 'top'
**/
elementProto.verticalAlign = 'top';

/**
 * The top margin of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.marginTop = 0;

/**
 * The right margin of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.marginRight = 0;

/**
 * The bottom margin of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.marginBottom = 0;

/**
 * The left margin of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.marginLeft = 0;

/**
 * The margin of the element
 *
 * @name Element#margin
 * @type String
**/
Object.defineProperty(elementProto, 'margin', {
	get: function() {
		return this.marginTop + ' ' + this.marginRight + ' ' + this.marginBottom + ' ' + this.marginLeft;
	},
	set: function(margin) {
		var pieces = margin.split(' ')
		, len = pieces.length;
		
		if (len === 1) {
			this.marginTop = pieces[0];
			this.marginRight = pieces[0];
			this.marginBottom = pieces[0];
			this.marginLeft = pieces[0];
		} else if (len === 2) {
			this.marginTop = pieces[0];
			this.marginRight = pieces[1];
			this.marginBottom = pieces[0];
			this.marginLeft = pieces[1];
		} else if (len === 3) {
			this.marginTop = pieces[0];
			this.marginRight = pieces[1];
			this.marginBottom = pieces[2];
			this.marginLeft = pieces[1];
		} else {
			this.marginTop = pieces[0];
			this.marginRight = pieces[1];
			this.marginBottom = pieces[2];
			this.marginLeft = pieces[3];
		}
		
		return this.margin;
	}
});

/**
 * The top padding of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.paddingTop = 0;

/**
 * The right padding of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.paddingRight = 0;

/**
 * The bottom padding of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.paddingBottom = 0;

/**
 * The left padding of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.paddingLeft = 0;

/**
 * The padding of the element
 *
 * @name Element#padding
 * @type String
**/
Object.defineProperty(elementProto, 'padding', {
	get: function() {
		return this.paddingTop + ' ' + this.paddingRight + ' ' + this.paddingBottom + ' ' + this.paddingLeft;
	},
	set: function(padding) {
		var pieces = padding.split(' ')
		, len = pieces.length;
		
		if (len === 1) {
			this.paddingTop = pieces[0];
			this.paddingRight = pieces[0];
			this.paddingBottom = pieces[0];
			this.paddingLeft = pieces[0];
		} else if (len === 2) {
			this.paddingTop = pieces[0];
			this.paddingRight = pieces[1];
			this.paddingBottom = pieces[0];
			this.paddingLeft = pieces[1];
		} else if (len === 3) {
			this.paddingTop = pieces[0];
			this.paddingRight = pieces[1];
			this.paddingBottom = pieces[2];
			this.paddingLeft = pieces[1];
		} else {
			this.paddingTop = pieces[0];
			this.paddingRight = pieces[1];
			this.paddingBottom = pieces[2];
			this.paddingLeft = pieces[3];
		}
		
		return this.padding;
	}
});

/**
 * The border of the element
 *
 * @name Element#border
 * @type String
**/
Object.defineProperty(elementProto, 'border', {
	get: undefined,
	set: function(border) {
		var pieces = border.split(' ')
		, len = pieces.length;
		
		if (len >= 1) {
			this.borderTopWidth = pieces[0];
			this.borderRightWidth = pieces[0];
			this.borderBottomWidth = pieces[0];
			this.borderLeftWidth = pieces[0];
		}
		
		if (len >= 2) {
			this.borderTopStyle = pieces[1];
			this.borderRightStyle = pieces[1];
			this.borderBottomStyle = pieces[1];
			this.borderLeftStyle = pieces[1];
		}
		
		if (len === 3) {
			this.borderTopColor = pieces[2];
			this.borderRightColor = pieces[2];
			this.borderBottomColor = pieces[2];
			this.borderLeftColor = pieces[2];
		}
		
		return border;
	}
});

/**
 * The top border of the element
 *
 * @name Element#borderTop
 * @type String
**/
Object.defineProperty(elementProto, 'borderTop', {
	get: undefined,
	set: function(borderTop) {
		var pieces = borderTop.split(' ')
		, len = pieces.length;
		
		if (len >= 1) this.borderTopWidth = pieces[0];
		if (len >= 2) this.borderTopStyle = pieces[1];
		if (len === 3) this.borderTopColor = pieces[2];
		
		return borderTop;
	}
});

/**
 * The right border of the element
 *
 * @name Element#borderRight
 * @type String
**/
Object.defineProperty(elementProto, 'borderRight', {
	get: undefined,
	set: function(borderRight) {
		var pieces = borderRight.split(' ')
		, len = pieces.length;
		
		if (len >= 1) this.borderTopWidth = pieces[0];
		if (len >= 2) this.borderTopStyle = pieces[1];
		if (len === 3) this.borderTopColor = pieces[2];
		
		return borderRight;
	}
});

/**
 * The bottom border of the element
 *
 * @name Element#borderBottom
 * @type String
**/
Object.defineProperty(elementProto, 'borderBottom', {
	get: undefined,
	set: function(borderBottom) {
		var pieces = borderBottom.split(' ')
		, len = pieces.length;
		
		if (len >= 1) this.borderTopWidth = pieces[0];
		if (len >= 2) this.borderTopStyle = pieces[1];
		if (len === 3) this.borderTopColor = pieces[2];
		
		return borderBottom;
	}
});

/**
 * The left border of the element
 *
 * @name Element#borderLeft
 * @type String
**/
Object.defineProperty(elementProto, 'borderLeft', {
	get: undefined,
	set: function(borderLeft) {
		var pieces = borderLeft.split(' ')
		, len = pieces.length;
		
		if (len >= 1) this.borderTopWidth = pieces[0];
		if (len >= 2) this.borderTopStyle = pieces[1];
		if (len === 3) this.borderTopColor = pieces[2];
		
		return borderLeft;
	}
});

/**
 * The top border width of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.borderTopWidth = 0;

/**
 * The right border width of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.borderRightWidth = 0;

/**
 * The bottom border width of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.borderBottomWidth = 0;

/**
 * The left border width of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.borderLeftWidth = 0;

/**
 * The width of the element's border
 *
 * @name Element#borderWidth
 * @type String
**/
Object.defineProperty(elementProto, 'borderWidth', {
	get: function() {
		return this.borderTopWidth + ' ' + this.borderRightWidth + ' ' + this.borderBottomWidth + ' ' + this.borderLeftWidth;
	},
	set: function(borderWidth) {
		var pieces = borderWidth.split(' ')
		, len = pieces.length;
		
		if (len === 1) {
			this.borderTopWidth = pieces[0];
			this.borderRightWidth = pieces[0];
			this.borderBottomWidth = pieces[0];
			this.borderLeftWidth = pieces[0];
		} else if (len === 2) {
			this.borderTopWidth = pieces[0];
			this.borderRightWidth = pieces[1];
			this.borderBottomWidth = pieces[0];
			this.borderLeftWidth = pieces[1];
		} else if (len === 3) {
			this.borderTopWidth = pieces[0];
			this.borderRightWidth = pieces[1];
			this.borderBottomWidth = pieces[2];
			this.borderLeftWidth = pieces[1];
		} else {
			this.borderTopWidth = pieces[0];
			this.borderRightWidth = pieces[1];
			this.borderBottomWidth = pieces[2];
			this.borderLeftWidth = pieces[3];
		}
		
		return this.borderWidth;
	}
});

/**
 * The top border style of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderTopStyle = 'none';

/**
 * The right border style of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderRightStyle = 'none';

/**
 * The bottom border style of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderBottomStyle = 'none';

/**
 * The left border style of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderLeftStyle = 'none';

/**
 * The style of the element's border
 *
 * @name Element#borderStyle
 * @type String
**/
Object.defineProperty(elementProto, 'borderStyle', {
	get: function() {
		return this.borderTopStyle + ' ' + this.borderRightStyle + ' ' + this.borderBottomStyle + ' ' + this.borderLeftStyle;
	},
	set: function(borderStyle) {
		var pieces = borderStyle.split(' ')
		, len = pieces.length;
		
		if (len === 1) {
			this.borderTopStyle = pieces[0];
			this.borderRightStyle = pieces[0];
			this.borderBottomStyle = pieces[0];
			this.borderLeftStyle = pieces[0];
		} else if (len === 2) {
			this.borderTopStyle = pieces[0];
			this.borderRightStyle = pieces[1];
			this.borderBottomStyle = pieces[0];
			this.borderLeftStyle = pieces[1];
		} else if (len === 3) {
			this.borderTopStyle = pieces[0];
			this.borderRightStyle = pieces[1];
			this.borderBottomStyle = pieces[2];
			this.borderLeftStyle = pieces[1];
		} else {
			this.borderTopStyle = pieces[0];
			this.borderRightStyle = pieces[1];
			this.borderBottomStyle = pieces[2];
			this.borderLeftStyle = pieces[3];
		}
		
		return this.borderStyle;
	}
});

/**
 * The top border color of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderTopColor = 'none';

/**
 * The right border color of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderRightColor = 'none';

/**
 * The bottom border color of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderBottomColor = 'none';

/**
 * The left border color of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderLeftColor = 'none';

/**
 * The color of the element's border
 *
 * @name Element#borderColor
 * @type String
**/
Object.defineProperty(elementProto, 'borderColor', {
	get: function() {
		return this.borderTopColor + ' ' + this.borderRightColor + ' ' + this.borderBottomColor + ' ' + this.borderLeftColor;
	},
	set: function(borderColor) {
		var pieces = borderColor.split(' ')
		, len = pieces.length;
		
		if (len === 1) {
			this.borderTopColor = pieces[0];
			this.borderRightColor = pieces[0];
			this.borderBottomColor = pieces[0];
			this.borderLeftColor = pieces[0];
		} else if (len === 2) {
			this.borderTopColor = pieces[0];
			this.borderRightColor = pieces[1];
			this.borderBottomColor = pieces[0];
			this.borderLeftColor = pieces[1];
		} else if (len === 3) {
			this.borderTopColor = pieces[0];
			this.borderRightColor = pieces[1];
			this.borderBottomColor = pieces[2];
			this.borderLeftColor = pieces[1];
		} else {
			this.borderTopColor = pieces[0];
			this.borderRightColor = pieces[1];
			this.borderBottomColor = pieces[2];
			this.borderLeftColor = pieces[3];
		}
		
		return this.borderColor;
	}
});

/**
 * Allows the element to be moved using the mouse
 *
 * @type Boolean
 * @default false
**/
elementProto.draggable = false;

/**
 * Registers a "mousemove" event listener on the element
 *
 * @param {String|Function} callback
 * @returns {Element} this
**/
elementProto.mousemove = function(callback) {
	if (isString(callback)) callback = parseMethod(callback);
	if (isFunction(callback)) this.addEventListener('mousemove', callback);
	
	return this;
};

/**
 * Registers a "mouseenter" event listener on the element
 *
 * @param {String|Function} callback
 * @returns {Element} this
**/
elementProto.mouseenter = function(callback) {
	if (isString(callback)) callback = parseMethod(callback);
	if (isFunction(callback)) this.addEventListener('mouseenter', callback);
	
	return this;
};

/**
 * Registers a "mouseleave" event listener on the element
 *
 * @param {String|Function} callback
 * @returns {Element} this
**/
elementProto.mouseleave = function(callback) {
	if (isString(callback)) callback = parseMethod(callback);
	if (isFunction(callback)) this.addEventListener('mouseleave', callback);
	
	return this;
};

/**
 * Registers a "mousedown" event listener on the element
 *
 * @param {String|Function} callback
 * @returns {Element} this
**/
elementProto.mousedown = function(callback) {
	if (isString(callback)) callback = parseMethod(callback);
	if (isFunction(callback)) this.addEventListener('mousedown', callback);
	
	return this;
};

/**
 * Registers a "mouseup" event listener on the element
 *
 * @param {String|Function} callback
 * @returns {Element} this
**/
elementProto.mouseup = function(callback) {
	if (isString(callback)) callback = parseMethod(callback);
	if (isFunction(callback)) this.addEventListener('mouseup', callback);
	
	return this;
};

/**
 * Edits the element
 *
 * @param {Object} source
 * @returns {Element} this
**/
elementProto.edit = function(source) {
	return use(this, source);
};

/**
 * Returns the element's scene or null
 *
 * @returns {?Scene}
 * @todo (?)Check Layer contains Element and Scene contains Layer
**/
elementProto.getScene = function() {
	var layer = this.parentLayer;
	
	return is(layer, Layer) && is(layer.root, Scene) ? layer.root : null;
};

/**
 * Determines if the element is child of a container
 *
 * @param {ContainerElement} container
 * @returns {Boolean}
**/
elementProto.isChildOf = function(container) {
	var current = container;
	
	do {
		if (this.parentElement === current) return true;
		
		current = current.parentElement;
	} while (is(current, ContainerElement));
	
	return false;
};

/**
 * Scales the element
 *
 * @param {int} widthRatio
 * @param {int} heightRatio
 * @returns {Element} this
**/
elementProto.scale = function(widthRatio, heightRatio) {
	this.scaleX = widthRatio;
	this.scaleY = heightRatio;
	
	return this;
};

/**
 * Adds a class to the element's classList
 *
 * @param {String} item
 * @param {Number} [orderID]
 * @returns {Element} this
 * @see ClassList#add
**/
elementProto.addClass = function(item, orderID) {
	this.classList.add(item, orderID);
	
	return this;
};

/**
 * Toggles a class
 *
 * @param {String} item
 * @param {Number} [orderID]
 * @returns {Element} this
 * @see ClassList#toggle
**/
elementProto.toggleClass = function(item, orderID) {
	this.classList.toggle(item, orderID);
	
	return this;
};

/**
 * Removes a class from the element's classList
 *
 * @param {String} item
 * @returns {Element} this
 * @see OrderedList#remove
**/
elementProto.removeClass = function(item) {
	this.classList.remove(item);
	
	return this;
};

/**
 * Toggles a boolean property of the element
 *
 * @param {String} propertyKey
 * @returns {Element} this
**/
elementProto.toggle = function(propertyKey) {
	if (isBoolean(this[propertyKey])) {
		this[propertyKey] = !this[propertyKey];
	}
	
	return this;
};

/**
 * Applies transformation to the rendering context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {Element} this
**/
elementProto.applyTransform = function(ctx) {
	var r = isNumber(this.angle) ? deg2rad(this.angle % 360) : 0
	, scaleX = isNumber(this.scaleX) ? this.scaleX : 1
	, scaleY = isNumber(this.scaleY) ? this.scaleY : 1
	, tx, ty;
	
	if (this.flipX === true) scaleX *= -1;
	if (this.flipY === true) scaleY *= -1;
	
	if (r !== 0 || scaleX !== 1 || scaleY !== 1) {
		tx = this.screenX + this.renderWidth / 2;
		ty = this.screenY + this.renderHeight / 2;
		
		ctx.translate(tx, ty);
		
		if (r !== 0) ctx.rotate(r);
		if (scaleX !== 1 || scaleY !== 1) ctx.scale(scaleX, scaleY);
		
		ctx.translate(-tx, -ty);
	}
	
	return this;
};

/**
 * Applies a mask to the rendering context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {Element} this
**/
elementProto.applyMask = function(ctx) {
	var mask = $masks.get(this.mask);
	
	if (!isNull(mask)) {
		ctx.beginPath();
		
		mask(ctx, this);
		
		ctx.clip();
	}
	
	return this;
};

/**
 * Draws background and border if necessary
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {Element} this
 * @todo Implement lineDash
**/
elementProto.drawBox = function(ctx) {
	var x = this.screenX
	, y = this.screenY
	, w = this.renderWidth
	, h = this.renderHeight;
	
	if (this.background !== '') {
		ctx.fillStyle = this.background;
		ctx.fillRect(x, y, w, h);
	}
	
	if (this.borderTopWidth > 0) {
		ctx.beginPath();
		ctx.lineWidth = this.borderTopWidth;
		ctx.strokeStyle = this.borderTopColor;
		// ctx.setLineDash();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.stroke();
	}
	
	if (this.borderRightWidth > 0) {
		ctx.beginPath();
		ctx.lineWidth = this.borderRightWidth;
		ctx.strokeStyle = this.borderRightColor;
		// ctx.setLineDash();
		ctx.moveTo(x + w, y);
		ctx.lineTo(x + w, y + h);
		ctx.stroke();
	}
	
	if (this.borderBottomWidth > 0) {
		ctx.beginPath();
		ctx.lineWidth = this.borderBottomWidth;
		ctx.strokeStyle = this.borderBottomColor;
		// ctx.setLineDash();
		ctx.moveTo(x + w, y + h);
		ctx.lineTo(x, y + h);
		ctx.stroke();
	}
	
	if (this.borderLeftWidth > 0) {
		ctx.beginPath();
		ctx.lineWidth = this.borderLeftWidth;
		ctx.strokeStyle = this.borderLeftColor;
		// ctx.setLineDash();
		ctx.moveTo(x, y + h);
		ctx.lineTo(x, y);
		ctx.stroke();
	}
	
	return this;
};

/**
 * Updates the element (move by it's velocity)
 *
 * @returns {Element} this
**/
elementProto.update = function() {
	if (isNumber(this.x) && isNumber(this.vX)) {
		this.x += this.vX;
		
		if (isNumber(this.minX) && isNumber(this.maxX)) {
			if (this.x <= this.minX) this.x = this.maxX;
			else
			if (this.x >= this.maxX) this.x = this.minX;
		}
	}
	
	if (isNumber(this.y) && isNumber(this.vY)) {
		this.y += this.vY;
		
		if (isNumber(this.minY) && isNumber(this.maxY)) {
			if (this.y <= this.minY) this.y = this.maxY;
			else
			if (this.y >= this.maxY) this.y = this.minY;
		}
	}
	
	return this;
};

/**
 * Creates an animation task
 *
 * @param {Object} animData
 * @param {int} duration
 * @param {int} [delay]
 * @returns {Task}
 * @todo Handle colors and non-numeric values
**/
elementProto.animation = function(animData, duration, delay) {
	var initial = getProps(this, keys(animData))
	, fn = function(tick, elapsed, task) {
		var percent = range(0, 1, elapsed / (duration || 0));
		
		forIn(initial, function(propKey, propVal) {
			this[propKey] = initial[propKey] + (animData[propKey] - initial[propKey]) * percent;
		}, this);
		
		return percent === 1;
	};
	
	return new Task(fn, delay, this);
};

/**
 * If the element is in a scene, adds an animation task to the scene's queue
 *
 * @param {Object} animData
 * @param {int} duration
 * @param {int} [delay]
 * @returns {?Task}
**/
elementProto.animate = function(animData, duration, delay) {
	var scene = this.getScene()
	, task = null;
	
	if (is(scene, Scene)) {
		task = this.animation(animData, duration, delay);
		
		scene.queue.add(task, true);
	}
	
	return task;
};

/**
 * Returns a clone of the element
 *
 * @returns {Element}
**/
elementProto.clone = function() {
	var constructor = $elements.getInstantiatable(this.elementName)
	, element = null
	, elementUse, properties;
	
	if (!isNull(constructor)) {
		elementUse = stdClass();
		properties = this.getProps();
		
		forEach(properties, function(prop) {
			if (prop.value !== 'inherit') elementUse[prop.key] = prop.value;
		});
		
		element = new constructor(elementUse);
	}
	
	return element;
};

/**
 * Returns the string value of the element
 *
 * @returns {String}
**/
elementProto.toString = function() {
	return 'Chill Element[' + this.elementType + ']';
};

var elementClass = $classes.fromPrototype(
	elementProto,
	[ // ignored properties
	'elementType', 'elementName',
	'top', 'right', 'bottom', 'left',
	'screenX', 'screenY',
	'parentX', 'parentY',
	'renderWidth', 'renderHeight',
	'onFocus', 'dragState'
	]
);

$elements.addType(elementProto.elementName, Element, false, true);
$classes.set(elementProto.elementType, elementClass);

// File: core/Layer.js
/**
 * Creates a new Layer
 *
 * @class Layer
 * @extends EventTarget
 * @param {Object} [layerUse]
 * @description todoc
**/
function Layer(layerUse) {
	EventTarget.call(this);
	addLayerElementHandlers.call(this);
	
	this.uuid = generateUUID();
	this.canvas = createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	
	use(this, layerUse);
}

/** @lends Layer# **/
var layerProto = Layer.prototype = Object.create(EventTarget.prototype);
layerProto.constructor = Layer;

function addLayerElementHandlers() {
	var self = this
	, _containers = stdClass()
	, _body = new ContainerElement('body');
	
	/**
	 * The main ContainerElement of the Layer
	 *
	 * @alias Layer#body
	 * @type ContainerElement
	**/
	this.body = _containers.body = _body;
	
	function validateSelfElement(element) {
		return element.parentLayer === self && is(element.parentElement, ContainerElement) && self.contains(element);
	}
	
	/**
	 * Adds an Element to the Layer
	 *
	 * @alias Layer#add
	 * @param {Element} element
	 * @param {String} container
	 * @param {int} [orderID]
	 * @returns {Layer} this
	**/
	this.add = function(element, container, orderID) {
		if (is(element, Element)) {
			if (is(element, ContainerElement)) {
				if (has(_containers, element.id)) {
					warning('unable to add container#' + element.id + ', "' + element.id + '" already exists in layer#' + this.id);
					
					return this;
				}
				
				_containers[element.id] = element;
			}
			
			if (!has(_containers, container)) {
				if (!isUndefined(container)) warning('"' + container + '" does not exists in layer#' + this.id + ', use #body by default');
				container = 'body';
			}
			
			_containers[container].add(element, orderID);
			
			element.parentLayer = this;
			element.parentElement = _containers[container];
		} else {
			warning('only elements can be added to layer#' + this.id);
		}
		
		return this;
	};
	
	/**
	 * Gets an element by id
	 *
	 * @alias Layer#getElementByID
	 * @param {String} id
	 * @returns {?Element}
	 * @todo Break forEach if find element
	**/
	this.getElementByID = function(id) {
		var returnElement = null;
		
		this.eachElement(function(element) {
			if (element.id === id) returnElement = element;
		});
		
		return returnElement;
	};
	
	/**
	 * Checks if the Layer contains a specific Element
	 *
	 * @alias Layer#contains
	 * @param {Element} searchElement
	 * @returns {Boolean}
	**/
	this.contains = function(searchElement) {
		var returnValue = false;
		
		this.eachContainer(function(container) {
			if (container === searchElement || container.has(searchElement)) return returnValue = true;
		});
		
		return returnValue;
	};
	
	/**
	 * Removes an Element from the Layer
	 *
	 * @alias Layer#remove
	 * @param {Element} removeElement
	 * @returns {?Element} removed
	**/
	this.remove = function(removeElement) {
		var removed = null;
		
		if (removeElement === _body) {
			warning('cannot remove #body from layer#' + this.id);
		} else {
			this.eachContainer(function(container, containerKey) {
				if (container === removeElement) {
					delete _containers[containerKey];
					
					return removed = removeElement;
				} else if (container.has(removeElement)) {
					container.remove(removeElement);
					
					removeElement.parentLayer = null;
					removeElement.parentElement = null;
					
					return removed = removeElement;
				}
			});
		}
		
		return removed;
	};
	
	/**
	 * Creates a new Element and returns it
	 *
	 * @alias Layer#create
	 * @param {String} type
	 * @param {...*}
	 * @returns {?Element}
	**/
	this.create = function(type) {
		var element = null
		, constructor, args, abstractElement;
		
		if (startsWith(type, '#')) {
			type = type.slice(1);
			abstractElement = $abstracts.get(type);
			
			if (!isNull(abstractElement)) {
				element = abstractElement.instantiate();
				
				if (!isNull(element)) {
					element.edit(arguments[1]);
				} else {
					warning('Unable to instantiate AbstractElement. Element "' + abstractElement.type + '" is not instantiatable or does not exists');
				}
			} else {
				warning('AbstractElement "' + type + '" does not exist');
			}
		} else {
			constructor = $elements.getInstantiatable(type);
			
			if (!isNull(constructor)) {
				args = getArgs(arguments, 1);
				args.unshift(null);
				
				element = new (Function.prototype.bind.apply(constructor, args));
			} else {
				warning('Unable to instantiate Element. "' + abstractElement.type + '" is not instantiatable or does not exists');
			}
		}
		
		return element;
	};
	
	/**
	 * Combination of Layer#create and Layer#add
	 *
	 * @alias Layer#insert
	 * @param {String} elementType
	 * @param {Object|Array} [args]
	 * @param {String} [container]
	 * @param {int} [orderID]
	 * @returns {?Element}
	**/
	this.insert = function(elementType, args, container, orderID) {
		var element = isArray(args) ? this.create.apply(this, [elementType].concat(args)) : this.create(elementType, args);
		
		this.add(element, container, orderID);
		
		return element;
	};
	
	/**
	 * Sets the order position of the Element exactly before the reference
	 *
	 * @alias Layer#moveBefore
	 * @param {Element} element
	 * @param {Element} reference
	 * @returns {Layer} this
	**/
	this.moveBefore = function(element, reference) {
		if (validateSelfElement(element) && validateSelfElement(reference)) {
			element.parentElement.remove(element);
			reference.parentElement.addBefore(element, reference);
			element.parentElement = reference.parentElement;
		}
		
		return this;
	};
	
	/**
	 * Sets the order position of the Element exactly after the reference
	 *
	 * @alias Layer#moveAfter
	 * @param {Element} element
	 * @param {Element} reference
	 * @returns {Layer} this
	**/
	this.moveAfter = function(element, reference) {
		if (validateSelfElement(element) && validateSelfElement(reference)) {
			element.parentElement.remove(element);
			reference.parentElement.addAfter(element, reference);
			element.parentElement = reference.parentElement;
		}
		
		return this;
	};
	
	/**
	 * Returns a list of elements by the given query selector
	 *
	 * @alias Layer#select
	 * @param {String} query
	 * @param {ContainerElement} [context = this.body]
	 * @returns {Array}
	 * @todo Implement this method
	**/
	this.select = function(query, context) {
		return [];
	};
	
	/**
	 * Executes a provided callback function recursively once per Element in ascending order
	 *
	 * @alias Layer#eachElement
	 * @param {Function} callback
	 * @param {*} [thisArg]
	 * @returns {Layer} this
	**/
	this.eachElement = function(callback, thisArg) {
		callback.call(thisArg, _body);
		_body.each(callback, thisArg);
		
		return this;
	};
	
	/**
	 * Executes a provided callback function once per ContainerElement
	 *
	 * @alias Layer#eachContainer
	 * @param {Function} callback
	 * @param {*} [thisArg]
	 * @returns {Layer} this
	**/
	this.eachContainer = function(callback, thisArg) {
		var key;
		
		for (key in _containers) {
			if (!isUndefined(callback.call(thisArg, _containers[key], key))) break;
		}
		
		return this;
	};
	
	return this;
}

/**
 * The scene of the layer
 *
 * @type Scene
 * @default null
 * @readonly
**/
layerProto.root = null;

/**
 * The id of the layer
 *
 * @type String
 * @default null
**/
layerProto.id = null;

/**
 * The uuid of the layer
 *
 * @type String
 * @default null
 * @readonly
**/
layerProto.uuid = null;

/**
 * The canvas of the layer
 *
 * @type HTMLCanvasElement
 * @default null
 * @readonly
**/
layerProto.canvas = null;

/**
 * The 2d rendering context of the layer
 * 
 * @type CanvasRenderingContext2D
 * @default null
 * @readonly
**/
layerProto.ctx = null;

/**
 * The x position of the canvas
 *
 * @name Layer#x
 * @type Number
 * @default 0
**/
Object.defineProperty(layerProto, 'x', {
	get: function() {
		return getInt(this.canvas.style.left) || 0;
	},
	set: function(xVal) {
		return this.canvas.style.left = xVal + 'px';
	}
});

/**
 * The y position of the canvas
 *
 * @name Layer#y
 * @type Number
 * @default 0
**/
Object.defineProperty(layerProto, 'y', {
	get: function() {
		return getInt(this.canvas.style.top) || 0;
	},
	set: function(yVal) {
		return this.canvas.style.top = yVal + 'px';
	}
});

/**
 * The width of the layer
 *
 * @name Layer#width
 * @type Number
**/
Object.defineProperty(layerProto, 'width', {
	get: function() {
		return this.canvas.width;
	},
	set: function(widthVal) {
		return this.canvas.width = widthVal;
	}
});

/**
 * The height of the layer
 *
 * @name Layer#height
 * @type Number
**/
Object.defineProperty(layerProto, 'height', {
	get: function() {
		return this.canvas.height;
	},
	set: function(heightVal) {
		return this.canvas.height = heightVal;
	}
});

/**
 * The z-index of the layer's canvas
 *
 * @name Layer#zIndex
 * @type Number
 * @default 0
**/
Object.defineProperty(layerProto, 'zIndex', {
    get: function() {
		return +this.canvas.style.zIndex;
	},
	set: function(val) {
		return +(this.canvas.style.zIndex = val);
	}
});

/**
 * The background of the layer's canvas
 *
 * @name Layer#background
 * @type String
 * @default 'rgba(0, 0, 0, 0)'
**/
Object.defineProperty(layerProto, 'background', {
	get: function() {
		return this.canvas.style.background;
	},
	set: function(bgVal) {
		return this.canvas.style.background = bgVal;
	}
});

/**
 * The alpha level (globalAlpha) of the layer's canvas element
 *
 * @name Layer#opacity
 * @type float
 * @default 1
**/
Object.defineProperty(layerProto, 'opacity', {
	get: function() {
		return this.ctx.globalAlpha;
	},
	set: function(opacity) {
		return this.ctx.globalAlpha = opacity;
	}
});

/**
 * If the renderer should update the layer at every tick
 *
 * @type Boolean
 * @default true
**/
layerProto.live = true;

/**
 * If the layer should be rendered
 *
 * @type Boolean
 * @default true
**/
layerProto.visible = true;

/**
 * Renders the entries of the layer
 *
 * @method
 * @name Layer#render
 * @returns {Layer} this
**/
layerProto.render = (function() {
	function draw(element) {
		var ctx = this.ctx;
		
		ctx.save();
		
		element.applyTransform(ctx);
		element.applyMask(ctx);
		element.drawBox(ctx);
		element.draw(ctx);
		
		ctx.restore();
	}
	
	return function render() {
		if (this.visible === true) {
			this.clear();
			this.eachElement(draw, this);
		}
		
		return this;
	};
}());

/**
 * Clears the entire layer
 *
 * @returns {Layer} this
**/
layerProto.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
	
	return this;
};

/**
 * Gets ImageData from the layer
 *
 * @param {int} x
 * @param {int} y
 * @returns {Uint8ClampedArray}
**/
layerProto.getPixel = function(x, y) {
	return this.ctx.getImageData(x, y, 1, 1).data;
};

/**
 * Scrolls the layer, sets it's x and y to the given values
 *
 * @param {int} x
 * @param {int} y
 * @returns {Layer} this
**/
layerProto.scrollTo = function(x, y) {
	this.x = x;
	this.y = y;
	
	return this;
};

/**
 * Scrolls the layer, edits it's x and y by the given values
 *
 * @param {int} x
 * @param {int} y
 * @returns {Layer} this
**/
layerProto.scrollBy = function(x, y) {
	this.x += x;
	this.y += y;
	
	return this;
};

/**
 * Returns the string value of the layer
 *
 * @returns {String}
**/
layerProto.toString = function() {
	return 'Chill Layer';
};

// File: core/Scene.js
/**
 * Creates a new Scene
 *
 * @class Scene
 * @extends EventTarget
 * @param {HTMLElement} wrapper
 * @description todoc
**/
function Scene(wrapper) {
	EventTarget.call(this);
	Storage.call(this);
	
	this.uuid = generateUUID();
	this.wrapper = wrapper;
	this.readyState = 'pending';
	
	this.screen = new Screen();
	this.cursor = new Cursor('mouse');
	this.settings = new PublicStorage();
	this.loader = new Loader();
	this.queue = new Queue();
	
	addSceneLayerHandlerMethods.call(this);
	addSceneEventListeners.call(this, wrapper);
	addSceneAnimationFrameHandlers.call(this);
	addSceneCollisionDetectionHandlers.call(this);
	initScene.call(this);
}

/** @lends Scene# **/
var sceneProto = Scene.prototype = Object.create(EventTarget.prototype);
sceneProto.constructor = Scene;

function addSceneLayerHandlerMethods() {
	var _layers = new OrderedList();
	
	/**
	 * Creates a new Layer and returns it
	 *
	 * @alias Scene#createLayer
	 * @param {Object} [layerUse]
	 * @returns {Layer}
	**/
	this.createLayer = function(layerUse) {
		if (!isObject(layerUse)) layerUse = stdClass();
		
		return new Layer(addDefault(layerUse, {
			width: this.screen.width,
			height: this.screen.height
		}));
	};
	
	/**
	 * Adds a Layer to the Scene
	 *
	 * @alias Scene#addLayer
	 * @param {Layer} layer
	 * @param {int} [orderID]
	 * @returns {Scene} this
	**/
	this.addLayer = function(layer, orderID) {
		_layers.add(layer, orderID);
		layer.root = this;
		this.wrapper.appendChild(layer.canvas);
		
		return this;
	};
	
	/**
	 * Combination of Scene#createLayer and Scene#addLayer
	 *
	 * @alias Scene#insertLayer
	 * @param {Object} [layerUse]
	 * @param {int} [orderID]
	 * @returns {Layer}
	**/
	this.insertLayer = function(layerUse, orderID) {
		var layer = this.createLayer(layerUse);
		
		this.addLayer(layer, orderID);
		
		return layer;
	};
	
	/**
	 * Removes a Layer from the Scene
	 *
	 * @alias Scene#removeLayer
	 * @param {Layer} layer
	 * @returns {Scene} this
	**/
	this.removeLayer = function(layer) {
		_layers.remove(layer);
		layer.root = null;
		this.wrapper.removeChild(layer.canvas);
		
		return this;
	};
	
	/**
	 * Gets a Layer by id
	 *
	 * @alias Scene#getLayer
	 * @param {String} layerId
	 * @returns {?Layer}
	**/
	this.getLayer = function(layerId) {
		var returnValue = null;
		
		_layers.each(function(layer) {
			if (layer.id === layerId) {
				returnValue = layer;
				
				return true;
			}
			
			return false;
		});
		
		return returnValue;
	};
	
	/**
	 * Executes a provided callback function once per Layer in ascending order
	 *
	 * @alias Scene#eachLayer
	 * @param {Function} callback
	 * @returns {Scene} this
	**/
	this.eachLayer = function(callback) {
		_layers.each(callback);
		
		return this;
	};
	
	/**
	 * Executes a provided callback function recursively once per Element in ascending order
	 *
	 * @alias Scene#eachElement
	 * @param {Function} callback
	 * @returns {Scene} this
	**/
	this.eachElement = function(callback) {
		_layers.each(function(layer) {
			layer.eachElement(callback);
		});
		
		return this;
	};
	
	return this;
}

function addSceneEventListeners(wrapper) {
	var scene = this
	, _dragged = []
	, _focused = []
	, doc = window.document;
	
	/**
	 * Returns an Array of currently dragged Elements
	 *
	 * @alias Scene#getDraggedElements
	 * @returns {Array}
	**/
	this.getDraggedElements = function() {
		return _dragged;
	};
	
	/**
	 * Returns an Array of currently hovered Elements
	 *
	 * @alias Scene#getFocusedElements
	 * @returns {Array}
	**/
	this.getFocusedElements = function() {
		return _focused;
	};
	
	/**
	 * Updates the list of focused elements, emits the "mousemove", "mouseenter" and "mouseleave" events if necessary
	 *
	 * @alias Scene#updateFocusedElements
	 * @param {MouseEvent} e
	 * @returns {Scene} this
	 * @todo Break forEach if the propagation is stopped
	 * @todo Consider parent layer offset on collision check
	 * @todo Consider element rotation and scale on collision check
	**/
	this.updateFocusedElements = function(e) {
		var temp = []
		, cx = this.cursor.x
		, cy = this.cursor.y;
		
		if (this.cursor.onScreen) {
			scene.eachElement(function(element) {
				var contains, event;
				
				if (e.propagationStopped === true) return undefined;
				
				contains = inArray(_focused, element);
				
				e.target = element;
				element.dispatchEvent(e.type, e);
				
				if (
					element.screenX <= cx &&
					element.screenXE >= cx &&
					element.screenY <= cy &&
					element.screenYE >= cy
				) {
					temp.push(element);
					
					if (!contains) {
						event = new MouseEvent('mouseenter', e.x, e.y, null);
						event.target = element;
						element.dispatchEvent(event.type, event);
					}
				} else if (contains) {
					event = new MouseEvent('mouseleave', e.x, e.y, null);
					event.target = element;
					element.dispatchEvent(event.type, event);
				}
			});
		}
		
		empty(_focused);
		_focused.push.apply(_focused, temp);
		
		return this;
	};
	
	wrapper.addEventListener('mousemove', function(e) {
		var x = e.layerX
		, y = e.layerY
		, event = new MouseEvent('mousemove', x, y, null);
		
		scene.cursor.set(x, y);
		scene.cursor.onScreen = true;
		
		event.target = scene;
		event.originalEvent = e;
		
		scene.dispatchEvent(e.type, event);
		scene.updateFocusedElements(event);
	});
	
	wrapper.addEventListener('mouseenter', function(e) {
		scene.cursor.set(e.layerX, e.layerY);
		scene.cursor.onScreen = true;
		
		scene.dispatchEvent(e.type, new MouseEvent(e.type, e.layerX, e.layerY, null));
	});
	
	wrapper.addEventListener('mouseleave', function(e) {
		scene.cursor.set(e.layerX, e.layerY);
		scene.cursor.onScreen = false;
		
		forEach(_focused, function(element) {
			var event = new MouseEvent('mouseleave', scene.cursor.x, scene.cursor.y, null);
			event.target = element;
			element.dispatchEvent(event.type, event);
		});
		
		empty(_focused);
		
		scene.dispatchEvent(e.type, new MouseEvent(e.type, e.layerX, e.layerY, null));
	});
	
	wrapper.addEventListener('mousedown', function(e) {
		var x = e.layerX
		, y = e.layerY
		, event = new MouseEvent('mousedown', x, y, null);
		
		scene.cursor.set(x, y);
		scene.cursor.onScreen = true;
		
		event.target = scene;
		event.originalEvent = e;
		
		switch(e.button) {
			case 0: event.button = 'left'; break;
			case 1: event.button = 'middle'; break;
			case 2: event.button = 'right'; break;
		}
		
		scene.dispatchEvent(e.type, event);
		applyEach(_focused, EventTarget.prototype.dispatchEvent, e.type, event);
	});
	
	wrapper.addEventListener('mouseup', function(e) {
		var x = e.layerX
		, y = e.layerY
		, event = new MouseEvent('mouseup', x, y, null);
		
		scene.cursor.set(x, y);
		scene.cursor.onScreen = true;
		
		event.target = scene;
		event.originalEvent = e;
		
		switch(e.button) {
			case 0: event.button = 'left'; break;
			case 1: event.button = 'middle'; break;
			case 2: event.button = 'right'; break;
		}
		
		scene.dispatchEvent(e.type, event);
		applyEach(_focused, EventTarget.prototype.dispatchEvent, e.type, event);
	});
	
	doc.addEventListener('keypress', function(e) {
		var key = e.keyCode || e.which
		, event = new KeyboardEvent('keypress', key);
		
		event.target = scene;
		event.originalEvent = e;
		
		scene.dispatchEvent('keypress', event);
	});
	
	doc.addEventListener('keydown', function(e) {
		var key = e.keyCode || e.which
		, event = new KeyboardEvent('keydown', key);
		
		event.target = scene;
		event.originalEvent = e;
		
		scene.dispatchEvent('keydown', event);
	});
	
	doc.addEventListener('keyup', function(e) {
		var key = e.keyCode || e.which
		, event = new KeyboardEvent('keyup', key);
		
		event.target = scene;
		event.originalEvent = e;
		
		scene.dispatchEvent('keyup', event);
	});
	
	return this;
}

function addSceneAnimationFrameHandlers() {
	var animFrame = null
	, tick = (function animationFrame() {
		var now = new Date();
		
		animFrame = window.requestAnimationFrame(tick);
		
		this.fps = now - this.lastTick;
		this.lastTick = now;
		++this.tickCount;
		
		this.update();
		this.queue.perform();
		this.emit('tick');
		this.reflow();
		this.checkCollisions();
		this.paint();
	}).bind(this);
	
	/**
	 * Starts the animation of the Scene
	 *
	 * @alias Scene#start
	 * @returns {Scene} this
	 * @todo Start scene on browser tab focus
	 * @todo "Play" queue tasks
	**/
	this.start = function() {
		this.stop();
		
		this.run = true;
		
		tick();
		
		return this;
	};
	
	/**
	 * Stops the animation of the Scene
	 *
	 * @alias Scene#stop
	 * @returns {Scene} this
	 * @todo Stop scene on browser tab blur
	 * @todo "Pause" queue tasks
	**/
	this.stop = function() {
		window.cancelAnimationFrame(animFrame);
		
		this.run = false;
		
		return this;
	};
	
	return this;
}

function addSceneCollisionDetectionHandlers() {
	var _watchList = [];
	
	/**
	 * Creates a new CollisionDetector
	 *
	 * @class CollisionDetector
	 * @param {Element} element
	 * @param {Element[]|Element} targets
	 * @param {Boolean} [autoRemove = true]
	 * @description todoc
	**/
	function CollisionDetector(element, targets, autoRemove) {
		this.element = element;
		this.targets = toArray(targets);
		this.autoRemove = autoRemove !== false;
	}
	
	/** @lends CollisionDetector# **/
	var collisionDetectorProto = CollisionDetector.prototype = stdClass();
	collisionDetectorProto.constructor = CollisionDetector;
	
	/**
	 * Adds one or more targets to check
	 *
	 * @param {Element[]|Element} targets
	 * @returns {CollisionDetector} this
	**/
	collisionDetectorProto.addTarget = function(targets) {
		this.targets = this.targets.concat(targets);
		
		return this;
	};
	
	/**
	 * Removes a target
	 *
	 * @param {Element} target
	 * @returns {CollisionDetector} this
	**/
	collisionDetectorProto.removeTarget = function(target) {
		remove(this.targets, target);
		
		return this;
	};
	
	/**
	 * Checks for collision, emits "collision" event if the elements collides
	 *
	 * @returns {CollisionDetector} this
	**/
	collisionDetectorProto.check = function() {
		var elem = this.element
		, i = 0
		, il = this.targets.length
		, target, event;
		
		for (; i < il; i++) {
			target = this.targets[i];
			
			if (!(elem.screenX > target.screenXE || elem.screenXE < target.screenX || elem.screenY > target.screenYE || elem.screenYE < target.screenY)) {
				event = new CollisionEvent('collision', target);
				event.target = elem;
				
				elem.emit(event.type, event);
				
				if (this.autoRemove === true) {
					this.removeTarget(target);
					
					--i;
					--il;
				}
			}
		}
		
		return this;
	};
	
	/**
	 * Creates a new CollisionDetector and adds it to the watchList
	 *
	 * @alias Scene#watch
	 * @param {Element} element
	 * @param {*} targets
	 * @param {Boolean} [autoRemove]
	 * @returns {CollisionDetector}
	**/
	this.watch = function(element, targets, autoRemove) {
		var detector = new CollisionDetector(element, targets, autoRemove);
		
		_watchList.push(detector);
		
		return detector;
	};
	
	/**
	 * Removes the given CollisionDetector from the watchList
	 *
	 * @alias Scene#neglect
	 * @param {CollisionDetector} detector
	 * @returns {Scene} this
	**/
	this.neglect = function(detector) {
		remove(_watchList, detector);
		
		return this;
	};
	
	/**
	 * Calls each CollisionDetector check method from the watchList
	 *
	 * @alias Scene#checkCollisions
	 * @returns {Scene} this
	**/
	this.checkCollisions = function() {
		callEach(_watchList, collisionDetectorProto.check);
		
		return this;
	};
	
	return this;
}

function initScene() {
	this.settings.edit({
		volume: 40,
		maxDraggedEntries: 1,
		renderDepthLimit: 0
	});
	
	return this;
}

/**
 * The uuid of the scene
 *
 * @type String
 * @default null
 * @readonly
**/
sceneProto.uuid = null;

/**
 * The wrapper of the scene
 *
 * @type HTMLElement
 * @default null
 * @readonly
**/
sceneProto.wrapper = null;

/**
 * The screen of the scene
 *
 * @type Screen
 * @default null
 * @readonly
**/
sceneProto.screen = null;

/**
 * The cursor of the scene
 *
 * @type Cursor
 * @default null
 * @readonly
**/
sceneProto.cursor = null;

/**
 * The loading state of the scene
 *
 * @type String
 * @default null
 * @readonly
**/
sceneProto.readyState = null;

/**
 * The settings of the scene
 *
 * @type PublicStorage
 * @default null
 * @readonly
**/
sceneProto.settings = null;

/**
 * The loader of the scene
 *
 * @type Loader
 * @default null
 * @readonly
**/
sceneProto.loader = null;

/**
 * The queue of the scene
 *
 * @type Queue
 * @default null
 * @readonly
**/
sceneProto.queue = null;

/**
 * The running status of the scene
 *
 * @type Boolean
 * @default false
 * @readonly
**/
sceneProto.run = false;

/**
 * The last tick of the scene
 *
 * @type int
 * @default 0
 * @readonly
**/
sceneProto.lastTick = 0;

/**
 * The number of ticks
 *
 * @type int
 * @default 0
 * @readonly
**/
sceneProto.tickCount = 0;

/**
 * The fps of the scene
 *
 * @type int
 * @default 0
 * @readonly
**/
sceneProto.fps = 0;

/**
 * Includes external data
 *
 * @param {String|Object} data
 * @param {Function} callback
 * @returns {Scene} this
 * @todo XML support
**/
sceneProto.include = function(data, callback) {
	var scene = this;
	
	if (isString(data)) {
		HTTP.getJSON(data, function(jsonData) {
			use(scene, jsonData);
			
			if (isFunction(callback)) callback(scene);
		});
	} else {
		if (isObject(data)) use(scene, data);
		if (isFunction(callback)) callback(scene);
	}
	
	return scene;
};

/**
 * Loads components
 *
 * @param {String} path
 * @param {Object} components
 * @returns {Scene} this
**/
sceneProto.preload = function(path, components) {
	var scene = this
	, assetsLoader = $assets.getLoader()
	, onLoad = function() {
		scene.emit('preloadComplete');
		// assetsLoader.off('complete', onLoad);
		assetsLoader.reset();
	};
	
	assetsLoader.on('complete', onLoad);
	
	forIn(components, function(type, items) {
		items = toArray(items);
		
		forEach(items, function(item) {
			var parts = item.split(' as ')
			, source = parts[0].replace(/^@/, path)
			, alias = parts[1]
			, loadItem = assetsLoader.add(type, source, alias);
			
			if (!isNull(loadItem)) $assets.addItem(type, loadItem, source, alias);
		}, this);
	}, this);
	
	assetsLoader.start();
	
	return this;
};

/**
 * Plays an audio
 *
 * @param {Audio|String} audio
 * @param {int} [volume]
 * @param {Boolean} [reset]
 * @param {Function} [callback]
 * @returns {Scene} this
**/
sceneProto.playAudio = function(audio, volume, reset, callback) {
	if (isString(audio) && startsWith(audio, '#')) {
		audio = $assets.getByID(Loader.AUDIO, audio.slice(1));
	}
	
	if (is(audio, Audio)) {
		if (isUndefined(volume)) volume = this.settings.get('volume');
		
		playAudio(audio, volume, reset, callback);
	}
	
	return this;
};

/**
 * Sets the size of the scene
 *
 * @param {int} width
 * @param {int} height
 * @returns {Scene} this
**/
sceneProto.resize = function(width, height) {
	this.setWidth(width);
	this.setHeight(height);
	
	return this;
};

/**
 * Sets the width of the scene
 *
 * @param {int} width
 * @returns {Scene} this
**/
sceneProto.setWidth = function(width) {
	this.screen.width = width;
	this.wrapper.style.width = width + 'px';
	
	return this;
};

/**
 * Sets the height of the scene
 *
 * @param {int} height
 * @returns {Scene} this
**/
sceneProto.setHeight = function(height) {
	this.screen.height = height;
	this.wrapper.style.height = height + 'px';
	
	return this;
};

/**
 * Adds a task to the queue
 *
 * @param {Function} listener
 * @param {int} [delay]
 * @param {Object} [thisArg]
 * @returns {Task}
**/
sceneProto.addTask = function(listener, delay, thisArg) {
	var task = new Task(listener, delay, thisArg);
	
	this.queue.add(task);
	
	return task;
};

/**
 * Removes a task from the queue
 *
 * @param {Task} task
 * @returns {Scene} this
**/
sceneProto.removeTask = function(task) {
	return this.queue.remove(task);
};

/**
 * Adds a task to the queue
 *
 * @param {Function} listener
 * @param {int} delay
 * @param {Object} [thisArg]
 * @returns {Scene} this
**/
sceneProto.later = function(listener, delay, thisArg) {
	return this.queue.add(new Task(function() {
		listener.apply(this, getArgs(arguments));
		
		return true;
	}, delay, thisArg));
};

/**
 * Adds a task to the queue
 *
 * @param {Function} listener
 * @param {int} times
 * @param {int} [delay]
 * @param {Object} [thisArg]
 * @returns {Scene} this
**/
sceneProto.repeat = function(listener, times, delay, thisArg) {
	var n = 0;
	
	return this.queue.add(new Task(function() {
		listener.apply(this, getArgs(arguments));
		
		return ++n >= times;
	}, delay, thisArg));
};

/**
 * Determines if a given element is on the screen
 *
 * @param {Element} element
 * @param {Boolean} [partly = true]
 * @returns {Boolean}
 * @todo Consider parent layer offset on collision check
 * @todo Consider element rotation and scale on collision check
**/
sceneProto.onScreen = function(element, partly) {
	var x = this.screen.pos.x
	, y = this.screen.pos.y
	, xe = x + this.screen.width
	, ye = y + this.screen.height;
	
	return partly === false ?
		element.screenX >= x &&
		element.screenY >= y &&
		element.screenXE <= xe &&
		element.screenYE <= ye
	:
		!(
			x > element.screenXE ||
			xe < element.screenX ||
			y > element.screenYE ||
			ye < element.screenY
		);
};

/**
 * Adds a plugin to the scene
 *
 * @param {String} pluginID
 * @param {Object} [pluginConfig]
 * @returns {Scene} this
**/
sceneProto.addPlugin = function(pluginID, pluginConfig) {
	var plugin = $plugins.get(pluginID)
	, config;
	
	if (!isNull(plugin)) {
		if (!(pluginID in this)) {
			config = Object.create(plugin.config);
			if (isObject(pluginConfig)) assign(config, pluginConfig);
			
			this[pluginID] = plugin.constructor.call(this, config);
			this[pluginID].config = config;
		} else {
			warning('cannot add plugin "' + pluginID + '", already exists in scene');
		}
	} else {
		warning('cannot add plugin "' + pluginID + '", plugin does not exists');
	}
	
	return this;
};

/**
 * Creates an AbstractElement
 *
 * @param {String} elementID
 * @param {String} elementType
 * @param {Object} [elementUse]
 * @param {Array} [args]
 * @returns {Scene} this
**/
sceneProto.createAbstractElement = function(elemID, elementType, elementUse, args) {
	$abstracts.set(elemID, new AbstractElement(elementType, elementUse, args));
	
	return this;
};

/**
 * Updates each element
 *
 * @method
 * @name Scene#update
 * @returns {Scene} this
**/
sceneProto.update = (function() {
	function updateEach(element) {
		element.update();
	}
	
	return function update() {
		this.eachElement(updateEach);
		
		return this;
	};
}());

/**
 * Determines the elements position and size
 *
 * @method
 * @name Scene#reflow
 * @returns {Scene} this
**/
sceneProto.reflow = (function() {
	function eachLayer(layer) {
		placeElement(layer.body, 0, 0, layer.width, layer.height, 0, 0, 0, 0);
	}
	
	function placeElement(element, parentX, parentY, parentWidth, parentHeight, t, l, r, b) {
		var top, left, right, bottom, x, y
		
		, minW = element.minWidth
		, minH = element.minHeight
		, maxW = element.maxWidth
		, maxH = element.maxHeight
		
		, marginTop = parseValue(element.marginTop, parentHeight)
		, marginRight = parseValue(element.marginRight, parentWidth)
		, marginBottom = parseValue(element.marginBottom, parentHeight)
		, marginLeft = parseValue(element.marginLeft, parentWidth)
		
		, offsetX, offsetY
		
		, w = element.width
		, h = element.height
		
		, flow = element.flow;
		
		
		if (flow === 'horizontal') {
			x = r;
			y = t;
		} else if (flow === 'vertical') {
			x = l;
			y = b;
		} else {
			x = parseValue(element.x, parentWidth);
			y = parseValue(element.y, parentHeight);
		}
		
		x += marginLeft;
		y += marginTop;
		
		switch(w) {
			case 'fit': w = parentWidth - (x - parentX); break;
			case 'auto': w = isFunction(element.measureWidth) ? element.measureWidth() : 0; break;
			
			default: w = parseValue(w, parentWidth);
		}
		
		switch(h) {
			case 'fit': h = parentHeight - (y - parentY); break;
			case 'auto': h = isFunction(element.measureHeight) ? element.measureHeight() : 0; break;
			
			default: h = parseValue(h, parentHeight);
		}
		
		if (minW !== 'none') w = Math.max(w, parseValue(minW, parentWidth));
		if (maxW !== 'none') w = Math.min(w, parseValue(maxW, parentWidth));
		if (minH !== 'none') h = Math.max(h, parseValue(minH, parentWidth));
		if (maxH !== 'none') h = Math.min(h, parseValue(maxH, parentWidth));
		
		if (flow === 'vertical') {
			switch(element.horizontalAlign) {
				case 'center': x = l + r / 2 - w / 2; break;
				case 'right': x = r - w; break;
			}
		}
		
		left = x;
		right = x + w + marginRight;
		
		if (flow === 'horizontal') {
			switch(element.verticalAlign) {
				case 'middle': y = t + b / 2 - h / 2; break;
				case 'bottom': y = b - h; break;
			}
		}
		
		top = y;
		bottom = y + h + marginBottom;
		
		if (element.wrap === true) {
			if (flow === 'horizontal') {
				if (right > parentX + parentWidth) {
					x = parentX + marginLeft;
					y = b + marginTop;
					
					top = y;
					right = x + w + marginRight;
					bottom = y + h + marginBottom;
					left = x;
				}
			} else if (flow === 'vertical') {
				if (bottom > parentY + parentHeight) {
					x = r + marginLeft;
					y = parentY + marginTop;
					
					top = y;
					right = x + w + marginRight;
					bottom = y + h + marginBottom;
					left = x;
				}
			}
		}
		
		if (is(element, ContainerElement)) {
			bottom = top;
			right = left;
			
			element.each(function(child) {
				var last = placeElement(child, x, y, w, h, top, left, right, bottom);
				
				if (last.flow === 'horizontal' || last.flow === 'vertical') {
					top = range(parentY, top, last.top);
					right = Math.max(right, last.right);
					bottom = Math.max(bottom, last.bottom);
					left = range(parentX, left, last.left);
				}
			}, null, false);
		}
		
		element.top = top;
		element.right = right;
		element.bottom = bottom;
		element.left = left;
		
		offsetX = parseValue(element.offsetX, w);
		offsetY = parseValue(element.offsetY, h);
		
		if (isNumber(offsetX)) x += offsetX;
		if (isNumber(offsetY)) y += offsetY;
		
		element.screenX = x;
		element.screenY = y;
		
		element.parentX = x - parentX;
		element.parentY = y - parentY;
		
		element.renderWidth = w;
		element.renderHeight = h;
		
		return element;
	}
	
	function parseValue(val, relativeTo) {
		var num;
		
		if (isNumber(val)) return val;
		
		val = String(val);
		
		if (!isNumber(relativeTo)) return 0;
		
		switch(val) {
			case 'left': return 0;
			case 'center': return relativeTo / 2;
			case 'right': return relativeTo;
			
			case 'stick left': return relativeTo;
			case 'stick center': return relativeTo * 1.5;
			case 'stick right': return relativeTo * 2;
		}
		
		num = findFirstRegX(numRegX, val);
		
		if (isNull(num)) return 0;
		
		num = Number(num);
		
		if (startsWith(val, 'stick')) {
			if (endsWith(val, '%')) return relativeTo + relativeTo * num / 100;
			
			return relativeTo + num;
		} else {
			if (endsWith(val, '%')) return num * relativeTo / 100;
			
			return num;
		}
	}
	
	return function reflow() {
		this.eachLayer(eachLayer);
		
		return this;
	};
}());

/**
 * Displays the elements
 *
 * @method
 * @name Scene#paint
 * @returns {Scene} this
**/
sceneProto.paint = (function() {
	function render(layer) {
		if (layer.live) layer.render();
	}
	
	return function paint() {
		this.eachLayer(render);
		
		return this;
	};
}());

/**
 * Returns the string value of the scene
 *
 * @returns {String}
**/
sceneProto.toString = function() {
	return 'Chill Scene';
};

// File: core/elementTypes/AbstractElement.js
/**
 * Creates a new AbstractElement
 *
 * @class AbstractElement
 * @param {String} [type]
 * @param {Object} [use]
 * @param {Array} [args]
 * @description todoc
**/
function AbstractElement(type, use, args) {
	this.type = type;
	this.args = isUndefined(args) ? [] : Array.prototype.concat(args);
	
	if (isObject(use)) this.use = use;
}

/** @lends AbstractElement# **/
var abstractElementProto = AbstractElement.prototype = stdClass();
abstractElementProto.constructor = AbstractElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'AbstractElement'
 * @readonly
**/
abstractElementProto.elementType = 'AbstractElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Abstract'
 * @readonly
**/
abstractElementProto.elementName = 'Abstract';

/**
 * The type of the instance
 *
 * @type String
 * @default null
**/
abstractElementProto.type = null;

/**
 * The default "use"-data of the instance
 *
 * @type Object
 * @default null
**/
abstractElementProto.use = null;

/**
 * The constructor arguments of the instance
 *
 * @type Array
 * @default null
**/
abstractElementProto.args = null;

/**
 * Creates a new element
 *
 * @returns {?Element}
**/
abstractElementProto.instantiate = function() {
	var constructor = $elements.getInstantiatable(this.type)
	, element = null;
	
	if (!isNull(constructor)) {
		element = new (Function.prototype.bind.apply(constructor, this.args));
		element.edit(this.use);
	}
	
	return element;
};

$elements.addType(abstractElementProto.elementName, AbstractElement, false, false);

// File: core/elementTypes/ContainerElement.js
/**
 * Creates a new ContainerElement
 *
 * @class ContainerElement
 * @extends Element
 * @param {String} id
 * @param {Object} [elementUse]
 * @description todoc
**/
function ContainerElement(id, elementUse) {
	Element.call(this);
	privateContainerElement.call(this);
	
	this.id = String(id);
	
	this.classList.add(containerElementProto.elementType, 1);
	
	this.edit(elementUse);
}

/** @lends ContainerElement# **/
var containerElementProto = ContainerElement.prototype = Object.create(Element.prototype);
containerElementProto.constructor = ContainerElement;

function privateContainerElement() {
	var _elements = new OrderedList();
	
	/**
	 * Adds an element to the ContainerElement
	 *
	 * @alias ContainerElement#add
	 * @param {Element} element
	 * @param {int} [orderID]
	 * @returns {ContainerElement} this
	**/
	this.add = function(element, orderID) {
		_elements.add(element, orderID);
		
		return this;
	};
	
	/**
	 * Adds an element to the ContainerElement exactly before the given reference element
	 *
	 * @alias ContainerElement#addBefore
	 * @param {Element} element
	 * @param {Element} reference
	 * @returns {ContainerElement} this
	**/
	this.addBefore = function(element, reference) {
		_elements.addBefore(element, reference);
		
		return this;
	};
	
	/**
	 * Adds an element to the ContainerElement exactly after the given reference element
	 *
	 * @alias ContainerElement#addAfter
	 * @param {Element} element
	 * @param {Element} reference
	 * @returns {ContainerElement} this
	**/
	this.addAfter = function(element, reference) {
		_elements.addAfter(element, reference);
		
		return this;
	};
	
	/**
	 * Checks if the ContainerElement contains a specific element
	 *
	 * @alias ContainerElement#has
	 * @param {Element} searchElement
	 * @returns {Boolean}
	**/
	this.has = function(searchElement) {
		return _elements.has(searchElement);
	};
	
	/**
	 * Removes an element from the ContainerElement
	 *
	 * @alias ContainerElement#remove
	 * @param {Element} element
	 * @returns {?Element} removed
	**/
	this.remove = function(element) {
		return _elements.remove(element);
	};
	
	/**
	 * Returns the number of elements in the ContainerElement
	 *
	 * @alias ContainerElement#count
	 * @param {Boolean} ifRecursive
	 * @returns {int}
	**/
	this.count = function(ifRecursive) {
		var count = _elements.count;
		
		if (ifRecursive === true) {
			this.each(function(element) {
				if (is(element, ContainerElement)) count += element.count;
			});
		}
		
		return count;
	};
	
	/**
	 * Returns an array of all the elements in the ContainerElement
	 *
	 * @alias ContainerElement#getElements
	 * @returns {Array}
	**/
	this.getElements = function() {
		return _elements.all();
	};
	
	/**
	 * Returns the first element
	 *
	 * @alias ContainerElement#first
	 * @returns {?Element}
	**/
	this.first = function() {
		return _elements.first();
	};
	
	/**
	 * Returns the last element
	 *
	 * @alias ContainerElement#last
	 * @returns {?Element}
	**/
	this.last = function() {
		return _elements.last();
	};
	
	/**
	 * Executes a provided callback function once per element in ascending order
	 *
	 * @alias ContainerElement#each
	 * @param {Function} callback
	 * @param {*} [thisArg]
	 * @param {Boolean} [ifRecursive]
	 * @returns {ContainerElement} this
	**/
	this.each = function(callback, thisArg, ifRecursive) {
		_elements.each(function(element) {
			callback.call(thisArg, element);
			
			if (ifRecursive !== false && is(element, ContainerElement)) {
				element.each(callback, thisArg);
			}
		});
		
		return this;
	};
	
	return this;
}

/**
 * The type of the element
 *
 * @type String
 * @default 'ContainerElement'
 * @readonly
**/
containerElementProto.elementType = 'ContainerElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Container'
 * @readonly
**/
containerElementProto.elementName = 'Container';

/**
 * Draws the container background to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {ContainerElement} this
**/
containerElementProto.draw = function(ctx) {
	var bg = this.background;
	
	if (isString(bg) && bg.length > 0) {
		ctx.beginPath();
		ctx.fillStyle = bg;
		ctx.fillRect(this.screenX, this.screenY, this.renderWidth, this.renderHeight);
	}
	
	return this;
};

var containerElementClass = stdClass();
containerElementClass.width = 'fit';
containerElementClass.height = 'fit';

$elements.addType(containerElementProto.elementName, ContainerElement, true, true);
$classes.set(containerElementProto.elementType, containerElementClass);

// File: core/elementTypes/PolygonElement.js
/**
 * Creates a new PolygonElement
 *
 * @class PolygonElement
 * @extends Element
 * @description todoc
**/
function PolygonElement() {
	Element.call(this);
	
	this.classList.add(polygonElementProto.elementType, 1);
	
	forIn(polygonElementClass, this.addProp, this);
}

/** @lends PolygonElement# **/
var polygonElementProto = PolygonElement.prototype = Object.create(Element.prototype);
polygonElementProto.constructor = PolygonElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'PolygonElement'
 * @readonly
**/
polygonElementProto.elementType = 'PolygonElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Polygon'
 * @readonly
**/
polygonElementProto.elementName = 'Polygon';

/**
 * The vertices of the element
 *
 * @type Array
 * @default null
**/
polygonElementProto.vertices = null;

/**
 * The fill color of the polygon
 *
 * @type String
 * @default ''
**/
polygonElementProto.fill = '';

/**
 * The stroke width of the polygon
 *
 * @type Number
 * @default 1
**/
polygonElementProto.strokeWidth = 1;

/**
 * The stroke color of the polygon
 *
 * @type String
 * @default '#000000'
**/
polygonElementProto.strokeColor = '#000000';

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {PolygonElement} this
**/
polygonElementProto.draw = function(ctx) {
	var vs = this.vertices
	, i = 0
	, il = vs.length
	, x = this.screenX
	, y = this.screenY
	, w = this.renderWidth
	, h = this.renderHeight;
	
	if (il > 0) {
		ctx.beginPath();
		ctx.lineWidth = this.strokeWidth;
		ctx.strokeStyle = this.strokeColor;
		
		ctx.moveTo(
			x + vs[i][0] * w,
			y + vs[i][1] * h
		);
		
		for (++i; i < il; i++) {
			ctx.lineTo(
				x + vs[i][0] * w,
				y + vs[i][1] * h
			);
		}
		
		if (il > 2) {
			ctx.closePath();
			
			if (this.fill) {
				ctx.fillStyle = this.fill;
				ctx.fill();
			}
		}
		
		ctx.stroke();
	}
	
	return this;
};

var polygonElementClass = $classes.fromPrototype(polygonElementProto, ['elementType', 'elementName']);

$elements.addType(polygonElementProto.elementName, PolygonElement, false, true);
$classes.set(polygonElementProto.elementType, polygonElementClass);

// File: core/elementTypes/LineElement.js
/**
 * Creates a new LineElement
 *
 * @class LineElement
 * @extends PolygonElement
 * @param {Object} [elementUse]
 * @description todoc
**/
function LineElement(elementUse) {
	this.vertices = [[0, 0], [1, 1]];
	
	PolygonElement.call(this);
	
	this.classList.add(lineElementProto.elementType, 2);
	
	this.edit(elementUse);
}

/** @lends LineElement# **/
var lineElementProto = LineElement.prototype = Object.create(PolygonElement.prototype);
lineElementProto.constructor = LineElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'LineElement'
 * @readonly
**/
lineElementProto.elementType = 'LineElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Line'
 * @readonly
**/
lineElementProto.elementName = 'Line';

$elements.addType(lineElementProto.elementName, LineElement, true, true);

// File: core/elementTypes/TriangleElement.js
/**
 * Creates a new TriangleElement
 *
 * @class TriangleElement
 * @extends PolygonElement
 * @param {Object} [elementUse]
 * @description todoc
**/
function TriangleElement(elementUse) {
	this.vertices = [[0.5, 0], [1, 1], [0, 1]];
	
	PolygonElement.call(this);
	
	this.classList.add(triangleElementProto.elementType, 2);
	
	this.edit(elementUse);
}

/** @lends TriangleElement# **/
var triangleElementProto = TriangleElement.prototype = Object.create(PolygonElement.prototype);
triangleElementProto.constructor = TriangleElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'TriangleElement'
 * @readonly
**/
triangleElementProto.elementType = 'TriangleElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Triangle'
 * @readonly
**/
triangleElementProto.elementName = 'Triangle';

$elements.addType(triangleElementProto.elementName, TriangleElement, true, true);

// File: core/elementTypes/RectangleElement.js
/**
 * Creates a new RectangleElement
 *
 * @class RectangleElement
 * @extends PolygonElement
 * @param {Object} [elementUse]
 * @description todoc
**/
function RectangleElement(elementUse) {
	this.vertices = [[0, 0], [1, 0], [1, 1], [0, 1]];
	
	PolygonElement.call(this);
	
	this.classList.add(rectangleElementProto.elementType, 2);
	
	this.edit(elementUse);
}

/** @lends RectangleElement# **/
var rectangleElementProto = RectangleElement.prototype = Object.create(PolygonElement.prototype);
rectangleElementProto.constructor = RectangleElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'RectangleElement'
 * @readonly
**/
rectangleElementProto.elementType = 'RectangleElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Rectangle'
 * @readonly
**/
rectangleElementProto.elementName = 'Rectangle';

$elements.addType(rectangleElementProto.elementName, RectangleElement, true, true);

// File: core/elementTypes/PentagonElement.js
/**
 * Creates a new PentagonElement
 *
 * @class PentagonElement
 * @extends PolygonElement
 * @param {Object} [elementUse]
 * @description todoc
**/
function PentagonElement(elementUse) {
	this.vertices = [[0.5, 0], [1, 0.4], [0.8, 1], [0.2, 1], [0, 0.4]];
	
	PolygonElement.call(this);
	
	this.classList.add(pentagonElementProto.elementType, 2);
	
	this.edit(elementUse);
}

/** @lends PentagonElement# **/
var pentagonElementProto = PentagonElement.prototype = Object.create(PolygonElement.prototype);
pentagonElementProto.constructor = PentagonElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'PentagonElement'
 * @readonly
**/
pentagonElementProto.elementType = 'PentagonElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Pentagon'
 * @readonly
**/
pentagonElementProto.elementName = 'Pentagon';

$elements.addType(pentagonElementProto.elementName, PentagonElement, true, true);

// File: core/elementTypes/HexagonElement.js
/**
 * Creates a new HexagonElement
 *
 * @class HexagonElement
 * @extends PolygonElement
 * @param {Object} [elementUse]
 * @description todoc
**/
function HexagonElement(elementUse) {
	this.vertices = [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]];
	
	PolygonElement.call(this);
	
	this.classList.add(hexagonElementProto.elementType, 2);
	
	this.edit(elementUse);
}

/** @lends HexagonElement# **/
var hexagonElementProto = HexagonElement.prototype = Object.create(PolygonElement.prototype);
hexagonElementProto.constructor = HexagonElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'HexagonElement'
 * @readonly
**/
hexagonElementProto.elementType = 'HexagonElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Hexagon'
 * @readonly
**/
hexagonElementProto.elementName = 'Hexagon';

$elements.addType(hexagonElementProto.elementName, HexagonElement, true, true);

// File: core/elementTypes/StarElement.js
/**
 * Creates a new StarElement
 *
 * @class StarElement
 * @extends PolygonElement
 * @param {Object} [elementUse]
 * @description todoc
**/
function StarElement(elementUse) {
	this.vertices = [[0, 1], [0.5, 0], [1, 1], [0, 0.3], [1, 0.3]];
	
	PolygonElement.call(this);
	
	this.classList.add(starElementProto.elementType, 2);
	
	this.edit(elementUse);
}

/** @lends StarElement# **/
var starElementProto = StarElement.prototype = Object.create(PolygonElement.prototype);
starElementProto.constructor = StarElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'StarElement'
 * @readonly
**/
starElementProto.elementType = 'StarElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Star'
 * @readonly
**/
starElementProto.elementName = 'Star';

$elements.addType(starElementProto.elementName, StarElement, true, true);

// File: core/elementTypes/CircleElement.js
/**
 * Creates a new CircleElement
 *
 * @class CircleElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function CircleElement(elementUse) {
	Element.call(this);
	
	this.classList.add(circleElementProto.elementType, 1);
	
	forIn(circleElementClass, this.addPropSafe, this);
	
	this.edit(elementUse);
}

/** @lends CircleElement# **/
var circleElementProto = CircleElement.prototype = Object.create(Element.prototype);
circleElementProto.constructor = CircleElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'CircleElement'
 * @readonly
**/
circleElementProto.elementType = 'CircleElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Circle'
 * @readonly
**/
circleElementProto.elementName = 'Circle';

/**
 * The radius of the circle
 *
 * @type Number
 * @default 10
**/
circleElementProto.r = 10;

/**
 * The fill color of the circle
 *
 * @type String
 * @default ''
**/
circleElementProto.fill = '';

/**
 * The stroke width of the circle
 *
 * @type Number
 * @default 1
**/
circleElementProto.strokeWidth = 1;

/**
 * The stroke color of the circle
 *
 * @type String
 * @default '#000000'
**/
circleElementProto.strokeColor = '#000000';

/**
 * Returns the auto width of the circle element
 *
 * @returns {Number}
**/
circleElementProto.measureWidth = function() {
	return this.r * 2;
};

/**
 * Returns the auto height of the circle element
 *
 * @returns {Number}
**/
circleElementProto.measureHeight = function() {
	return this.r * 2;
};

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {CircleElement} this
**/
circleElementProto.draw = function(ctx) {
	ctx.beginPath();
	ctx.lineWidth = this.strokeWidth;
	ctx.strokeStyle = this.strokeColor;
	
	ctx.arc(
		this.screenX + this.r,
		this.screenY + this.r,
		this.r,
		0,
		Math.PI * 2,
		true
	);
	
	ctx.stroke();
	
	if (this.fill !== '') {
		ctx.fillStyle = this.fill;
		ctx.fill();
	}
	
	return this;
};

var circleElementClass = $classes.fromPrototype(circleElementProto, ['elementType', 'elementName']);
circleElementClass.width = 'auto';
circleElementClass.height = 'auto';

$elements.addType(circleElementProto.elementName, CircleElement, true, true);
$classes.set(circleElementProto.elementType, circleElementClass);

// File: core/elementTypes/EllipseElement.js
/**
 * Creates a new EllipseElement
 *
 * @class EllipseElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function EllipseElement(elementUse) {
	Element.call(this);
	
	this.classList.add(ellipseElementProto.elementType, 1);
	
	forIn(ellipseElementClass, this.addProp, this);
	
	this.edit(elementUse);
}

/** @lends EllipseElement# **/
var ellipseElementProto = EllipseElement.prototype = Object.create(Element.prototype);
ellipseElementProto.constructor = EllipseElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'EllipseElement'
 * @readonly
**/
ellipseElementProto.elementType = 'EllipseElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Ellipse'
 * @readonly
**/
ellipseElementProto.elementName = 'Ellipse';

/**
 * The fill color of the ellipse
 *
 * @type String
 * @default ''
**/
ellipseElementProto.fill = '';

/**
 * The stroke width of the ellipse
 *
 * @type Number
 * @default 1
**/
ellipseElementProto.strokeWidth = 1;

/**
 * The stroke color of the ellipse
 *
 * @type String
 * @default '#000000'
**/
ellipseElementProto.strokeColor = '#000000';

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {EllipseElement} this
**/
ellipseElementProto.draw = function(ctx) {
	var kappa = 0.5522848
	
	, w = this.renderWidth / 2
	, h = this.renderHeight / 2
	, x = this.screenX
	, y = this.screenY
	
	, ox = w * kappa
	, oy = h * kappa
	, xm = x + w
	, ym = y + h
	, xe = xm + w
	, ye = ym + h;
	
	ctx.beginPath();
	ctx.lineWidth = this.strokeWidth;
	ctx.strokeStyle = this.strokeColor;
	
	ctx.moveTo(x, ym);
	
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	
	ctx.stroke();
	
	if (this.fill !== '') {
		ctx.fillStyle = this.fill;
		ctx.fill();
	}
	
	return this;
};

var ellipseElementClass = $classes.fromPrototype(ellipseElementProto, ['elementType', 'elementName']);

$elements.addType(ellipseElementProto.elementName, EllipseElement, true, true);
$classes.set(ellipseElementProto.elementType, ellipseElementClass);

// File: core/elementTypes/TextElement.js
/**
 * Creates a new TextElement
 *
 * @class TextElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function TextElement(elementUse) {
	Element.call(this);
	
	this.classList.add(textElementProto.elementType, 1);
	
	forIn(textElementClass, this.addPropSafe, this);
	
	this.edit(elementUse);
}

/** @lends TextElement# **/
var textElementProto = TextElement.prototype = Object.create(Element.prototype);
textElementProto.constructor = TextElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'TextElement'
 * @readonly
**/
textElementProto.elementType = 'TextElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Text'
 * @readonly
**/
textElementProto.elementName = 'Text';

/**
 * The text of the element
 *
 * @type String
 * @default null
**/
textElementProto.text = null;

/**
 * The color of the text
 *
 * @type String
 * @default '#000000'
**/
textElementProto.textColor = '#000000';

/**
 * Indents the first line of the text
 *
 * @type Number
 * @default 0
**/
textElementProto.textIndent = 0;

/**
 * Specifies the decoration added to the text
 *
 * @type String
 * @default 'none'
 * @todo Implement text decoration
**/
textElementProto.textDecoration = 'none';

/**
 * Controls the capitalization of text
 *
 * @type String
 * @default 'none'
**/
textElementProto.textTransform = 'none';

/**
 * Adds shadow to the text
 *
 * @type String
 * @default 'none'
 * @todo Implement text shadow
**/
textElementProto.textShadow = 'none';

/**
 * Specifies the font for the element
 *
 * @type String
 * @default 'sans-serif'
**/
textElementProto.fontFamily = 'sans-serif';

/**
 * Specifies the size of the font in px
 *
 * @type Number
 * @default 12
**/
textElementProto.fontSize = 12;

/**
 * Specifies the weight or boldness of the font
 *
 * @type String
 * @default 'normal'
**/
textElementProto.fontWeight = 'normal';

/**
 * Specifies the font style for a text
 *
 * @type String
 * @default 'normal'
**/
textElementProto.fontStyle = 'normal';

/**
 * Increases or decreases the space between characters in the text
 *
 * @type Number
 * @default 0
**/
textElementProto.letterSpacing = 0;

/**
 * The horizontal align of the text
 *
 * @type String
 * @default 'left'
**/
textElementProto.textAlign = 'left';

/**
 * The vertical align of the text
 *
 * @type String
 * @default 'top'
 * @todo Implement text baseline
**/
textElementProto.textBaseline = 'top';

/**
 * The height of each line
 *
 * @type String
 * @default 'auto'
**/
textElementProto.lineHeight = 'auto';

/**
 * Returns the auto width of the text element
 *
 * @returns {Number}
**/
textElementProto.measureWidth = function() {
	var ctx = $canvas.ctx
	, max = 0
	, lines = this.getLines()
	, i = 0
	, il = lines.length
	, width;
	
	ctx.font = this.getFontDescriptor();
	
	for (; i < il; i++) {
		width = ctx.measureText(lines[i]).width;
		
		if (width > max) max = width;
	}
	
	return max;
};

/**
 * Returns the auto height of the text element
 *
 * @returns {Number}
**/
textElementProto.measureHeight = function() {
	return this.getLines().length * this.getLineHeight();
};

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {TextElement} this
**/
textElementProto.draw = function(ctx) {
	var lines = this.getLines()
	, i = 1
	, il = lines.length
	, lh = this.getLineHeight()
	, x = this.screenX
	, y = this.screenY + ((lh - this.fontSize) / 2)
	, align = this.textAlign;
	
	ctx.beginPath();
	
	ctx.font = this.getFontDescriptor();
	ctx.textAlign = align;
	ctx.textBaseline = 'top'; /* this.textBaseline */;
	ctx.fillStyle = this.textColor;
	
	if (align === 'center') x += this.renderWidth / 2;
	if (align === 'right') x += this.renderWidth;
	
	ctx.fillText(lines[0], x + this.textIndent, y);
	
	for (; i < il; i++) {
		ctx.fillText(lines[i], x, y += lh);
	}
	
	return this;
};

/**
 * Returns the font data
 *
 * @returns {String}
**/
textElementProto.getFontDescriptor = function() {
	var font = '';
	
	if (this.fontWeight === 'bold') font += 'bold ';
	if (this.fontStyle === 'italic') font += 'italic ';
	
	font += this.fontSize + 'px ';
	font += this.fontFamily;
	
	return font;
};

/**
 * Returns the transformed text
 *
 * @returns {String}
**/
textElementProto.getTransformedText = function() {
	var text = String(this.text);
	
	switch(this.textTransform) {
		case 'lowercase': text = text.toLowerCase(); break;
		case 'uppercase': text = text.toUpperCase(); break;
		case 'capitalize': text = capitalize(text); break;
	}
	
	if (this.letterSpacing > 0) text = text.split('').join(repeatString(' ', this.letterSpacing));
	
	return text;
};

/**
 * Returns the line height
 *
 * @returns {Number}
**/
textElementProto.getLineHeight = function() {
	var lh = this.lineHeight;
	
	if (lh === 'auto') return this.fontSize;
	if (isPercent(lh)) return parsePercent(lh, this.fontSize);
	if (isNumber(getInt(lh))) return getInt(lh);
	
	return 0;
};

/**
 * Returns the transformed lines
 *
 * @returns {Array}
**/
textElementProto.getLines = function() {
	return this.getTransformedText().split(lineBreakRegX);
};

var textElementClass = $classes.fromPrototype(textElementProto, ['elementType', 'elementName']);
textElementClass.width = 'auto';
textElementClass.height = 'auto';

$elements.addType(textElementProto.elementName, TextElement, true, true);
$classes.set(textElementProto.elementType, textElementClass);

// File: core/elementTypes/ImageElement.js
/**
 * Creates a new ImageElement
 *
 * @class ImageElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function ImageElement(elementUse) {
	Element.call(this);
	
	this.classList.add(imageElementProto.elementType, 1);
	
	forIn(imageElementClass, this.addPropSafe, this);
	
	this.img = new Image();
	
	this.edit(elementUse);
}

/** @lends ImageElement# **/
var imageElementProto = ImageElement.prototype = Object.create(Element.prototype);
imageElementProto.constructor = ImageElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'ImageElement'
 * @readonly
**/
imageElementProto.elementType = 'ImageElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Image'
 * @readonly
**/
imageElementProto.elementName = 'Image';

/**
 * The x position of the source image to draw into the destination context
 *
 * @type Number|String
 * @default 0
**/
imageElementProto.sourceX = 0;

/**
 * The y position of the source image to draw into the destination context
 *
 * @type Number|String
 * @default 0
**/
imageElementProto.sourceY = 0;

/**
 * The width of the source image to draw into the destination context
 *
 * @type Number|String
 * @default '100%'
**/
imageElementProto.sourceWidth = '100%';

/**
 * The height of the source image to draw into the destination context
 *
 * @type Number|String
 * @default '100%'
**/
imageElementProto.sourceHeight = '100%';

/**
 * The image of the element
 *
 * @type Image
 * @default null
 * @readonly
**/
imageElementProto.img = null;

/**
 * The source of the image
 *
 * @name ImageElement#src
 * @type String
 * @default ''
**/
Object.defineProperty(imageElementProto, 'src', {
	get: function() {
		return this.img.src;
	},
	set: function(newVal) {
		if (startsWith(newVal, '#')) {
			newVal = $assets.getByID(Loader.IMG, newVal.slice(1)).src;
		}
		
		return this.img.src = newVal;
	}
});

/**
 * Gets the auto width of the element
 *
 * @returns {Number}
**/
imageElementProto.measureWidth = function() {
	var sourceWidth = this.sourceWidth;
	
	if (isNumber(sourceWidth)) return sourceWidth;
	if (isPercent(sourceWidth)) return parsePercent(sourceWidth, img.width);
	
	return this.img.width;
};

/**
 * Gets the auto height of the element
 *
 * @returns {Number}
**/
imageElementProto.measureHeight = function() {
	var sourceHeight = this.sourceHeight;
	
	if (isNumber(sourceHeight)) return sourceHeight;
	if (isPercent(sourceHeight)) return parsePercent(sourceHeight, img.height);
	
	return this.img.height;
};

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {ImageElement} this
**/
imageElementProto.draw = function(ctx) {
	var img = this.img, sx, sy;
	
	if (img.complete === true) {
		if (isPercent(sx = this.sourceX)) sx = parsePercent(sx, img.width);
		if (isPercent(sy = this.sourceY)) sy = parsePercent(sy, img.height);
		
		ctx.drawImage(img,
			sx, sy,
			this.measureWidth(), this.measureHeight(),
			this.screenX, this.screenY,
			this.renderWidth, this.renderHeight
		);
	}
	
	return this;
};

var imageElementClass = $classes.fromPrototype(imageElementProto, ['elementType', 'elementName']);
imageElementClass.width = 'auto';
imageElementClass.height = 'auto';

$elements.addType(imageElementProto.elementName, ImageElement, true, true);
$classes.set(imageElementProto.elementType, imageElementClass);

// File: core/elementTypes/SpriteSheetElement.js
/**
 * Creates a new SpriteSheetElement
 *
 * @class SpriteSheetElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function SpriteSheetElement(elementUse) {
	Element.call(this);
	
	this.classList.add(spriteSheetElementProto.elementType, 1);
	
	forIn(spriteSheetElementClass, this.addPropSafe, this);
	
	this.img = new Image();
	this.frames = [];
	this.animations = stdClass();
	this.currentAnimationFrame = { x: 0, y: 0 };
	
	this.edit(elementUse);
}

/** @lends SpriteSheetElement# **/
var spriteSheetElementProto = SpriteSheetElement.prototype = Object.create(Element.prototype);
spriteSheetElementProto.constructor = SpriteSheetElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'SpriteSheetElement'
 * @readonly
**/
spriteSheetElementProto.elementType = 'SpriteSheetElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'SpriteSheet'
 * @readonly
**/
spriteSheetElementProto.elementName = 'SpriteSheet';

/**
 * The x position of the source spriteSheet to draw into the destination context
 *
 * @type Number|String
 * @default 0
**/
spriteSheetElementProto.sourceX = 0;

/**
 * The y position of the source spriteSheet to draw into the destination context
 *
 * @type Number|String
 * @default 0
**/
spriteSheetElementProto.sourceY = 0;

/**
 * The width of each frame
 *
 * @type Number|String
 * @default 0
**/
spriteSheetElementProto.frameWidth = 0;

/**
 * The height of each frame
 *
 * @type Number|String
 * @default 0
**/
spriteSheetElementProto.frameHeight = 0;

/**
 * The spriteSheet of the element
 *
 * @type Image
 * @default null
 * @readonly
**/
spriteSheetElementProto.img = null;

/**
 * The source of the spriteSheet
 *
 * @name SpriteSheetElement#src
 * @type String
 * @default ''
**/
Object.defineProperty(spriteSheetElementProto, 'src', {
	get: function() {
		return this.img.src;
	},
	set: function(newVal) {
		if (startsWith(newVal, '#')) {
			newVal = $assets.getByID(Loader.IMG, newVal.slice(1)).src;
		}
		
		return this.img.src = newVal;
	}
});

/**
 * The animations of the sprite
 *
 * @type Object
 * @default null
 * @readonly
**/
spriteSheetElementProto.animations = null;

/**
 * The frames of the sprite
 *
 * @type Array
 * @default null
 * @readonly
**/
spriteSheetElementProto.frames = null;

/**
 * The tick of the sprite
 *
 * @type int
 * @default 0
 * @readonly
**/
spriteSheetElementProto.tick = 0;

/**
 * The current animation of the sprite
 *
 * @type String
 * @default ''
**/
spriteSheetElementProto.currentAnimation = 'default';

/**
 * The current frame of the sprite
 *
 * @type int
 * @default 0
**/
spriteSheetElementProto.currentFrame = 0;

/**
 * The current animationframe of the sprite
 *
 * @type Object
 * @default null
 * @readonly
**/
spriteSheetElementProto.currentAnimationFrame = null;

/**
 * The frame rate of the sprite
 *
 * @type int
 * @default 7
**/
spriteSheetElementProto.frameRate = 7;

/**
 * The spacing of each frame
 *
 * @type int
 * @default 0
**/
spriteSheetElementProto.frameSpacing = 0;

/**
 * Indicates whether the sprite should be animated or not
 *
 * @type Boolean
 * @default false
**/
spriteSheetElementProto.paused = false;

/**
 * Adds an animation
 *
 * @param {String} key
 * @param {Object} animData
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.addAnimation = function(key, animData) {
	this.animations[key] = stdClass();
	
	assign(this.animations[key], {
		frames: [],
		next: key,
		frameRate: this.frameRate,
		direction: 'forward'
	});
	
	return this.editAnimation(key, animData);
};

/**
 * Edits an animation
 *
 * @param {String} key
 * @param {Object} animData
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.editAnimation = function(key, animData) {
	var animation;
	
	if (has(this.animations, key)) {
		animation = this.animations[key];
		
		if (isArray(animData.frames)) {
			empty(animation.frames);
			animation.frames.push.apply(animation.frames, animData.frames);
		}
		
		if (isString(animData.next)) {
			animation.next = animData.next;
		}
		
		if (isNumber(animData.frameRate)) {
			animation.frameRate = animData.frameRate;
		}
		
		if (animData.direction === 'forward' || animData.direction === 'backward') {
			animation.direction = animData.direction;
		}
	}
	
	return this;
};

/**
 * Removes an animation
 *
 * @param {String} key
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.removeAnimation = function(key) {
	delete this.animations[key];
	
	return this;
};

/**
 * Sets the frameWidth and frameHeight properties
 *
 * @param {int} rows
 * @param {int} cols
 * @param {int} [width]
 * @param {int} [height]
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.setFrameSize = function(rows, cols, width, height) {
	var w = 0, h = 0;
	
	if (isNumber(width) && isNumber(height)) {
		w = width;
		h = height;
	} else if (this.img.complete === true) {
		w = this.img.width;
		h = this.img.height;
	}
	
	this.frameWidth = this.img.width / cols - 2 * this.frameSpacing;
	this.frameHeight = this.img.height / rows - 2 * this.frameSpacing;
	
	return this.setFrames();
};

/**
 * Sets the frames
 *
 * @param {int} [count]
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.setFrames = function(count) {
	var i, sx, sy, x, y, w, h, sprite, args, onLoad;
	
	if (this.img.complete === true) {
		i = 0;
		
		if (!isNumber(count)) count = Infinity;
		
		empty(this.frames);
		
		w = this.img.width;
		h = this.img.height;
		
		if (isPercent(sx = this.sourceX)) sx = parsePercent(sx, this.frameWidth);
		if (isPercent(sy = this.sourceY)) sy = parsePercent(sy, this.frameHeight);
		
		vertical: for (y = sy; y < h; y += this.frameHeight) {
			horizontal: for (x = sx; x < w; x += this.frameWidth) {
				this.frames.push({ x: x, y: y });
				
				if (++i >= count) break vertical;
			}
		}
	} else {
		sprite = this;
		args = getArgs(arguments);
		onLoad = function() {
			sprite.setFrames.apply(sprite, args);
			sprite.img.removeEventListener('load', onLoad);
		};
		
		this.img.addEventListener('load', onLoad);
	}
	
	return this;
};

/**
 * Starts the animation
 *
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.start = function() {
	this.paused = false;
	
	return this;
};

/**
 * Stops the animation
 *
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.stop = function() {
	this.paused = true;
	
	return this;
};

/**
 * Gets the auto width of the element
 *
 * @returns {Number}
**/
spriteSheetElementProto.measureWidth = function() {
	var width = this.frameWidth;
	
	return isPercent(width) ? parsePercent(width, this.img.width) : width;
};

/**
 * Gets the auto height of the element
 *
 * @returns {Number}
**/
spriteSheetElementProto.measureHeight = function() {
	var height = this.frameHeight;
	
	return isPercent(height) ? parsePercent(height, this.img.height) : height;
};

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.draw = function(ctx) {
	var img = this.img
	, sw, sh, animation, frameRate, frames;
	
	if (img.complete === true) {
		if (isPercent(sw = this.frameWidth)) sw = parsePercent(sw, img.width);
		if (isPercent(sh = this.frameHeight)) sh = parsePercent(sh, img.height);
		
		if (this.paused === false && has(this.animations, this.currentAnimation)) {
			animation = this.animations[this.currentAnimation];
			frames = animation.frames;
			frameRate = isNumber(animation.frameRate) ? animation.frameRate : this.frameRate;
			
			if (++this.tick >= frameRate && frames.length > 0) {
				if (animation.direction === 'backward') {
					if (--this.currentFrame <= 0) {
						if (animation.next === this.currentAnimation && animation.loop === true) {
							this.currentFrame = frames.length - 1;
						} else {
							if (has(this.animations, animation.next)) this.currentAnimation = animation.next;
							
							this.currentFrame = 0;
						}
					}
				} else {
					if (++this.currentFrame >= frames.length) {
						if (animation.next === this.currentAnimation && animation.loop === true) {
							this.currentFrame = 0;
						} else {
							if (has(this.animations, animation.next)) this.currentAnimation = animation.next;
							
							this.currentFrame = 0;
						}
					}
				}
				
				this.currentAnimationFrame = this.frames[frames[this.currentFrame]];
				
				this.tick = 0;
			}
		}
		
		ctx.drawImage(img,
			this.currentAnimationFrame.x, this.currentAnimationFrame.y,
			sw, sh,
			this.screenX, this.screenY,
			this.renderWidth, this.renderHeight
		);
	}
	
	return this;
};

var spriteSheetElementClass = stdClass();
spriteSheetElementClass.width = 'auto';
spriteSheetElementClass.height = 'auto';
spriteSheetElementClass.frameRate = spriteSheetElementProto.frameRate;

$elements.addType(spriteSheetElementProto.elementName, SpriteSheetElement, true, true);
$classes.set(spriteSheetElementProto.elementType, spriteSheetElementClass);

// File: main.js
/**
 * Chill namespace
 *
 * @namespace Chill
 * @description todoc
**/
var Chill = stdClass();

/**
 * Creates a new Chill application
 *
 * @class Chill.App
 * @extends EventTarget
 * @memberof Chill
 * @param {Object|String} settings
 * @description todoc
**/
Chill.App = function(settings) {
	this.appData = settings;
};

/** @lends Chill.App# **/
var chillAppProto = Chill.App.prototype = stdClass();
chillAppProto.constructor = Chill.App;

/**
 * The data of the application
 *
 * @type Object
 * @default null
 * @readonly
**/
chillAppProto.appData = null;

/**
 * Returns the string value of the application
 * 
 * @returns {String}
**/
chillAppProto.toString = function() {
	return 'Chill App';
};

/**
 * Creates a new Chill debugger
 *
 * @class Chill.Debugger
 * @memberof Chill
 * @param {Scene} scene
 * @description todoc
**/
Chill.Debugger = function(scene) {
	this.scene = scene;
};

/** @lends Chill.Debugger# **/
var chillDebuggerProto = Chill.Debugger.prototype = stdClass();
chillDebuggerProto.constructor = Chill.Debugger;

/**
 * The scene of the debugger
 *
 * @type Scene
 * @default null
 * @readonly
**/
chillDebuggerProto.scene = null;

/**
 * Adds an element to the scene
 * 
 * @param {Layer} layer
 * @param {int} count
 * @param {String} [elementType = 'Text']
 * @param {Function} [callback]
 * @returns {Scene}
**/
chillDebuggerProto.addElements = function(layer, count, elementType, callback) {
	elementType = isUndefined(elementType) ? 'Text' : elementType;
	
	repeat(count, function(i) {
		var element = layer.create(elementType);
		
		layer.add(element);
		
		if (isFunction(callback)) callback(element, i);
	});
	
	return this.scene;
};

/**
 * Instantiates a chill application
 *
 * @memberof Chill
 * @param {Chill.App} app
 * @param {String|HTMLElement} wrapper
 * @param {Function} [callback]
 * @returns {Scene}
**/
Chill.out = function(app, wrapper, callback) {
	var scene;
	
	if (isString(wrapper)) wrapper = doc.getElementById(wrapper);
	
	if (!is(wrapper, HTMLElement)) die('the given wrapper not an html element');
	
	if (wrapper.children.length > 0) warning('wrapper should be empty');
	
	wrapper.classList.add('chill-wrapper');
	scene = new Scene(wrapper);
	
	if (!(app instanceof Chill.App)) {
		warning('app not instance of Chill\\App');
	}
	
	scene.include(app.appData, callback);
	
	return scene;
};

/**
 * Creates a new class
 *
 * @memberof Chill
 * @param {String} className
 * @param {Object} classData
 * @returns {Object} Chill
**/
Chill.createClass = function(className, classData) {
	$classes.set(className, classData);
	
	return this;
};

/**
 * Creates a new mask
 *
 * @memberof Chill
 * @param {String} maskID
 * @param {Function} mask
 * @returns {Object} Chill
**/
Chill.createMask = function(maskID, mask) {
	if (isFunction(mask)) {
		$masks.set(maskID, mask);
	}
	
	return this;
};

/**
 * Creates an AbstractElement
 *
 * @method
 * @name Chill.createAbstractElement
 * @param {String} elementID
 * @param {String} elementType
 * @param {Object} [elementUse]
 * @param {Array} [args]
 * @returns {Chill} this
 * @see Scene#createAbstractElement
**/
Chill.createAbstractElement = sceneProto.createAbstractElement;

/**
 * Creates a new plugin
 *
 * @memberof Chill
 * @param {String} pluginID
 * @param {Function} pluginConstructor
 * @param {Object} [pluginConfig]
 * @param {Boolean} [force]
 * @returns {Object} Chill
**/
Chill.createPlugin = function(pluginID, pluginConstructor, pluginConfig, force) {
	var exists = $plugins.has(pluginID)
	, plugin, config;
	
	if (exists && force !== true) {
		warning('plugin "' + pluginID + '" already exists');
	} else {
		if (!isFunction(pluginConstructor)) {
			warning('invalid plugin constructor type');
		} else {
			plugin = stdClass();
			config = stdClass();
			
			if (isObject(pluginConfig)) assign(config, pluginConfig);
			
			plugin.constructor = pluginConstructor;
			plugin.config = config;
			
			$plugins.set(pluginID, plugin);
		}
	}
	
	return this;
};

/**
 * Creates a new Element type
 *
 * @memberof Chill
 * @param {String} type
 * @param {Object} createData
 * @param {Function} createData.constructor
 * @param {Function|Object} [createData.prototype]
 * @param {String} [createData.extends]
 * @param {Boolean} [createData.instantiatable]
 * @param {Boolean} [createData.extendable]
 * @returns {Object} Chill
**/
Chill.createElementType = function(type, createData) {
	var parent, prototype, constructor;
	
	if (!isFunction(createData.constructor)) {
		warning('Constructor is required to create a new element type');
	} else if ($elements.hasType(type)) {
		warning('Cannot create "' + type + '", type already exists');
	} else {
		parent = $elements.getExtendable(createData.extends);
		
		if (isNull(parent)) {
			if (!isUndefined(createData.extends)) warning('Cannot extend "' + createData.extends + '", type does not exists, fall back to default: Element');
			
			parent = Element;
		}
		
		prototype = Object.create(parent.prototype);
		
		constructor = function CustomElement() {
			var args = getArgs(arguments);
			
			parent.call(this, args);
			createData.constructor.apply(this, args);
		};
		
		if (isFunction(createData.prototype)) {
			createData.prototype.call(prototype);
		} else if (isObject(createData.prototype)) {
			assign(prototype, createData.prototype);
		}
		
		constructor.prototype = prototype;
		constructor.prototype.constructor = constructor;
		
		$elements.addType(type, constructor, createData.instantiatable, createData.extendable);
	}
	
	return this;
};

window.Chill = Chill;

// File: moduleFooter.js
}(this));

