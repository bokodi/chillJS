/**
 * Creates a new EllipseElement
 *
 * @class EllipseElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function EllipseElement(elementUse) {
	Element.call(this);
	
	this.classList.add(ellipseElementProto.elementType, 1);
	
	forIn(ellipseElementClass, this.addProp, this);
	
	this.edit(elementUse);
}

/** @lends EllipseElement# **/
var ellipseElementProto = EllipseElement.prototype = Object.create(Element.prototype);
ellipseElementProto.constructor = EllipseElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'EllipseElement'
 * @readonly
**/
ellipseElementProto.elementType = 'EllipseElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Ellipse'
 * @readonly
**/
ellipseElementProto.elementName = 'Ellipse';

/**
 * The fill color of the ellipse
 *
 * @type String
 * @default ''
**/
ellipseElementProto.fill = '';

/**
 * The stroke width of the ellipse
 *
 * @type Number
 * @default 1
**/
ellipseElementProto.strokeWidth = 1;

/**
 * The stroke color of the ellipse
 *
 * @type String
 * @default '#000000'
**/
ellipseElementProto.strokeColor = '#000000';

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {EllipseElement} this
**/
ellipseElementProto.draw = function(ctx) {
	var kappa = 0.5522848
	
	, w = this.renderWidth / 2
	, h = this.renderHeight / 2
	, x = this.screenX
	, y = this.screenY
	
	, ox = w * kappa
	, oy = h * kappa
	, xm = x + w
	, ym = y + h
	, xe = xm + w
	, ye = ym + h;
	
	ctx.beginPath();
	ctx.lineWidth = this.strokeWidth;
	ctx.strokeStyle = this.strokeColor;
	
	ctx.moveTo(x, ym);
	
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	
	ctx.stroke();
	
	if (this.fill !== '') {
		ctx.fillStyle = this.fill;
		ctx.fill();
	}
	
	return this;
};

var ellipseElementClass = $classes.fromPrototype(ellipseElementProto, ['elementType', 'elementName']);

$elements.addType(ellipseElementProto.elementName, EllipseElement, true, true);
$classes.set(ellipseElementProto.elementType, ellipseElementClass);
