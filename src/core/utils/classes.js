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

$methods.createClass = function(className, classData) {
	$classes.set(className, classData);
	
	return this;
};
