/**
 * Creates a new HexagonElement
 *
 * @class HexagonElement
 * @extends PolygonElement
 * @param {Object} [elementUse]
 * @description todoc
**/
function HexagonElement(elementUse) {
	this.vertices = [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]];
	
	PolygonElement.call(this);
	
	this.classList.add(hexagonElementProto.elementType, 2);
	
	this.edit(elementUse);
}

/** @lends HexagonElement# **/
var hexagonElementProto = HexagonElement.prototype = Object.create(PolygonElement.prototype);
hexagonElementProto.constructor = HexagonElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'HexagonElement'
 * @readonly
**/
hexagonElementProto.elementType = 'HexagonElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Hexagon'
 * @readonly
**/
hexagonElementProto.elementName = 'Hexagon';

$elements.addType(hexagonElementProto.elementName, HexagonElement, true, true);
