/**
 * Creates a new SpriteSheetElement
 *
 * @class SpriteSheetElement
 * @extends Element
 * @param {Object} [elementUse]
 * @description todoc
**/
function SpriteSheetElement(elementUse) {
	Element.call(this);
	
	this.classList.add(spriteSheetElementProto.elementType, 1);
	
	forIn(spriteSheetElementClass, this.addPropSafe, this);
	
	this.img = new Image();
	this.frames = [];
	this.animations = stdClass();
	this.currentAnimationFrame = { x: 0, y: 0 };
	
	this.edit(elementUse);
}

/** @lends SpriteSheetElement# **/
var spriteSheetElementProto = SpriteSheetElement.prototype = Object.create(Element.prototype);
spriteSheetElementProto.constructor = SpriteSheetElement;

/**
 * The type of the element
 *
 * @type String
 * @default 'SpriteSheetElement'
 * @readonly
**/
spriteSheetElementProto.elementType = 'SpriteSheetElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'SpriteSheet'
 * @readonly
**/
spriteSheetElementProto.elementName = 'SpriteSheet';

/**
 * The x position of the source spriteSheet to draw into the destination context
 *
 * @type Number|String
 * @default 0
**/
spriteSheetElementProto.sourceX = 0;

/**
 * The y position of the source spriteSheet to draw into the destination context
 *
 * @type Number|String
 * @default 0
**/
spriteSheetElementProto.sourceY = 0;

/**
 * The width of each frame
 *
 * @type Number|String
 * @default 0
**/
spriteSheetElementProto.frameWidth = 0;

/**
 * The height of each frame
 *
 * @type Number|String
 * @default 0
**/
spriteSheetElementProto.frameHeight = 0;

/**
 * The spriteSheet of the element
 *
 * @type Image
 * @default null
 * @readonly
**/
spriteSheetElementProto.img = null;

