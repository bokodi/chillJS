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
