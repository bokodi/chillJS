/**
 * Creates a new Scene
 *
 * @class Scene
 * @extends EventTarget
 * @param {HTMLElement} wrapper
 * @description todoc
**/
function Scene(wrapper) {
	EventTarget.call(this);
	Storage.call(this);
	
	this.uuid = generateUUID();
	this.wrapper = wrapper;
	this.readyState = 'pending';
	
	this.screen = new Screen();
	this.cursor = new Cursor('mouse');
	this.settings = new PublicStorage();
	this.loader = new Loader();
	this.queue = new Queue();
	
	addSceneLayerHandlerMethods.call(this);
	addSceneEventListeners.call(this, wrapper);
	addSceneAnimationFrameHandlers.call(this);
	addSceneCollisionDetectionHandlers.call(this);
	initScene.call(this);
}

/** @lends Scene# **/
var sceneProto = Scene.prototype = Object.create(EventTarget.prototype);
sceneProto.constructor = Scene;

function addSceneLayerHandlerMethods() {
	var _layers = new OrderedList();
	
	/**
	 * Creates a new Layer and returns it
	 *
	 * @alias Scene#createLayer
	 * @param {Object} [layerUse]
	 * @returns {Layer}
	**/
	this.createLayer = function(layerUse) {
		if (!isObject(layerUse)) layerUse = stdClass();
		
		return new Layer(addDefault(layerUse, {
			width: this.screen.width,
			height: this.screen.height
		}));
	};
	
	/**
	 * Adds a Layer to the Scene
	 *
	 * @alias Scene#addLayer
	 * @param {Layer} layer
	 * @param {int} [orderID]
	 * @returns {Scene} this
	**/
	this.addLayer = function(layer, orderID) {
		_layers.add(layer, orderID);
		layer.root = this;
		this.wrapper.appendChild(layer.canvas);
		
		return this;
	};
	
	/**
	 * Combination of Scene#createLayer and Scene#addLayer
	 *
	 * @alias Scene#insertLayer
	 * @param {Object} [layerUse]
	 * @param {int} [orderID]
	 * @returns {Layer}
	**/
	this.insertLayer = function(layerUse, orderID) {
		var layer = this.createLayer(layerUse);
		
		this.addLayer(layer, orderID);
		
		return layer;
	};
	
	/**
	 * Removes a Layer from the Scene
	 *
	 * @alias Scene#removeLayer
	 * @param {Layer} layer
	 * @returns {Scene} this
	**/
	this.removeLayer = function(layer) {
		_layers.remove(layer);
		layer.root = null;
		this.wrapper.removeChild(layer.canvas);
		
		return this;
	};
	
	/**
	 * Gets a Layer by id
	 *
	 * @alias Scene#getLayer
	 * @param {String} layerId
	 * @returns {?Layer}
	**/
	this.getLayer = function(layerId) {
		var returnValue = null;
		
		_layers.each(function(layer) {
			if (layer.id === layerId) {
				returnValue = layer;
				
				return true;
			}
			
			return false;
		});
		
		return returnValue;
	};
	
	/**
	 * Executes a provided callback function once per Layer in ascending order
	 *
	 * @alias Scene#eachLayer
	 * @param {Function} callback
	 * @returns {Scene} this
	**/
	this.eachLayer = function(callback) {
		_layers.each(callback);
		
		return this;
	};
	
	/**
	 * Executes a provided callback function recursively once per Element in ascending order
	 *
	 * @alias Scene#eachElement
	 * @param {Function} callback
	 * @returns {Scene} this
	**/
	this.eachElement = function(callback) {
		_layers.each(function(layer) {
			layer.eachElement(callback);
		});
		
		return this;
	};
	
	return this;
}

