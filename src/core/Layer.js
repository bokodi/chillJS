/**
 * Creates a new Layer
 *
 * @class Layer
 * @extends EventTarget
 * @param {Object} [layerUse]
 * @description todoc
**/
function Layer(layerUse) {
	EventTarget.call(this);
	addLayerElementHandlers.call(this);
	
	this.uuid = generateUUID();
	this.canvas = createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	
	use(this, layerUse);
}

/** @lends Layer# **/
var layerProto = Layer.prototype = Object.create(EventTarget.prototype);
layerProto.constructor = Layer;

function addLayerElementHandlers() {
	var self = this
	, _containers = stdClass()
	, _body = new ContainerElement('body');
	
	/**
	 * The main ContainerElement of the Layer
	 *
	 * @alias Layer#body
	 * @type ContainerElement
	**/
	this.body = _containers.body = _body;
	
	function validateSelfElement(element) {
		return element.parentLayer === self && is(element.parentElement, ContainerElement) && self.contains(element);
	}
	
	/**
	 * Adds an Element to the Layer
	 *
	 * @alias Layer#add
	 * @param {Element} element
	 * @param {String} container
	 * @param {int} [orderID]
	 * @returns {Layer} this
	**/
	this.add = function(element, container, orderID) {
		if (is(element, Element)) {
			if (is(element, ContainerElement)) {
				if (has(_containers, element.id)) {
					warning('unable to add container#' + element.id + ', "' + element.id + '" already exists in layer#' + this.id);
					
					return this;
				}
				
				_containers[element.id] = element;
			}
			
			if (!has(_containers, container)) {
				if (!isUndefined(container)) warning('"' + container + '" does not exists in layer#' + this.id + ', use #body by default');
				container = 'body';
			}
			
			_containers[container].add(element, orderID);
			
			element.parentLayer = this;
			element.parentElement = _containers[container];
		} else {
			warning('only elements can be added to layer#' + this.id);
		}
		
		return this;
	};
	
	/**
	 * Gets an element by id
	 *
	 * @alias Layer#getElementByID
	 * @param {String} id
	 * @returns {?Element}
	 * @todo Break forEach if find element
	**/
	this.getElementByID = function(id) {
		var returnElement = null;
		
		this.eachElement(function(element) {
			if (element.id === id) returnElement = element;
		});
		
		return returnElement;
	};
	
	/**
	 * Checks if the Layer contains a specific Element
	 *
	 * @alias Layer#contains
	 * @param {Element} searchElement
	 * @returns {Boolean}
	**/
	this.contains = function(searchElement) {
		var returnValue = false;
		
		this.eachContainer(function(container) {
			if (container === searchElement || container.has(searchElement)) return returnValue = true;
		});
		
		return returnValue;
	};
	
	/**
	 * Removes an Element from the Layer
	 *
	 * @alias Layer#remove
	 * @param {Element} removeElement
	 * @returns {?Element} removed
	**/
	this.remove = function(removeElement) {
		var removed = null;
		
		if (removeElement === _body) {
			warning('cannot remove #body from layer#' + this.id);
		} else {
			this.eachContainer(function(container, containerKey) {
				if (container === removeElement) {
					delete _containers[containerKey];
					
					return removed = removeElement;
				} else if (container.has(removeElement)) {
					container.remove(removeElement);
					
					removeElement.parentLayer = null;
					removeElement.parentElement = null;
					
					return removed = removeElement;
				}
			});
		}
		
		return removed;
	};
	
	/**
	 * Creates a new Element and returns it
	 *
	 * @alias Layer#create
	 * @param {String} type
	 * @param {...*}
	 * @returns {?Element}
	**/
	this.create = function(type) {
		var element = null
		, constructor, args, abstractElement;
		
		if (startsWith(type, '#')) {
			type = type.slice(1);
			abstractElement = $abstracts.get(type);
			
			if (!isNull(abstractElement)) {
				element = abstractElement.instantiate();
				
				if (!isNull(element)) {
					element.edit(arguments[1]);
				} else {
					warning('Unable to instantiate AbstractElement. Element "' + abstractElement.type + '" is not instantiatable or does not exists');
				}
			} else {
				warning('AbstractElement "' + type + '" does not exist');
			}
		} else {
			constructor = $elements.getInstantiatable(type);
			
			if (!isNull(constructor)) {
				args = getArgs(arguments, 1);
				args.unshift(null);
				
				element = new (Function.prototype.bind.apply(constructor, args));
			} else {
				warning('Unable to instantiate Element. "' + abstractElement.type + '" is not instantiatable or does not exists');
			}
		}
		
		return element;
	};
	
	/**
	 * Combination of Layer#create and Layer#add
	 *
	 * @alias Layer#insert
	 * @param {String} elementType
	 * @param {Object|Array} [args]
	 * @param {String} [container]
	 * @param {int} [orderID]
	 * @returns {?Element}
	**/
	this.insert = function(elementType, args, container, orderID) {
		var element = isArray(args) ? this.create.apply(this, [elementType].concat(args)) : this.create(elementType, args);
		
		this.add(element, container, orderID);
		
		return element;
	};
	
	/**
	 * Sets the order position of the Element exactly before the reference
	 *
	 * @alias Layer#moveBefore
	 * @param {Element} element
	 * @param {Element} reference
	 * @returns {Layer} this
	**/
	this.moveBefore = function(element, reference) {
		if (validateSelfElement(element) && validateSelfElement(reference)) {
			element.parentElement.remove(element);
			reference.parentElement.addBefore(element, reference);
			element.parentElement = reference.parentElement;
		}
		
		return this;
	};
	
	/**
	 * Sets the order position of the Element exactly after the reference
	 *
	 * @alias Layer#moveAfter
	 * @param {Element} element
	 * @param {Element} reference
	 * @returns {Layer} this
	**/
	this.moveAfter = function(element, reference) {
		if (validateSelfElement(element) && validateSelfElement(reference)) {
			element.parentElement.remove(element);
			reference.parentElement.addAfter(element, reference);
			element.parentElement = reference.parentElement;
		}
		
		return this;
	};
	
	/**
	 * Returns a list of elements by the given query selector
	 *
	 * @alias Layer#select
	 * @param {String} query
	 * @param {ContainerElement} [context = this.body]
	 * @returns {Array}
	 * @todo Implement this method
	**/
	this.select = function(query, context) {
		return [];
	};
	
	/**
	 * Executes a provided callback function recursively once per Element in ascending order
	 *
	 * @alias Layer#eachElement
	 * @param {Function} callback
	 * @param {*} [thisArg]
	 * @returns {Layer} this
	**/
	this.eachElement = function(callback, thisArg) {
		callback.call(thisArg, _body);
		_body.each(callback, thisArg);
		
		return this;
	};
	
	/**
	 * Executes a provided callback function once per ContainerElement
	 *
	 * @alias Layer#eachContainer
	 * @param {Function} callback
	 * @param {*} [thisArg]
	 * @returns {Layer} this
	**/
	this.eachContainer = function(callback, thisArg) {
		var key;
		
		for (key in _containers) {
			if (!isUndefined(callback.call(thisArg, _containers[key], key))) break;
		}
		
		return this;
	};
	
	return this;
}

