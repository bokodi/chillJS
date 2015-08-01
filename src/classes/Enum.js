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