function addSceneEventListeners(wrapper) {
	var scene = this
	, _dragged = []
	, _focused = []
	, doc = window.document;
	
	/**
	 * Returns an Array of currently dragged Elements
	 *
	 * @alias Scene#getDraggedElements
	 * @returns {Array}
	**/
	this.getDraggedElements = function() {
		return _dragged;
	};
	
	/**
	 * Returns an Array of currently hovered Elements
	 *
	 * @alias Scene#getFocusedElements
	 * @returns {Array}
	**/
	this.getFocusedElements = function() {
		return _focused;
	};
	
	/**
	 * Updates the list of focused elements, emits the "mousemove", "mouseenter" and "mouseleave" events if necessary
	 *
	 * @alias Scene#updateFocusedElements
	 * @param {MouseEvent} e
	 * @returns {Scene} this
	 * @todo Break forEach if the propagation is stopped
	 * @todo Consider parent layer offset on collision check
	 * @todo Consider element rotation and scale on collision check
	**/
	this.updateFocusedElements = function(e) {
		var temp = []
		, cx = this.cursor.x
		, cy = this.cursor.y;
		
		if (this.cursor.onScreen) {
			scene.eachElement(function(element) {
				var contains, event;
				
				if (e.propagationStopped === true) return undefined;
				
				contains = inArray(_focused, element);
				
				e.target = element;
				element.dispatchEvent(e.type, e);
				
				if (
					element.screenX <= cx &&
					element.screenXE >= cx &&
					element.screenY <= cy &&
					element.screenYE >= cy
				) {
					temp.push(element);
					
					if (!contains) {
						event = new MouseEvent('mouseenter', e.x, e.y, null);
						event.target = element;
						element.dispatchEvent(event.type, event);
					}
				} else if (contains) {
					event = new MouseEvent('mouseleave', e.x, e.y, null);
					event.target = element;
					element.dispatchEvent(event.type, event);
				}
			});
		}
		
		empty(_focused);
		_focused.push.apply(_focused, temp);
		
		return this;
	};
	
	wrapper.addEventListener('mousemove', function(e) {
		var x = e.layerX
		, y = e.layerY
		, event = new MouseEvent('mousemove', x, y, null);
		
		scene.cursor.set(x, y);
		scene.cursor.onScreen = true;
		
		event.target = scene;
		event.originalEvent = e;
		
		scene.dispatchEvent(e.type, event);
		scene.updateFocusedElements(event);
	});
	
	wrapper.addEventListener('mouseenter', function(e) {
		scene.cursor.set(e.layerX, e.layerY);
		scene.cursor.onScreen = true;
		
		scene.dispatchEvent(e.type, new MouseEvent(e.type, e.layerX, e.layerY, null));
	});
	
	wrapper.addEventListener('mouseleave', function(e) {
		scene.cursor.set(e.layerX, e.layerY);
		scene.cursor.onScreen = false;
		
		forEach(_focused, function(element) {
			var event = new MouseEvent('mouseleave', scene.cursor.x, scene.cursor.y, null);
			event.target = element;
			element.dispatchEvent(event.type, event);
		});
		
		empty(_focused);
		
		scene.dispatchEvent(e.type, new MouseEvent(e.type, e.layerX, e.layerY, null));
	});
	
	wrapper.addEventListener('mousedown', function(e) {
		var x = e.layerX
		, y = e.layerY
		, event = new MouseEvent('mousedown', x, y, null);
		
		scene.cursor.set(x, y);
		scene.cursor.onScreen = true;
		
		event.target = scene;
		event.originalEvent = e;
		
		switch(e.button) {
			case 0: event.button = 'left'; break;
			case 1: event.button = 'middle'; break;
			case 2: event.button = 'right'; break;
		}
		
		scene.dispatchEvent(e.type, event);
		applyEach(_focused, EventTarget.prototype.dispatchEvent, e.type, event);
	});
	
	wrapper.addEventListener('mouseup', function(e) {
		var x = e.layerX
		, y = e.layerY
		, event = new MouseEvent('mouseup', x, y, null);
		
		scene.cursor.set(x, y);
		scene.cursor.onScreen = true;
		
		event.target = scene;
		event.originalEvent = e;
		
		switch(e.button) {
			case 0: event.button = 'left'; break;
			case 1: event.button = 'middle'; break;
			case 2: event.button = 'right'; break;
		}
		
		scene.dispatchEvent(e.type, event);
		applyEach(_focused, EventTarget.prototype.dispatchEvent, e.type, event);
	});
	
	doc.addEventListener('keypress', function(e) {
		var key = e.keyCode || e.which
		, event = new KeyboardEvent('keypress', key);
		
		event.target = scene;
		event.originalEvent = e;
		
		scene.dispatchEvent('keypress', event);
	});
	
	doc.addEventListener('keydown', function(e) {
		var key = e.keyCode || e.which
		, event = new KeyboardEvent('keydown', key);
		
		event.target = scene;
		event.originalEvent = e;
		
		scene.dispatchEvent('keydown', event);
	});
	
	doc.addEventListener('keyup', function(e) {
		var key = e.keyCode || e.which
		, event = new KeyboardEvent('keyup', key);
		
		event.target = scene;
		event.originalEvent = e;
		
		scene.dispatchEvent('keyup', event);
	});
	
	return this;
}