/**
 * The scene of the layer
 *
 * @type Scene
 * @default null
 * @readonly
**/
layerProto.root = null;

/**
 * The id of the layer
 *
 * @type String
 * @default null
**/
layerProto.id = null;

/**
 * The uuid of the layer
 *
 * @type String
 * @default null
 * @readonly
**/
layerProto.uuid = null;

/**
 * The canvas of the layer
 *
 * @type HTMLCanvasElement
 * @default null
 * @readonly
**/
layerProto.canvas = null;

/**
 * The 2d rendering context of the layer
 * 
 * @type CanvasRenderingContext2D
 * @default null
 * @readonly
**/
layerProto.ctx = null;

/**
 * The x position of the canvas
 *
 * @name Layer#x
 * @type Number
 * @default 0
**/
Object.defineProperty(layerProto, 'x', {
	get: function() {
		return getInt(this.canvas.style.left) || 0;
	},
	set: function(xVal) {
		return this.canvas.style.left = xVal + 'px';
	}
});

/**
 * The y position of the canvas
 *
 * @name Layer#y
 * @type Number
 * @default 0
**/
Object.defineProperty(layerProto, 'y', {
	get: function() {
		return getInt(this.canvas.style.top) || 0;
	},
	set: function(yVal) {
		return this.canvas.style.top = yVal + 'px';
	}
});

