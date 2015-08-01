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