function addSceneAnimationFrameHandlers() {
	var animFrame = null
	, tick = (function animationFrame() {
		var now = new Date();
		
		animFrame = window.requestAnimationFrame(tick);
		
		this.fps = now - this.lastTick;
		this.lastTick = now;
		++this.tickCount;
		
		this.update();
		this.queue.perform();
		this.emit('tick');
		this.reflow();
		this.checkCollisions();
		this.paint();
	}).bind(this);
	
	/**
	 * Starts the animation of the Scene
	 *
	 * @alias Scene#start
	 * @returns {Scene} this
	 * @todo Start scene on browser tab focus
	 * @todo "Play" queue tasks
	**/
	this.start = function() {
		this.stop();
		
		this.run = true;
		
		tick();
		
		return this;
	};
	
	/**
	 * Stops the animation of the Scene
	 *
	 * @alias Scene#stop
	 * @returns {Scene} this
	 * @todo Stop scene on browser tab blur
	 * @todo "Pause" queue tasks
	**/
	this.stop = function() {
		window.cancelAnimationFrame(animFrame);
		
		this.run = false;
		
		return this;
	};
	
	return this;
}

function addSceneCollisionDetectionHandlers() {
	var _watchList = [];
	
	/**
	 * Creates a new CollisionDetector
	 *
	 * @class CollisionDetector
	 * @param {Element} element
	 * @param {Element[]|Element} targets
	 * @param {Boolean} [autoRemove = true]
	 * @description todoc
	**/
	function CollisionDetector(element, targets, autoRemove) {
		this.element = element;
		this.targets = toArray(targets);
		this.autoRemove = autoRemove !== false;
	}
	
	/** @lends CollisionDetector# **/
	var collisionDetectorProto = CollisionDetector.prototype = stdClass();
	collisionDetectorProto.constructor = CollisionDetector;
	
	/**
	 * Adds one or more targets to check
	 *
	 * @param {Element[]|Element} targets
	 * @returns {CollisionDetector} this
	**/
	collisionDetectorProto.addTarget = function(targets) {
		this.targets = this.targets.concat(targets);
		
		return this;
	};
	
	/**
	 * Removes a target
	 *
	 * @param {Element} target
	 * @returns {CollisionDetector} this
	**/
	collisionDetectorProto.removeTarget = function(target) {
		remove(this.targets, target);
		
		return this;
	};
	
	/**
	 * Checks for collision, emits "collision" event if the elements collides
	 *
	 * @returns {CollisionDetector} this
	**/
	collisionDetectorProto.check = function() {
		var elem = this.element
		, i = 0
		, il = this.targets.length
		, target, event;
		
		for (; i < il; i++) {
			target = this.targets[i];
			
			if (!(elem.screenX > target.screenXE || elem.screenXE < target.screenX || elem.screenY > target.screenYE || elem.screenYE < target.screenY)) {
				event = new CollisionEvent('collision', target);
				event.target = elem;
				
				elem.emit(event.type, event);
				
				if (this.autoRemove === true) {
					this.removeTarget(target);
					
					--i;
					--il;
				}
			}
		}
		
		return this;
	};
	
	/**
	 * Creates a new CollisionDetector and adds it to the watchList
	 *
	 * @alias Scene#watch
	 * @param {Element} element
	 * @param {*} targets
	 * @param {Boolean} [autoRemove]
	 * @returns {CollisionDetector}
	**/
	this.watch = function(element, targets, autoRemove) {
		var detector = new CollisionDetector(element, targets, autoRemove);
		
		_watchList.push(detector);
		
		return detector;
	};
	
	/**
	 * Removes the given CollisionDetector from the watchList
	 *
	 * @alias Scene#neglect
	 * @param {CollisionDetector} detector
	 * @returns {Scene} this
	**/
	this.neglect = function(detector) {
		remove(_watchList, detector);
		
		return this;
	};
	
	/**
	 * Calls each CollisionDetector check method from the watchList
	 *
	 * @alias Scene#checkCollisions
	 * @returns {Scene} this
	**/
	this.checkCollisions = function() {
		callEach(_watchList, collisionDetectorProto.check);
		
		return this;
	};
	
	return this;
}

function initScene() {
	this.settings.edit({
		volume: 40,
		maxDraggedEntries: 1,
		renderDepthLimit: 0
	});
	
	return this;
}

/**
 * The uuid of the scene
 *
 * @type String
 * @default null
 * @readonly
**/
sceneProto.uuid = null;

