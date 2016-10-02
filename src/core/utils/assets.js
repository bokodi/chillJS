/**
 * $assets namespace
 *
 * @namespace $assets
 * @description todoc
**/
var $assets = stdClass();

/**
 * List of types
 *
 * @memberof $assets
 * @type Object
 * @readonly
**/
$assets.types = stdClass();

/**
 * List of loaders
 *
 * @memberof $assets
 * @type Array
 * @readonly
**/
$assets.loaders = [];

/**
 * Gets a "free" loader
 *
 * @memberof $assets
 * @returns {Loader}
**/
$assets.getLoader = function() {
	var i = 0
	, il = this.loaders.length
	, loader;
	
	for (; i < il; i++) {
		loader = this.loaders[i];
		
		if (loader.status === 'pending') return loader;
	}
	
	loader = new Loader();
	
	this.loaders.push(loader);
	
	return loader;
};

/**
 * Adds a type
 *
 * @memberof $assets
 * @param {String} type
 * @returns {Object} $assets
**/
$assets.addType = function(type) {
	var addType;

	if (!this.hasType(type)) {
		addType = stdClass();
		
		addType.sourceMap = stdClass();
		addType.IDMap = stdClass();

		this.types[type] = addType;
	}
	
	return this;
};

/**
 * Determines if has type
 *
 * @memberof $assets
 * @param {String} type
 * @returns {Object} $assets
**/
$assets.hasType = function(type) {
	return !isUndefined(this.types[type]);
};

/**
 * Gets an item by ID
 *
 * @memberof $assets
 * @param {String} type
 * @param {String} ID
 * @returns {*}
**/
$assets.getByID = function(type, ID) {
	return this.hasType(type) ? this.types[type].IDMap[ID] || null : null;
};

/**
 * Gets an item by source
 *
 * @memberof $assets
 * @param {String} type
 * @param {String} src
 * @returns {*}
**/
$assets.getBySrc = function(type, src) {
	return this.hasType(type) ? this.types[type].sourceMap[src] || null : null;
};

/**
 * Gets all item of type
 *
 * @memberof $assets
 * @param {String} type
 * @returns {Array}
**/
$assets.getAll = function(type) {
	var returnValue = [];
	
	if (this.hasType(type)) {
		forIn(this.types[type].sourceMap, function(src, item) {
			addUnique(returnValue, item);
		});
		
		forIn(this.types[type].IDMap, function(ID, item) {
			addUnique(returnValue, item);
		});
	}
	
	return returnValue;
};

/**
 * Deletes all type
 *
 * @memberof $assets
 * @returns {Object} $assets
**/
$assets.clear = function() {
	this.types = stdClass();
	
	return this;
};

/**
 * Adds an item
 *
 * @memberof $assets
 * @param {String} type
 * @param {*} item
 * @param {String} src
 * @param {String} [id]
 * @returns {Object} $assets
**/
$assets.addItem = function(type, item, src, id) {
	var items = this.addType(type).types[type];
	
	items.sourceMap[src] = item;
	if (!isUndefined(id)) items.IDMap[id] = item;
	
	return this;
};

$assets.addType(Loader.IMG);
$assets.addType(Loader.AUDIO);
