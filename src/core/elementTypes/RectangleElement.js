/**
 * Creates a new RectangleElement
 *
 * @class RectangleElement
 * @extends PolygonElement
 * @param {Object} [elementUse]
 * @description todoc
**/
function RectangleElement(elementUse) {
	this.vertices = [[0, 0], [1, 0], [1, 1], [0, 1]];
	
	PolygonElement.call(this);
	
	this.classList.add(rectangleElementProto.elementType, 2);
	
	this.edit(elementUse);
}

/** @lends RectangleElement# **/
var rectangleElementProto = RectangleElement.prototype = Object.create(PolygonElement.prototype);
rectangleElementProto.constructor = RectangleElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'RectangleElement'
 * @readonly
**/
rectangleElementProto.elementType = 'RectangleElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Rectangle'
 * @readonly
**/
rectangleElementProto.elementName = 'Rectangle';

$elements.addType(rectangleElementProto.elementName, RectangleElement, true, true);
