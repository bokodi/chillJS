/**
 * Creates a new LineElement
 *
 * @class LineElement
 * @extends PolygonElement
 * @param {Object} [elementUse]
 * @description todoc
**/
function LineElement(elementUse) {
	this.vertices = [[0, 0], [1, 1]];
	
	PolygonElement.call(this);
	
	this.classList.add(lineElementProto.elementType, 2);
	
	this.edit(elementUse);
}

/** @lends LineElement# **/
var lineElementProto = LineElement.prototype = Object.create(PolygonElement.prototype);
lineElementProto.constructor = LineElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'LineElement'
 * @readonly
**/
lineElementProto.elementType = 'LineElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Line'
 * @readonly
**/
lineElementProto.elementName = 'Line';

$elements.addType(lineElementProto.elementName, LineElement, true, true);