/**
 * The width of the layer
 *
 * @name Layer#width
 * @type Number
**/
Object.defineProperty(layerProto, 'width', {
	get: function() {
		return this.canvas.width;
	},
	set: function(widthVal) {
		return this.canvas.width = widthVal;
	}
});

/**
 * The height of the layer
 *
 * @name Layer#height
 * @type Number
**/
Object.defineProperty(layerProto, 'height', {
	get: function() {
		return this.canvas.height;
	},
	set: function(heightVal) {
		return this.canvas.height = heightVal;
	}
});

/**
 * The z-index of the layer's canvas
 *
 * @name Layer#zIndex
 * @type Number
 * @default 0
**/
Object.defineProperty(layerProto, 'zIndex', {
    get: function() {
		return +this.canvas.style.zIndex;
	},
	set: function(val) {
		return +(this.canvas.style.zIndex = val);
	}
});

/**
 * The background of the layer's canvas
 *
 * @name Layer#background
 * @type String
 * @default 'rgba(0, 0, 0, 0)'
**/
Object.defineProperty(layerProto, 'background', {
	get: function() {
		return this.canvas.style.background;
	},
	set: function(bgVal) {
		return this.canvas.style.background = bgVal;
	}
});

/**
 * The alpha level (globalAlpha) of the layer's canvas element
 *
 * @name Layer#opacity
 * @type float
 * @default 1
**/
Object.defineProperty(layerProto, 'opacity', {
	get: function() {
		return this.ctx.globalAlpha;
	},
	set: function(opacity) {
		return this.ctx.globalAlpha = opacity;
	}
});

/**
 * If the renderer should update the layer at every tick
 *
 * @type Boolean
 * @default true
**/
layerProto.live = true;

/**
 * If the layer should be rendered
 *
 * @type Boolean
 * @default true
**/
layerProto.visible = true;

/**
 * Renders the entries of the layer
 *
 * @method
 * @name Layer#render
 * @returns {Layer} this
**/
layerProto.render = (function() {
	function draw(element) {
		var ctx = this.ctx;
		
		ctx.save();
		
		element.applyTransform(ctx);
		element.applyMask(ctx);
		element.drawBox(ctx);
		element.draw(ctx);
		
		ctx.restore();
	}
	
	return function render() {
		if (this.visible === true) {
			this.clear();
			this.eachElement(draw, this);
		}
		
		return this;
	};
}());

/**
 * Clears the entire layer
 *
 * @returns {Layer} this
**/
layerProto.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
	
	return this;
};

/**
 * Gets ImageData from the layer
 *
 * @param {int} x
 * @param {int} y
 * @returns {Uint8ClampedArray}
**/
layerProto.getPixel = function(x, y) {
	return this.ctx.getImageData(x, y, 1, 1).data;
};

/**
 * Scrolls the layer, sets it's x and y to the given values
 *
 * @param {int} x
 * @param {int} y
 * @returns {Layer} this
**/
layerProto.scrollTo = function(x, y) {
	this.x = x;
	this.y = y;
	
	return this;
};

/**
 * Scrolls the layer, edits it's x and y by the given values
 *
 * @param {int} x
 * @param {int} y
 * @returns {Layer} this
**/
layerProto.scrollBy = function(x, y) {
	this.x += x;
	this.y += y;
	
	return this;
};

/**
 * Returns the string value of the layer
 *
 * @returns {String}
**/
layerProto.toString = function() {
	return 'Chill Layer';
};
