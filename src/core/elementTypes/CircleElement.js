/**
 * Creates a new CircleElement
 *
 * @class CircleElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function CircleElement(elementUse) {
	Element.call(this);
	
	this.classList.add(circleElementProto.elementType, 1);
	
	forIn(circleElementClass, this.addPropSafe, this);
	
	this.edit(elementUse);
}

/** @lends CircleElement# **/
var circleElementProto = CircleElement.prototype = Object.create(Element.prototype);
circleElementProto.constructor = CircleElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'CircleElement'
 * @readonly
**/
circleElementProto.elementType = 'CircleElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Circle'
 * @readonly
**/
circleElementProto.elementName = 'Circle';

/**
 * The radius of the circle
 *
 * @type Number
 * @default 10
**/
circleElementProto.r = 10;

/**
 * The fill color of the circle
 *
 * @type String
 * @default ''
**/
circleElementProto.fill = '';

/**
 * The stroke width of the circle
 *
 * @type Number
 * @default 1
**/
circleElementProto.strokeWidth = 1;

/**
 * The stroke color of the circle
 *
 * @type String
 * @default '#000000'
**/
circleElementProto.strokeColor = '#000000';

/**
 * Returns the auto width of the circle element
 *
 * @returns {Number}
**/
circleElementProto.measureWidth = function() {
	return this.r * 2;
};

/**
 * Returns the auto height of the circle element
 *
 * @returns {Number}
**/
circleElementProto.measureHeight = function() {
	return this.r * 2;
};

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {CircleElement} this
**/
circleElementProto.draw = function(ctx) {
	ctx.beginPath();
	ctx.lineWidth = this.strokeWidth;
	ctx.strokeStyle = this.strokeColor;
	
	ctx.arc(
		this.screenX + this.r,
		this.screenY + this.r,
		this.r,
		0,
		Math.PI * 2,
		true
	);
	
	ctx.stroke();
	
	if (this.fill !== '') {
		ctx.fillStyle = this.fill;
		ctx.fill();
	}
	
	return this;
};

var circleElementClass = $classes.fromPrototype(circleElementProto, ['elementType', 'elementName']);
circleElementClass.width = 'auto';
circleElementClass.height = 'auto';

$elements.addType(circleElementProto.elementName, CircleElement, true, true);
$classes.set(circleElementProto.elementType, circleElementClass);
