/**
 * Creates a new PolygonElement
 *
 * @class PolygonElement
 * @extends Element
 * @description todoc
**/
function PolygonElement() {
	Element.call(this);
	
	this.classList.add(polygonElementProto.elementType, 1);
	
	forIn(polygonElementClass, this.addProp, this);
}

/** @lends PolygonElement# **/
var polygonElementProto = PolygonElement.prototype = Object.create(Element.prototype);
polygonElementProto.constructor = PolygonElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'PolygonElement'
 * @readonly
**/
polygonElementProto.elementType = 'PolygonElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Polygon'
 * @readonly
**/
polygonElementProto.elementName = 'Polygon';

/**
 * The vertices of the element
 *
 * @type Array
 * @default null
**/
polygonElementProto.vertices = null;

/**
 * The fill color of the polygon
 *
 * @type String
 * @default ''
**/
polygonElementProto.fill = '';

/**
 * The stroke width of the polygon
 *
 * @type Number
 * @default 1
**/
polygonElementProto.strokeWidth = 1;

/**
 * The stroke color of the polygon
 *
 * @type String
 * @default '#000000'
**/
polygonElementProto.strokeColor = '#000000';

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {PolygonElement} this
**/
polygonElementProto.draw = function(ctx) {
	var vs = this.vertices
	, i = 0
	, il = vs.length
	, x = this.screenX
	, y = this.screenY
	, w = this.renderWidth
	, h = this.renderHeight;
	
	if (il > 0) {
		ctx.beginPath();
		ctx.lineWidth = this.strokeWidth;
		ctx.strokeStyle = this.strokeColor;
		
		ctx.moveTo(
			x + vs[i][0] * w,
			y + vs[i][1] * h
		);
		
		for (++i; i < il; i++) {
			ctx.lineTo(
				x + vs[i][0] * w,
				y + vs[i][1] * h
			);
		}
		
		if (il > 2) {
			ctx.closePath();
			
			if (this.fill) {
				ctx.fillStyle = this.fill;
				ctx.fill();
			}
		}
		
		ctx.stroke();
	}
	
	return this;
};

var polygonElementClass = $classes.fromPrototype(polygonElementProto, ['elementType', 'elementName']);

$elements.addType(polygonElementProto.elementName, PolygonElement, false, true);
$classes.set(polygonElementProto.elementType, polygonElementClass);
