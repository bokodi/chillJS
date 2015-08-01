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