/**
 * The wrapper of the scene
 *
 * @type HTMLElement
 * @default null
 * @readonly
**/
sceneProto.wrapper = null;

/**
 * The screen of the scene
 *
 * @type Screen
 * @default null
 * @readonly
**/
sceneProto.screen = null;

/**
 * The cursor of the scene
 *
 * @type Cursor
 * @default null
 * @readonly
**/
sceneProto.cursor = null;

/**
 * The loading state of the scene
 *
 * @type String
 * @default null
 * @readonly
**/
sceneProto.readyState = null;

/**
 * The settings of the scene
 *
 * @type PublicStorage
 * @default null
 * @readonly
**/
sceneProto.settings = null;

/**
 * The loader of the scene
 *
 * @type Loader
 * @default null
 * @readonly
**/
sceneProto.loader = null;

/**
 * The queue of the scene
 *
 * @type Queue
 * @default null
 * @readonly
**/
sceneProto.queue = null;

/**
 * The running status of the scene
 *
 * @type Boolean
 * @default false
 * @readonly
**/
sceneProto.run = false;

/**
 * The last tick of the scene
 *
 * @type int
 * @default 0
 * @readonly
**/
sceneProto.lastTick = 0;

/**
 * The number of ticks
 *
 * @type int
 * @default 0
 * @readonly
**/
sceneProto.tickCount = 0;

/**
 * The fps of the scene
 *
 * @type int
 * @default 0
 * @readonly
**/
sceneProto.fps = 0;

/**
 * Includes external data
 *
 * @param {String|Object} data
 * @param {Function} callback
 * @returns {Scene} this
 * @todo XML support
**/
sceneProto.include = function(data, callback) {
	var scene = this;
	
	if (isString(data)) {
		HTTP.getJSON(data, function(jsonData) {
			use(scene, jsonData);
			
			if (isFunction(callback)) callback(scene);
		});
	} else {
		if (isObject(data)) use(scene, data);
		if (isFunction(callback)) callback(scene);
	}
	
	return scene;
};

/**
 * Loads components
 *
 * @param {String} path
 * @param {Object} components
 * @returns {Scene} this
**/
sceneProto.preload = function(path, components) {
	var scene = this
	, assetsLoader = $assets.getLoader()
	, onLoad = function() {
		scene.emit('preloadComplete');
		// assetsLoader.off('complete', onLoad);
		assetsLoader.reset();
	};
	
	assetsLoader.on('complete', onLoad);
	
	forIn(components, function(type, items) {
		items = toArray(items);
		
		forEach(items, function(item) {
			var parts = item.split(' as ')
			, source = parts[0].replace(/^@/, path)
			, alias = parts[1]
			, loadItem = assetsLoader.add(type, source, alias);
			
			if (!isNull(loadItem)) $assets.addItem(type, loadItem, source, alias);
		}, this);
	}, this);
	
	assetsLoader.start();
	
	return this;
};

/**
 * Plays an audio
 *
 * @param {Audio|String} audio
 * @param {int} [volume]
 * @param {Boolean} [reset]
 * @param {Function} [callback]
 * @returns {Scene} this
**/
sceneProto.playAudio = function(audio, volume, reset, callback) {
	if (isString(audio) && startsWith(audio, '#')) {
		audio = $assets.getByID(Loader.AUDIO, audio.slice(1));
	}
	
	if (is(audio, Audio)) {
		if (isUndefined(volume)) volume = this.settings.get('volume');
		
		playAudio(audio, volume, reset, callback);
	}
	
	return this;
};

/**
 * Sets the size of the scene
 *
 * @param {int} width
 * @param {int} height
 * @returns {Scene} this
**/
sceneProto.resize = function(width, height) {
	this.setWidth(width);
	this.setHeight(height);
	
	return this;
};

/**
 * Sets the width of the scene
 *
 * @param {int} width
 * @returns {Scene} this
**/
sceneProto.setWidth = function(width) {
	this.screen.width = width;
	this.wrapper.style.width = width + 'px';
	
	return this;
};

/**
 * Sets the height of the scene
 *
 * @param {int} height
 * @returns {Scene} this
**/
sceneProto.setHeight = function(height) {
	this.screen.height = height;
	this.wrapper.style.height = height + 'px';
	
	return this;
};

/**
 * Adds a task to the queue
 *
 * @param {Function} listener
 * @param {int} [delay]
 * @param {Object} [thisArg]
 * @returns {Task}
**/
sceneProto.addTask = function(listener, delay, thisArg) {
	var task = new Task(listener, delay, thisArg);
	
	this.queue.add(task);
	
	return task;
};

