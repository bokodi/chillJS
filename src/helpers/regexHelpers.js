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
