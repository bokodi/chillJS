/**
 * Creates a new Loader
 *
 * @class Loader
 * @extends EventTarget
 * @description todoc
 * @param {String} [basePath = '/']
**/
function Loader(basePath) {
	EventTarget.call(this);

	if (basePath) {
		this.basePath = basePath;
	}
	
	this.reset();
}

/**
 * The status of the loader
 *
 * @memberof Loader
 * @property IMG
 * @type String
 * @static
 * @const
**/
Loader.IMG = 'Image';

/**
 * The status of the loader
 *
 * @memberof Loader
 * @property AUDIO
 * @type String
 * @static
 * @const
**/
Loader.AUDIO = 'Audio';

/** @lends Loader# **/
var loaderProto = Loader.prototype = Object.create(EventTarget.prototype);
loaderProto.constructor = Loader;

/**
 * The base path of the loader
 *
 * @type String
 * @default ''
 * @todo implement base path
 **/
loaderProto.basePath = '';

/**
 * The status of the loader
 *
 * @type String
 * @default 'pending'
 * @readonly
**/
loaderProto.status = 'pending';

/**
 * The loading queue of the loader
 *
 * @type Array
 * @default null
 * @readonly
**/
loaderProto.loadQueue = null;

/**
 * List of functions to set the queued element's src
 *
 * @type Array
 * @default null
 * @readonly
**/
loaderProto.setPathList = null;

/**
 * Starts the loader
 *
 * @returns {Loader} this
**/
loaderProto.start = function() {
	var setPath;
	
	this.emit('start');
	
	while (setPath = this.setPathList.pop()) setPath();
	
	if (this.loadQueue.length === 0) {
		this.status = 'complete';
		this.emit('complete');
	} else {
		this.status = 'processing';
	}
	
	return this;
};

/**
 * Clears the loader
 *
 * @returns {Loader} this
**/
loaderProto.clear = function() {
	this.loadQueue = [];
	this.setPathList = [];
	
	return this;
};

/**
 * Resets the loader
 *
 * @returns {Loader} this
**/
loaderProto.reset = function() {
	this.status = 'pending';
	
	this.clear();
	this.offAll();
	
	return this;
};

/**
 * Loads an item
 *
 * @param {String} type
 * @param {String} path
 * @param {Function} [callback]
 * @returns {?*}
**/
loaderProto.load = function(type, path, callback) {
	var method = this['load' + type];
	
	if (typeof method === 'function') {
		return method.call(this, path, callback, true);
	}
	
	return null;
};

/**
 * Loads an image
 *
 * @param {String} path
 * @param {Function} [callback]
 * @param {Boolean} [autoLoad]
 * @returns {Image}
**/
loaderProto.loadImage = function(path, callback, autoLoad) {
	var scope = this
	, img = new Image()
	, listener = function(e) {
		var loadEvent = new LoadEvent(e.type, img);
		
		loadEvent.originalEvent = e;
		loadEvent.data.type = Loader.IMG;
		loadEvent.data.src = path;
		
		scope.remove(img);
		
		if (!autoLoad) scope.emit(e.type, loadEvent);
		if (typeof callback === 'function') callback.call(img, e);
	};
	
	img.addEventListener('load', listener);
	img.addEventListener('error', listener);
	
	if (autoLoad === true) img.src = path;
	
	return img;
};

/**
 * Loads an audio
 *
 * @param {String} path
 * @param {Function} [callback]
 * @param {Boolean} [autoLoad]
 * @returns {Audio}
**/
loaderProto.loadAudio = function(path, callback, autoLoad) {
	var scope = this
	, audio = new Audio()
	, listener = function(e) {
		var loadEvent = new LoadEvent(e.type, audio);
		
		loadEvent.originalEvent = e;
		loadEvent.data.type = Loader.AUDIO;
		loadEvent.data.src = path;
		
		scope.remove(audio);
		
		if (!autoLoad) scope.emit(e.type, loadEvent);
		if (typeof callback === 'function') callback.call(audio, e);
	};
	
	audio.addEventListener('canplaythrough', listener);
	audio.addEventListener('error', listener);
	
	if (autoLoad) audio.src = path;
	
	return audio;
};

/**
 * Adds an item to the loading queue
 *
 * @param {String} type
 * @param {String} path
 * @returns {?*}
**/
loaderProto.add = function(type, path) {
	var method = this['add' + type];
	
	if (typeof method === 'function') {
		return method.call(this, path);
	}
	
	return null;
};

/**
 * Adds an image to the loading queue
 *
 * @param {String} path
 * @returns {Image}
**/
loaderProto.addImage = function(path) {
	var img = this.loadImage(path, null, false);
	
	this.setPathList.push(function() { img.src = path; });
	this.loadQueue.push(img);
	
	return img;
};

/**
 * Adds an audio to the loading queue
 *
 * @param {String} path
 * @returns {Audio}
**/
loaderProto.addAudio = function(path) {
	var audio = this.loadAudio(path, null, false);
	
	this.setPathList.push(function() { audio.src = path; });
	this.loadQueue.push(audio);
	
	return audio;
};

/**
 * Removes an item from the loading queue
 *
 * @param {*} item
 * @returns {?*}
 * @todo Remove function from setPathList
**/
loaderProto.remove = function(item) {
	var index = this.loadQueue.indexOf(item)
	, removed;
	
	if (index !== -1) {
		removed = this.loadQueue.splice(index, 1)[0];
		
		if (this.loadQueue.length === 0) this.emit('complete');
		
		return removed;
	}
	
	return null;
};