/**
 * Removes a task from the queue
 *
 * @param {Task} task
 * @returns {Scene} this
**/
sceneProto.removeTask = function(task) {
	return this.queue.remove(task);
};

/**
 * Adds a task to the queue
 *
 * @param {Function} listener
 * @param {int} delay
 * @param {Object} [thisArg]
 * @returns {Scene} this
**/
sceneProto.later = function(listener, delay, thisArg) {
	return this.queue.add(new Task(function() {
		listener.apply(this, getArgs(arguments));
		
		return true;
	}, delay, thisArg));
};

/**
 * Adds a task to the queue
 *
 * @param {Function} listener
 * @param {int} times
 * @param {int} [delay]
 * @param {Object} [thisArg]
 * @returns {Scene} this
**/
sceneProto.repeat = function(listener, times, delay, thisArg) {
	var n = 0;
	
	return this.queue.add(new Task(function() {
		listener.apply(this, getArgs(arguments));
		
		return ++n >= times;
	}, delay, thisArg));
};

/**
 * Determines if a given element is on the screen
 *
 * @param {Element} element
 * @param {Boolean} [partly = true]
 * @returns {Boolean}
 * @todo Consider parent layer offset on collision check
 * @todo Consider element rotation and scale on collision check
**/
sceneProto.onScreen = function(element, partly) {
	var x = this.screen.pos.x
	, y = this.screen.pos.y
	, xe = x + this.screen.width
	, ye = y + this.screen.height;
	
	return partly === false ?
		element.screenX >= x &&
		element.screenY >= y &&
		element.screenXE <= xe &&
		element.screenYE <= ye
	:
		!(
			x > element.screenXE ||
			xe < element.screenX ||
			y > element.screenYE ||
			ye < element.screenY
		);
};

/**
 * Adds a plugin to the scene
 *
 * @param {String} pluginID
 * @param {Object} [pluginConfig]
 * @returns {Scene} this
**/
sceneProto.addPlugin = function(pluginID, pluginConfig) {
	var plugin = $plugins.get(pluginID)
	, config;
	
	if (!isNull(plugin)) {
		if (!(pluginID in this)) {
			config = Object.create(plugin.config);
			if (isObject(pluginConfig)) assign(config, pluginConfig);
			
			this[pluginID] = plugin.constructor.call(this, config);
			this[pluginID].config = config;
		} else {
			warning('cannot add plugin "' + pluginID + '", already exists in scene');
		}
	} else {
		warning('cannot add plugin "' + pluginID + '", plugin does not exists');
	}
	
	return this;
};

/**
 * Creates an AbstractElement
 *
 * @param {String} elementID
 * @param {String} elementType
 * @param {Object} [elementUse]
 * @param {Array} [args]
 * @returns {Scene} this
**/
sceneProto.createAbstractElement = function(elemID, elementType, elementUse, args) {
	$abstracts.set(elemID, new AbstractElement(elementType, elementUse, args));
	
	return this;
};

/**
 * Updates each element
 *
 * @method
 * @name Scene#update
 * @returns {Scene} this
**/
sceneProto.update = (function() {
	function updateEach(element) {
		element.update();
	}
	
	return function update() {
		this.eachElement(updateEach);
		
		return this;
	};
}());

