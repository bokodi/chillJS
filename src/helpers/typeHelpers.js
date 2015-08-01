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
