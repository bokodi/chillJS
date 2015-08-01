/**
 * Creates a new PentagonElement
 *
 * @class PentagonElement
 * @extends PolygonElement
 * @param {Object} [elementUse]
 * @description todoc
**/
function PentagonElement(elementUse) {
	this.vertices = [[0.5, 0], [1, 0.4], [0.8, 1], [0.2, 1], [0, 0.4]];
	
	PolygonElement.call(this);
	
	this.classList.add(pentagonElementProto.elementType, 2);
	
	this.edit(elementUse);
}

/** @lends PentagonElement# **/
var pentagonElementProto = PentagonElement.prototype = Object.create(PolygonElement.prototype);
pentagonElementProto.constructor = PentagonElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'PentagonElement'
 * @readonly
**/
pentagonElementProto.elementType = 'PentagonElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Pentagon'
 * @readonly
**/
pentagonElementProto.elementName = 'Pentagon';

$elements.addType(pentagonElementProto.elementName, PentagonElement, true, true);