/**
 * Determines the elements position and size
 *
 * @method
 * @name Scene#reflow
 * @returns {Scene} this
**/
sceneProto.reflow = (function() {
	function eachLayer(layer) {
		placeElement(layer.body, 0, 0, layer.width, layer.height, 0, 0, 0, 0);
	}
	
	function placeElement(element, parentX, parentY, parentWidth, parentHeight, t, l, r, b) {
		var top, left, right, bottom, x, y
		
		, minW = element.minWidth
		, minH = element.minHeight
		, maxW = element.maxWidth
		, maxH = element.maxHeight
		
		, marginTop = parseValue(element.marginTop, parentHeight)
		, marginRight = parseValue(element.marginRight, parentWidth)
		, marginBottom = parseValue(element.marginBottom, parentHeight)
		, marginLeft = parseValue(element.marginLeft, parentWidth)
		
		, offsetX, offsetY
		
		, w = element.width
		, h = element.height
		
		, flow = element.flow;
		
		
		if (flow === 'horizontal') {
			x = r;
			y = t;
		} else if (flow === 'vertical') {
			x = l;
			y = b;
		} else {
			x = parseValue(element.x, parentWidth);
			y = parseValue(element.y, parentHeight);
		}
		
		x += marginLeft;
		y += marginTop;
		
		switch(w) {
			case 'fit': w = parentWidth - (x - parentX); break;
			case 'auto': w = isFunction(element.measureWidth) ? element.measureWidth() : 0; break;
			
			default: w = parseValue(w, parentWidth);
		}
		
		switch(h) {
			case 'fit': h = parentHeight - (y - parentY); break;
			case 'auto': h = isFunction(element.measureHeight) ? element.measureHeight() : 0; break;
			
			default: h = parseValue(h, parentHeight);
		}
		
		if (minW !== 'none') w = Math.max(w, parseValue(minW, parentWidth));
		if (maxW !== 'none') w = Math.min(w, parseValue(maxW, parentWidth));
		if (minH !== 'none') h = Math.max(h, parseValue(minH, parentWidth));
		if (maxH !== 'none') h = Math.min(h, parseValue(maxH, parentWidth));
		
		if (flow === 'vertical') {
			switch(element.horizontalAlign) {
				case 'center': x = l + r / 2 - w / 2; break;
				case 'right': x = r - w; break;
			}
		}
		
		left = x;
		right = x + w + marginRight;
		
		if (flow === 'horizontal') {
			switch(element.verticalAlign) {
				case 'middle': y = t + b / 2 - h / 2; break;
				case 'bottom': y = b - h; break;
			}
		}
		
		top = y;
		bottom = y + h + marginBottom;
		
		if (element.wrap === true) {
			if (flow === 'horizontal') {
				if (right > parentX + parentWidth) {
					x = parentX + marginLeft;
					y = b + marginTop;
					
					top = y;
					right = x + w + marginRight;
					bottom = y + h + marginBottom;
					left = x;
				}
			} else if (flow === 'vertical') {
				if (bottom > parentY + parentHeight) {
					x = r + marginLeft;
					y = parentY + marginTop;
					
					top = y;
					right = x + w + marginRight;
					bottom = y + h + marginBottom;
					left = x;
				}
			}
		}
		
		if (is(element, ContainerElement)) {
			bottom = top;
			right = left;
			
			element.each(function(child) {
				var last = placeElement(child, x, y, w, h, top, left, right, bottom);
				
				if (last.flow === 'horizontal' || last.flow === 'vertical') {
					top = range(parentY, top, last.top);
					right = Math.max(right, last.right);
					bottom = Math.max(bottom, last.bottom);
					left = range(parentX, left, last.left);
				}
			}, null, false);
		}
		
		element.top = top;
		element.right = right;
		element.bottom = bottom;
		element.left = left;
		
		offsetX = parseValue(element.offsetX, w);
		offsetY = parseValue(element.offsetY, h);
		
		if (isNumber(offsetX)) x += offsetX;
		if (isNumber(offsetY)) y += offsetY;
		
		element.screenX = x;
		element.screenY = y;
		
		element.parentX = x - parentX;
		element.parentY = y - parentY;
		
		element.renderWidth = w;
		element.renderHeight = h;
		
		return element;
	}
	
	function parseValue(val, relativeTo) {
		var num;
		
		if (isNumber(val)) return val;
		
		val = String(val);
		
		if (!isNumber(relativeTo)) return 0;
		
		switch(val) {
			case 'left': return 0;
			case 'center': return relativeTo / 2;
			case 'right': return relativeTo;
			
			case 'stick left': return relativeTo;
			case 'stick center': return relativeTo * 1.5;
			case 'stick right': return relativeTo * 2;
		}
		
		num = findFirstRegX(numRegX, val);
		
		if (isNull(num)) return 0;
		
		num = Number(num);
		
		if (startsWith(val, 'stick')) {
			if (endsWith(val, '%')) return relativeTo + relativeTo * num / 100;
			
			return relativeTo + num;
		} else {
			if (endsWith(val, '%')) return num * relativeTo / 100;
			
			return num;
		}
	}
	
	return function reflow() {
		this.eachLayer(eachLayer);
		
		return this;
	};
}());

/**
 * Displays the elements
 *
 * @method
 * @name Scene#paint
 * @returns {Scene} this
**/
sceneProto.paint = (function() {
	function render(layer) {
		if (layer.live) layer.render();
	}
	
	return function paint() {
		this.eachLayer(render);
		
		return this;
	};
}());

/**
 * Returns the string value of the scene
 *
 * @returns {String}
**/
sceneProto.toString = function() {
	return 'Chill Scene';
};
