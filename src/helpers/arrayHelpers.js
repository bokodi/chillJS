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