/**
 * The source of the spriteSheet
 *
 * @name SpriteSheetElement#src
 * @type String
 * @default ''
**/
Object.defineProperty(spriteSheetElementProto, 'src', {
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
 * The animations of the sprite
 *
 * @type Object
 * @default null
 * @readonly
**/
spriteSheetElementProto.animations = null;

/**
 * The frames of the sprite
 *
 * @type Array
 * @default null
 * @readonly
**/
spriteSheetElementProto.frames = null;

/**
 * The tick of the sprite
 *
 * @type int
 * @default 0
 * @readonly
**/
spriteSheetElementProto.tick = 0;

/**
 * The current animation of the sprite
 *
 * @type String
 * @default ''
**/
spriteSheetElementProto.currentAnimation = 'default';

/**
 * The current frame of the sprite
 *
 * @type int
 * @default 0
**/
spriteSheetElementProto.currentFrame = 0;

/**
 * The current animationframe of the sprite
 *
 * @type Object
 * @default null
 * @readonly
**/
spriteSheetElementProto.currentAnimationFrame = null;

/**
 * The frame rate of the sprite
 *
 * @type int
 * @default 7
**/
spriteSheetElementProto.frameRate = 7;

/**
 * The spacing of each frame
 *
 * @type int
 * @default 0
**/
spriteSheetElementProto.frameSpacing = 0;

/**
 * Indicates whether the sprite should be animated or not
 *
 * @type Boolean
 * @default false
**/
spriteSheetElementProto.paused = false;

/**
 * Adds an animation
 *
 * @param {String} key
 * @param {Object} animData
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.addAnimation = function(key, animData) {
	this.animations[key] = stdClass();
	
	assign(this.animations[key], {
		frames: [],
		next: key,
		frameRate: this.frameRate,
		direction: 'forward'
	});
	
	return this.editAnimation(key, animData);
};

/**
 * Edits an animation
 *
 * @param {String} key
 * @param {Object} animData
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.editAnimation = function(key, animData) {
	var animation;
	
	if (has(this.animations, key)) {
		animation = this.animations[key];
		
		if (isArray(animData.frames)) {
			empty(animation.frames);
			animation.frames.push.apply(animation.frames, animData.frames);
		}
		
		if (isString(animData.next)) {
			animation.next = animData.next;
		}
		
		if (isNumber(animData.frameRate)) {
			animation.frameRate = animData.frameRate;
		}
		
		if (animData.direction === 'forward' || animData.direction === 'backward') {
			animation.direction = animData.direction;
		}
	}
	
	return this;
};

/**
 * Removes an animation
 *
 * @param {String} key
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.removeAnimation = function(key) {
	delete this.animations[key];
	
	return this;
};

/**
 * Sets the frameWidth and frameHeight properties
 *
 * @param {int} rows
 * @param {int} cols
 * @param {int} [width]
 * @param {int} [height]
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.setFrameSize = function(rows, cols, width, height) {
	var w = 0, h = 0;
	
	if (isNumber(width) && isNumber(height)) {
		w = width;
		h = height;
	} else if (this.img.complete === true) {
		w = this.img.width;
		h = this.img.height;
	}
	
	this.frameWidth = this.img.width / cols - 2 * this.frameSpacing;
	this.frameHeight = this.img.height / rows - 2 * this.frameSpacing;
	
	return this.setFrames();
};

/**
 * Sets the frames
 *
 * @param {int} [count]
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.setFrames = function(count) {
	var i, sx, sy, x, y, w, h, sprite, args, onLoad;
	
	if (this.img.complete === true) {
		i = 0;
		
		if (!isNumber(count)) count = Infinity;
		
		empty(this.frames);
		
		w = this.img.width;
		h = this.img.height;
		
		if (isPercent(sx = this.sourceX)) sx = parsePercent(sx, this.frameWidth);
		if (isPercent(sy = this.sourceY)) sy = parsePercent(sy, this.frameHeight);
		
		vertical: for (y = sy; y < h; y += this.frameHeight) {
			horizontal: for (x = sx; x < w; x += this.frameWidth) {
				this.frames.push({ x: x, y: y });
				
				if (++i >= count) break vertical;
			}
		}
	} else {
		sprite = this;
		args = getArgs(arguments);
		onLoad = function() {
			sprite.setFrames.apply(sprite, args);
			sprite.img.removeEventListener('load', onLoad);
		};
		
		this.img.addEventListener('load', onLoad);
	}
	
	return this;
};

/**
 * Starts the animation
 *
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.start = function() {
	this.paused = false;
	
	return this;
};

/**
 * Stops the animation
 *
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.stop = function() {
	this.paused = true;
	
	return this;
};

/**
 * Gets the auto width of the element
 *
 * @returns {Number}
**/
spriteSheetElementProto.measureWidth = function() {
	var width = this.frameWidth;
	
	return isPercent(width) ? parsePercent(width, this.img.width) : width;
};

/**
 * Gets the auto height of the element
 *
 * @returns {Number}
**/
spriteSheetElementProto.measureHeight = function() {
	var height = this.frameHeight;
	
	return isPercent(height) ? parsePercent(height, this.img.height) : height;
};

/**
 * Draws the element to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {SpriteSheetElement} this
**/
spriteSheetElementProto.draw = function(ctx) {
	var img = this.img
	, sw, sh, animation, frameRate, frames;
	
	if (img.complete === true) {
		if (isPercent(sw = this.frameWidth)) sw = parsePercent(sw, img.width);
		if (isPercent(sh = this.frameHeight)) sh = parsePercent(sh, img.height);
		
		if (this.paused === false && has(this.animations, this.currentAnimation)) {
			animation = this.animations[this.currentAnimation];
			frames = animation.frames;
			frameRate = isNumber(animation.frameRate) ? animation.frameRate : this.frameRate;
			
			if (++this.tick >= frameRate && frames.length > 0) {
				if (animation.direction === 'backward') {
					if (--this.currentFrame <= 0) {
						if (animation.next === this.currentAnimation && animation.loop === true) {
							this.currentFrame = frames.length - 1;
						} else {
							if (has(this.animations, animation.next)) this.currentAnimation = animation.next;
							
							this.currentFrame = 0;
						}
					}
				} else {
					if (++this.currentFrame >= frames.length) {
						if (animation.next === this.currentAnimation && animation.loop === true) {
							this.currentFrame = 0;
						} else {
							if (has(this.animations, animation.next)) this.currentAnimation = animation.next;
							
							this.currentFrame = 0;
						}
					}
				}
				
				this.currentAnimationFrame = this.frames[frames[this.currentFrame]];
				
				this.tick = 0;
			}
		}
		
		ctx.drawImage(img,
			this.currentAnimationFrame.x, this.currentAnimationFrame.y,
			sw, sh,
			this.screenX, this.screenY,
			this.renderWidth, this.renderHeight
		);
	}
	
	return this;
};

var spriteSheetElementClass = stdClass();
spriteSheetElementClass.width = 'auto';
spriteSheetElementClass.height = 'auto';
spriteSheetElementClass.frameRate = spriteSheetElementProto.frameRate;

$elements.addType(spriteSheetElementProto.elementName, SpriteSheetElement, true, true);
$classes.set(spriteSheetElementProto.elementType, spriteSheetElementClass);
