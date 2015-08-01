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
