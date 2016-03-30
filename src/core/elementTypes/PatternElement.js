/**
 * Creates a new PatternElement
 *
 * @class PatternElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function PatternElement(elementUse) {
	Element.call(this);
	
	this.classList.add(patternElementProto.elementType, 1);
	
	forIn(patternElementClass, this.addPropSafe, this);
	
	this.img = new Image();
	
	this.edit(elementUse);
}

/** @lends PatternElement# **/
var patternElementProto = PatternElement.prototype = Object.create(Element.prototype);
patternElementProto.constructor = PatternElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'PatternElement'
 * @readonly
**/
patternElementProto.elementType = 'PatternElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Pattern'
 * @readonly
**/
patternElementProto.elementName = 'Pattern';

/**
 * The x position of the source image to draw into the destination context
 *
 * @type Number|String
 * @default 0
**/
patternElementProto.sourceX = 0;

/**
 * The y position of the source image to draw into the destination context
 *
 * @type Number|String
 * @default 0
**/
patternElementProto.sourceY = 0;

/**
 * The width of the source image to draw into the destination context
 *
 * @type Number|String
 * @default '100%'
**/
patternElementProto.sourceWidth = '100%';

/**
 * The height of the source image to draw into the destination context
 *
 * @type Number|String
 * @default '100%'
**/
patternElementProto.sourceHeight = '100%';

/**
 * The image of the element
 *
 * @type Image
 * @default null
 * @readonly
**/
patternElementProto.img = null;

/**
 * The source of the image
 *
 * @name PatternElement#src
 * @type String
 * @default ''
**/
Object.defineProperty(patternElementProto, 'src', {
	get: function() {
		return this.img.src;
	},
	set: function(newVal) {
		if (startsWith(newVal, '#')) {
			newVal = $assets.getByID(Loader.IMG, newVal.slice(1)).src;
		}
		
		return this.img.src = newVal;
	}
});

/**
 * A String indicating how to repeat the image (repeat|repeat-x|repeat-y|no-repeat)
 *
 * @name PatternElement#repeat
 * @type String
 * @default 'repeat'
**/
patternElementProto.repeat = 'repeat';

/**
 * Gets the auto width of the element
 *
 * @returns {Number}
**/
patternElementProto.measureWidth = function() {
	var sourceWidth = this.sourceWidth;
	
	if (isNumber(sourceWidth)) return sourceWidth;
	if (isPercent(sourceWidth)) return parsePercent(sourceWidth, this.img.width);
	
	return this.img.width;
};

/**
 * Gets the auto height of the element
 *
 * @returns {Number}
**/
patternElementProto.measureHeight = function() {
	var sourceHeight = this.sourceHeight;
	
	if (isNumber(sourceHeight)) return sourceHeight;
	if (isPercent(sourceHeight)) return parsePercent(sourceHeight, this.img.height);
	
	return this.img.height;
};

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {PatternElement} this
**/
patternElementProto.draw = function(ctx) {
	var img = this.img, sx, sy;
	
	if (img.complete === true) {
		if (isPercent(sx = this.sourceX)) sx = parsePercent(sx, img.width);
		if (isPercent(sy = this.sourceY)) sy = parsePercent(sy, img.height);
		
		ctx.rect(this.screenX, this.screenY, this.renderWidth, this.renderHeight);
		ctx.fillStyle = ctx.createPattern(img, this.repeat);
		ctx.fill();
	}
	
	return this;
};

var patternElementClass = $classes.fromPrototype(patternElementProto, ['elementType', 'elementName']);
patternElementClass.width = 'auto';
patternElementClass.height = 'auto';

$elements.addType(patternElementProto.elementName, PatternElement, true, true);
$classes.set(patternElementProto.elementType, patternElementClass);
