/**
 * Chill namespace
 *
 * @namespace Chill
 * @description todoc
**/
var Chill = stdClass();

/**
 * Creates a new Chill application
 *
 * @class Chill.App
 * @extends EventTarget
 * @memberof Chill
 * @param {Object|String} settings
 * @description todoc
**/
Chill.App = function(settings) {
	this.appData = settings;
};

/** @lends Chill.App# **/
var chillAppProto = Chill.App.prototype = stdClass();
chillAppProto.constructor = Chill.App;

/**
 * The data of the application
 *
 * @type Object
 * @default null
 * @readonly
**/
chillAppProto.appData = null;

/**
 * Returns the string value of the application
 * 
 * @returns {String}
**/
chillAppProto.toString = function() {
	return 'Chill App';
};

/**
 * Creates a new Chill debugger
 *
 * @class Chill.Debugger
 * @memberof Chill
 * @param {Scene} scene
 * @description todoc
**/
Chill.Debugger = function(scene) {
	this.scene = scene;
};

/** @lends Chill.Debugger# **/
var chillDebuggerProto = Chill.Debugger.prototype = stdClass();
chillDebuggerProto.constructor = Chill.Debugger;

/**
 * The scene of the debugger
 *
 * @type Scene
 * @default null
 * @readonly
**/
chillDebuggerProto.scene = null;

/**
 * Adds an element to the scene
 * 
 * @param {Layer} layer
 * @param {int} count
 * @param {String} [elementType = 'Text']
 * @param {Function} [callback]
 * @returns {Scene}
**/
chillDebuggerProto.addElements = function(layer, count, elementType, callback) {
	elementType = isUndefined(elementType) ? 'Text' : elementType;
	
	repeat(count, function(i) {
		var element = layer.create(elementType);
		
		layer.add(element);
		
		if (isFunction(callback)) callback(element, i);
	});
	
	return this.scene;
};

/**
 * Instantiates a chill application
 *
 * @memberof Chill
 * @param {Chill.App} app
 * @param {String|HTMLElement} wrapper
 * @param {Function} [callback]
 * @returns {Scene}
**/
Chill.out = function(app, wrapper, callback) {
	var scene;
	
	if (isString(wrapper)) wrapper = doc.getElementById(wrapper);
	
	if (!is(wrapper, HTMLElement)) die('the given wrapper not an html element');
	
	if (wrapper.children.length > 0) warning('wrapper should be empty');
	
	wrapper.classList.add('chill-wrapper');
	scene = new Scene(wrapper);
	
	if (!(app instanceof Chill.App)) {
		warning('app not instance of Chill\\App');
	}
	
	scene.include(app.appData, callback);
	
	return scene;
};

/**
 * Creates a new class
 *
 * @method
 * @name Chill.createClass
 * @param {String} className
 * @param {Object} classData
 * @returns {Object} Chill
**/
Chill.createClass = $methods.createClass;

/**
 * Creates a new mask
 *
 * @memberof Chill
 * @param {String} maskID
 * @param {Function} mask
 * @returns {Object} Chill
**/
Chill.createMask = function(maskID, mask) {
	if (isFunction(mask)) {
		$masks.set(maskID, mask);
	}
	
	return this;
};

/**
 * Creates an AbstractElement
 *
 * @method
 * @name Chill.createAbstractElement
 * @param {String} elementID
 * @param {String} elementType
 * @param {Object} [elementUse]
 * @param {Array} [args]
 * @returns {Chill} this
 * @see Scene#createAbstractElement
**/
Chill.createAbstractElement = $methods.createAbstractElement;

/**
 * Creates a new plugin
 *
 * @memberof Chill
 * @param {String} pluginID
 * @param {Function} pluginConstructor
 * @param {Object} [pluginConfig]
 * @param {Boolean} [force]
 * @returns {Object} Chill
**/
Chill.createPlugin = function(pluginID, pluginConstructor, pluginConfig, force) {
	var exists = $plugins.has(pluginID)
	, plugin, config;
	
	if (exists && force !== true) {
		warning('plugin "' + pluginID + '" already exists');
	} else {
		if (!isFunction(pluginConstructor)) {
			warning('invalid plugin constructor type');
		} else {
			plugin = stdClass();
			config = stdClass();
			
			if (isObject(pluginConfig)) assign(config, pluginConfig);
			
			plugin.constructor = pluginConstructor;
			plugin.config = config;
			
			$plugins.set(pluginID, plugin);
		}
	}
	
	return this;
};

/**
 * Creates a new Element type
 *
 * @memberof Chill
 * @param {String} type
 * @param {Object} createData
 * @param {Function} createData.constructor
 * @param {Function|Object} [createData.prototype]
 * @param {String} [createData.extends]
 * @param {Boolean} [createData.instantiatable]
 * @param {Boolean} [createData.extendable]
 * @returns {Object} Chill
**/
Chill.createElementType = function(type, createData) {
	var parent, prototype, constructor;
	
	if (!isFunction(createData.constructor)) {
		warning('Constructor is required to create a new element type');
	} else if ($elements.hasType(type)) {
		warning('Cannot create "' + type + '", type already exists');
	} else {
		parent = $elements.getExtendable(createData.extends);
		
		if (isNull(parent)) {
			if (!isUndefined(createData.extends)) warning('Cannot extend "' + createData.extends + '", type does not exists, fall back to default: Element');
			
			parent = Element;
		}
		
		prototype = Object.create(parent.prototype);
		
		constructor = function CustomElement() {
			var args = getArgs(arguments);
			
			parent.apply(this, args);
			createData.constructor.apply(this, args);
		};
		
		if (isFunction(createData.prototype)) {
			createData.prototype.call(prototype);
		} else if (isObject(createData.prototype)) {
			assign(prototype, createData.prototype);
		}
		
		constructor.prototype = prototype;
		constructor.prototype.constructor = constructor;
		
		$elements.addType(type, constructor, createData.instantiatable, createData.extendable);
	}
	
	return this;
};

window.Chill = Chill;
