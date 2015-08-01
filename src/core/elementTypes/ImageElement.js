/**
 * Creates a new ImageElement
 *
 * @class ImageElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function ImageElement(elementUse) {
	Element.call(this);
	
	this.classList.add(imageElementProto.elementType, 1);
	
	forIn(imageElementClass, this.addPropSafe, this);
	
	this.img = new Image();
	
	this.edit(elementUse);
}

/** @lends ImageElement# **/
var imageElementProto = ImageElement.prototype = Object.create(Element.prototype);
imageElementProto.constructor = ImageElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'ImageElement'
 * @readonly
**/
imageElementProto.elementType = 'ImageElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Image'
 * @readonly
**/
imageElementProto.elementName = 'Image';

/**
 * The x position of the source image to draw into the destination context
 *
 * @type Number|String
 * @default 0
**/
imageElementProto.sourceX = 0;

/**
 * The y position of the source image to draw into the destination context
 *
 * @type Number|String
 * @default 0
**/
imageElementProto.sourceY = 0;

/**
 * The width of the source image to draw into the destination context
 *
 * @type Number|String
 * @default '100%'
**/
imageElementProto.sourceWidth = '100%';

/**
 * The height of the source image to draw into the destination context
 *
 * @type Number|String
 * @default '100%'
**/
imageElementProto.sourceHeight = '100%';

/**
 * The image of the element
 *
 * @type Image
 * @default null
 * @readonly
**/
imageElementProto.img = null;

/**
 * The source of the image
 *
 * @name ImageElement#src
 * @type String
 * @default ''
**/
Object.defineProperty(imageElementProto, 'src', {
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
 * Gets the auto width of the element
 *
 * @returns {Number}
**/
imageElementProto.measureWidth = function() {
	var sourceWidth = this.sourceWidth;
	
	if (isNumber(sourceWidth)) return sourceWidth;
	if (isPercent(sourceWidth)) return parsePercent(sourceWidth, img.width);
	
	return this.img.width;
};

/**
 * Gets the auto height of the element
 *
 * @returns {Number}
**/
imageElementProto.measureHeight = function() {
	var sourceHeight = this.sourceHeight;
	
	if (isNumber(sourceHeight)) return sourceHeight;
	if (isPercent(sourceHeight)) return parsePercent(sourceHeight, img.height);
	
	return this.img.height;
};

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {ImageElement} this
**/
imageElementProto.draw = function(ctx) {
	var img = this.img, sx, sy;
	
	if (img.complete === true) {
		if (isPercent(sx = this.sourceX)) sx = parsePercent(sx, img.width);
		if (isPercent(sy = this.sourceY)) sy = parsePercent(sy, img.height);
		
		ctx.drawImage(img,
			sx, sy,
			this.measureWidth(), this.measureHeight(),
			this.screenX, this.screenY,
			this.renderWidth, this.renderHeight
		);
	}
	
	return this;
};

var imageElementClass = $classes.fromPrototype(imageElementProto, ['elementType', 'elementName']);
imageElementClass.width = 'auto';
imageElementClass.height = 'auto';

$elements.addType(imageElementProto.elementName, ImageElement, true, true);
$classes.set(imageElementProto.elementType, imageElementClass);
