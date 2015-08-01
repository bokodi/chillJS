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
