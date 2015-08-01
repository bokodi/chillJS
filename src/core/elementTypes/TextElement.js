/**
 * Creates a new TextElement
 *
 * @class TextElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function TextElement(elementUse) {
	Element.call(this);
	
	this.classList.add(textElementProto.elementType, 1);
	
	forIn(textElementClass, this.addPropSafe, this);
	
	this.edit(elementUse);
}

/** @lends TextElement# **/
var textElementProto = TextElement.prototype = Object.create(Element.prototype);
textElementProto.constructor = TextElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'TextElement'
 * @readonly
**/
textElementProto.elementType = 'TextElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Text'
 * @readonly
**/
textElementProto.elementName = 'Text';

/**
 * The text of the element
 *
 * @type String
 * @default null
**/
textElementProto.text = null;

/**
 * The color of the text
 *
 * @type String
 * @default '#000000'
**/
textElementProto.textColor = '#000000';

/**
 * Indents the first line of the text
 *
 * @type Number
 * @default 0
**/
textElementProto.textIndent = 0;

/**
 * Specifies the decoration added to the text
 *
 * @type String
 * @default 'none'
 * @todo Implement text decoration
**/
textElementProto.textDecoration = 'none';

/**
 * Controls the capitalization of text
 *
 * @type String
 * @default 'none'
**/
textElementProto.textTransform = 'none';

/**
 * Adds shadow to the text
 *
 * @type String
 * @default 'none'
 * @todo Implement text shadow
**/
textElementProto.textShadow = 'none';

/**
 * Specifies the font for the element
 *
 * @type String
 * @default 'sans-serif'
**/
textElementProto.fontFamily = 'sans-serif';

/**
 * Specifies the size of the font in px
 *
 * @type Number
 * @default 12
**/
textElementProto.fontSize = 12;

/**
 * Specifies the weight or boldness of the font
 *
 * @type String
 * @default 'normal'
**/
textElementProto.fontWeight = 'normal';

/**
 * Specifies the font style for a text
 *
 * @type String
 * @default 'normal'
**/
textElementProto.fontStyle = 'normal';

/**
 * Increases or decreases the space between characters in the text
 *
 * @type Number
 * @default 0
**/
textElementProto.letterSpacing = 0;

/**
 * The horizontal align of the text
 *
 * @type String
 * @default 'left'
**/
textElementProto.textAlign = 'left';

/**
 * The vertical align of the text
 *
 * @type String
 * @default 'top'
 * @todo Implement text baseline
**/
textElementProto.textBaseline = 'top';

/**
 * The height of each line
 *
 * @type String
 * @default 'auto'
**/
textElementProto.lineHeight = 'auto';

/**
 * Returns the auto width of the text element
 *
 * @returns {Number}
**/
textElementProto.measureWidth = function() {
	var ctx = $canvas.ctx
	, max = 0
	, lines = this.getLines()
	, i = 0
	, il = lines.length
	, width;
	
	ctx.font = this.getFontDescriptor();
	
	for (; i < il; i++) {
		width = ctx.measureText(lines[i]).width;
		
		if (width > max) max = width;
	}
	
	return max;
};

/**
 * Returns the auto height of the text element
 *
 * @returns {Number}
**/
textElementProto.measureHeight = function() {
	return this.getLines().length * this.getLineHeight();
};

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {TextElement} this
**/
textElementProto.draw = function(ctx) {
	var lines = this.getLines()
	, i = 1
	, il = lines.length
	, lh = this.getLineHeight()
	, x = this.screenX
	, y = this.screenY + ((lh - this.fontSize) / 2)
	, align = this.textAlign;
	
	ctx.beginPath();
	
	ctx.font = this.getFontDescriptor();
	ctx.textAlign = align;
	ctx.textBaseline = 'top'; /* this.textBaseline */;
	ctx.fillStyle = this.textColor;
	
	if (align === 'center') x += this.renderWidth / 2;
	if (align === 'right') x += this.renderWidth;
	
	ctx.fillText(lines[0], x + this.textIndent, y);
	
	for (; i < il; i++) {
		ctx.fillText(lines[i], x, y += lh);
	}
	
	return this;
};

/**
 * Returns the font data
 *
 * @returns {String}
**/
textElementProto.getFontDescriptor = function() {
	var font = '';
	
	if (this.fontWeight === 'bold') font += 'bold ';
	if (this.fontStyle === 'italic') font += 'italic ';
	
	font += this.fontSize + 'px ';
	font += this.fontFamily;
	
	return font;
};

/**
 * Returns the transformed text
 *
 * @returns {String}
**/
textElementProto.getTransformedText = function() {
	var text = String(this.text);
	
	switch(this.textTransform) {
		case 'lowercase': text = text.toLowerCase(); break;
		case 'uppercase': text = text.toUpperCase(); break;
		case 'capitalize': text = capitalize(text); break;
	}
	
	if (this.letterSpacing > 0) text = text.split('').join(repeatString(' ', this.letterSpacing));
	
	return text;
};

/**
 * Returns the line height
 *
 * @returns {Number}
**/
textElementProto.getLineHeight = function() {
	var lh = this.lineHeight;
	
	if (lh === 'auto') return this.fontSize;
	if (isPercent(lh)) return parsePercent(lh, this.fontSize);
	if (isNumber(getInt(lh))) return getInt(lh);
	
	return 0;
};

/**
 * Returns the transformed lines
 *
 * @returns {Array}
**/
textElementProto.getLines = function() {
	return this.getTransformedText().split(lineBreakRegX);
};

var textElementClass = $classes.fromPrototype(textElementProto, ['elementType', 'elementName']);
textElementClass.width = 'auto';
textElementClass.height = 'auto';

$elements.addType(textElementProto.elementName, TextElement, true, true);
$classes.set(textElementProto.elementType, textElementClass);
