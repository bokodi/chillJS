/**
 * Creates a Vector2
 *
 * @class Vector2
 * @param {Number} [x = 0]
 * @param {Number} [y = 0]
 * @description todoc
**/
function Vector2(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

/** @lends Vector2# **/
var vector2Proto = Vector2.prototype = Object.create(null);
vector2Proto.constructor = Vector2;

/**
 * The x position of the vector
 *
 * @type Number
 * @default 0
**/
vector2Proto.x = 0;

/**
 * The y position of the vector
 *
 * @type Number
 * @default 0
**/
vector2Proto.y = 0;

/**
 * Sets the x and y values of the vector
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {Vector2} this
**/
vector2Proto.set = function(x, y) {
	this.x = x;
	this.y = y;
	
	return this;
};

/**
 * Sets the x value of the vector
 *
 * @param {Number} x
 * @returns {Vector2} this
**/
vector2Proto.setX = function(x) {
	this.x = x;
	
	return this;
};

/**
 * Sets the y value of the vector
 *
 * @param {Number} y
 * @returns {Vector2} this
**/
vector2Proto.setY = function(y) {
	this.y = y;
	
	return this;
};

/**
 * Modifies the x and y values of the vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.add = function(v) {
	this.x += v.x;
	this.y += v.y;
	
	return this;
};

/**
 * Sets the x and y values of the vector to the sum of the two given vectors
 *
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @returns {Vector2} this
**/
vector2Proto.addVectors = function(v1, v2) {
	this.x = v1.x + v2.x;
	this.y = v1.y + v2.y;
	
	return this;
};

/**
 * Modifies the x and y values of the vector by the given scalar value
 *
 * @param {Number} s
 * @returns {Vector2} this
**/
vector2Proto.addScalar = function(s) {
	this.x += s;
	this.y += s;
	
	return this;
};

/**
 * Modifies the x and y values of the vector by the given vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.sub = function(v) {
	this.x -= v.x;
	this.y -= v.y;
	
	return this;
};

/**
 * Sets the x and y values of the vector to the subtraction of the two given vectors
 *
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @returns {Vector2} this
**/
vector2Proto.subVectors = function(v1, v2) {
	this.x = v1.x - v2.x;
	this.y = v1.y - v2.y;
	
	return this;
};

/**
 * Modifies the x and y values of the vector by the given scalar value
 *
 * @param {Number} s
 * @returns {Vector2} this
**/
vector2Proto.subScalar = function(s) {
	this.x -= s;
	this.y -= s;
	
	return this;
};

/**
 * Multiplies the x and y values of the vector by the given vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.multiply = function(v) {
	this.x *= v.x;
	this.y *= v.y;
	
	return this;
};

/**
 * Multiplies the x and y values of the vector by the given scalar value
 *
 * @param {Number} s
 * @returns {Vector2} this
**/
vector2Proto.multiplyScalar = function(s) {
	this.x *= s;
	this.y *= s;
	
	return this;
};

/**
 * Divides the x and y values of the vector by the given vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.divide = function(v) {
	this.x = v.x === 0 ? 0 : this.x / v.x;
	this.y = v.y === 0 ? 0 : this.y / v.y;
	
	return this;
};

/**
 * Divides the x and y values of the vector by the given scalar value
 *
 * @param {Number} s
 * @returns {Vector2} this
**/
vector2Proto.divideScalar = function(s) {
	this.x = s === 0 ? 0 : this.x / s;
	this.y = s === 0 ? 0 : this.y / s;
	
	return this;
};

/**
 * Sets the vector x and y values to the minimum from it's value and the given vector's value
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.min = function(v) {
	if (this.x > v.x) this.x = v.x;
	if (this.y > v.y) this.y = v.y;
	
	return this;
};

/**
 * Sets the vector x and y values to the maximum from it's value and the given vector's value
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.max = function(v) {
	if (this.x < v.x) this.x = v.x;
	if (this.y < v.y) this.y = v.y;
	
	return this;
};

/**
 * Sets the vector x and y values to the largest integer less than or equal to it's value
 *
 * @returns {Vector2} this
**/
vector2Proto.floor = function() {
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
	
	return this;
};

/**
 * Sets the vector x and y values to the smallest integer greater than or equal to it's value
 *
 * @returns {Vector2} this
**/
vector2Proto.ceil = function() {
	this.x = Math.ceil(this.x);
	this.y = Math.ceil(this.y);
	
	return this;
};

/**
 * Sets the vector x and y values to the nearest integer to it's value
 *
 * @returns {Vector2} this
**/
vector2Proto.round = function() {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	
	return this;
};

/**
 * Negates the vectors x and y values
 *
 * @returns {Vector2} this
**/
vector2Proto.negate = function() {
	this.x = -this.x;
	this.y = -this.y;
	
	return this;
};

/**
 * Rotates the vector by a given radian
 *
 * @param {Number} rad
 * @returns {Vector2} this
**/
vector2Proto.rotate = function(rad) {
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	
	var x = this.x * cos - this.y * sin;
	var y = this.x * sin + this.y * cos;
	
	this.x = x;
	this.y = y;
	
	return this;
};

/**
 * Sets the length of the vector to the length of the given vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.setLength = function(v) {
	this.normalize().multiplyScalar(v.length());
	
	return this;
};


/**
 * Returns the dot product between this and the given vector
 *
 * @param {Vector2} v
 * @returns {Number}
**/
vector2Proto.dot = function(v) {
	return this.x * v.x + this.y * v.y;
};

/**
 * Returns the 2D cross product between this and the given vector
 *
 * @param {Vector2} v
 * @returns {Number}
**/
vector2Proto.cross = function(v) {
	return this.x * v.y - this.y * v.x;
};

/**
 * Returns the length of the vector
 *
 * @returns {Number}
**/
vector2Proto.length = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * Normalizes the vector
 *
 * @returns {Vector2} this
**/
vector2Proto.normalize = function() {
	return this.divideScalar(this.length());
};

/**
 * Rotates the vector to a given angle
 *
 * @param {Number} rad
 * @returns {Vector2} this
**/
vector2Proto.toAngle = function(rad) {
	this.rotate(2 * Math.PI - Math.atan2(this.y, this.x) + rad);
	
	return this;
};

/**
 * Returns the distance between this and the given vector
 *
 * @param {Vector2} v
 * @returns {Number}
**/
vector2Proto.distanceTo = function(v) {
	var dx = this.x - v.x;
	var dy = this.y - v.y;
	
	return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Returns the angle between this and the given vector
 *
 * @param {Vector2} v
 * @returns {Number}
**/
vector2Proto.angleTo = function(v) {
	return Math.atan2(v.cross(this), v.dot(this));
};

/**
 * Determines if the given vector is equal to this vector
 *
 * @param {Vector2} v
 * @returns {Boolean}
**/
vector2Proto.equals = function(v) {
	return this.x === v.x && this.y === v.y;
};

/**
 * Copies the given vector
 *
 * @param {Vector2} v
 * @returns {Vector2} this
**/
vector2Proto.copy = function(v) {
	this.x = v.x;
	this.y = v.y;
	
	return this;
};

/**
 * Clones the vector
 *
 * @returns {Vector2}
**/
vector2Proto.clone = function() {
	return new this.constructor(this.x, this.y);
};

/**
 * Returns the string value of the vector
 *
 * @returns {String}
**/
vector2Proto.toString = function() {
	return 'Vector2 at ' + this.x + ' ' + this.y;
};
