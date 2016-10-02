/**
 * Creates a new Element
 *
 * @class Element
 * @extends EventTarget
 * @description todoc
**/
function Element() {
	EventTarget.call(this);
	Storage.call(this);
	addElementPropertyHandlers.call(this);
	
	this.uuid = generateUUID();
	this.velocity = new Vector2(0, 0);
	
	this.classList = new ClassList();
	this.classList.add(elementProto.elementType, 0);
	
	forIn(elementClass, this.addProp, this);
}

/** @lends Element# **/
var elementProto = Element.prototype = Object.create(EventTarget.prototype);
elementProto.constructor = Element;

var addElementPropertyHandlers = (function() {
	/**
	 * Creates a new ElementProperty
	 *
	 * @class ElementProperty
	 * @param {String} propertyKey
	 * @param {*} primitiveValue
	 * @param {Boolean} inheritable
	 * @description todoc
	**/
	function ElementProperty(propertyKey, primitiveValue, inheritable) {
		this.key = propertyKey;
		this.edit(primitiveValue, inheritable);
		this.initialValue = this.value;
		
		this.value = 'inherit';
	}
	
	/** @lends ElementProperty# **/
	var elementPropertyProto = ElementProperty.prototype = stdClass();
	elementPropertyProto.constructor = ElementProperty;
	
	/**
	 * Edits the property, sets it's primitiveValue and inheritable properties
	 *
	 * @param {*} primitiveValue
	 * @param {Boolean} [inheritable]
	 * @returns {ElementProperty} this
	**/
	elementPropertyProto.edit = function(primitiveValue, inheritable) {
		var parsed = parseMethod(primitiveValue);
		
		this.primitiveValue = primitiveValue;
		this.value = isNull(parsed) ? primitiveValue : parsed;
		this.type = isFunction(this.value) ? 'method' : 'property';
		
		if (isBoolean(inheritable)) this.inheritable = inheritable;
		
		return this;
	};
	
	return function propertyHandlers() {
		var _properties = stdClass();
		
		/**
		 * Adds a property to the Element
		 *
		 * @alias Element#addProp
		 * @param {String} propertyKey
		 * @param {*} primitiveValue
		 * @param {Boolean} [inheritable]
		 * @returns {Element} this
		 * @todo Need to rewrite the property handler methods
		**/
		this.addProp = function(propertyKey, primitiveValue, inheritable) {
			if (!isBoolean(inheritable)) inheritable = true;
			
			if (this.hasProp(propertyKey)) {
				warning(this.toString() + ' already has property ' + propertyKey);
			}
			
			_properties[propertyKey] = new ElementProperty(propertyKey, primitiveValue, inheritable);
			
			Object.defineProperty(this, propertyKey, {
				configurable: true,
				enumerable: false,
				get: function () {
					var val = _properties[propertyKey].value;
					
					if (val === 'inherit') val = this.classList.execute(function(className) {
						var classData = $classes.get(className);
						
						if (
							!isNull(classData) &&
							!isUndefined(classData[propertyKey]) &&
							classData[propertyKey] !== 'inherit'
						) return classData[propertyKey] === 'initial' ? _properties[propertyKey].initialValue : classData[propertyKey];
					}, this);
					
					return isFunction(val) ? val.call(this) : val;
				},
				set: function (propertyVal) {
					return _properties[propertyKey].edit(propertyVal).value;
				}
			});
			
			return this;
		};
		
		/**
		 * Adds a property to the Element if it doesn't has it already
		 *
		 * @alias Element#addPropSafe
		 * @param {String} propertyKey
		 * @param {*} primitiveValue
		 * @param {Boolean} [inheritable]
		 * @returns {Element} this
		**/
		this.addPropSafe = function(propertyKey, primitiveValue, inheritable) {
			if (!this.hasProp(propertyKey)) this.addProp(propertyKey, primitiveValue, inheritable);
			
			return this;
		};
		
		/**
		 * Checks if the Element has a specific property
		 *
		 * @alias Element#hasProp
		 * @param {String} propertyKey
		 * @returns {Boolean}
		**/
		this.hasProp = function(propertyKey) {
			return has(_properties, propertyKey);
		};
		
		/**
		 * Removes a property from the Element
		 *
		 * @alias Element#removeProp
		 * @param {String} propertyKey
		 * @returns {Element} this
		**/
		this.removeProp = function(propertyKey) {
			if (has(_properties, propertyKey)) {
				delete _properties[propertyKey];
				delete this[propertyKey];
			}
			
			return this;
		};
		
		/**
		 * Edits a property of the Element
		 *
		 * @alias Element#setProp
		 * @param {String} propertyKey
		 * @param {*} primitiveValue
		 * @param {Boolean} [inheritable]
		 * @returns {Element} this
		**/
		this.setProp = function(propertyKey, primitiveValue, inheritable) {
			if (has(_properties, propertyKey)) {
				_properties[propertyKey].edit(primitiveValue, inheritable);
			}
			
			return this;
		};
		
		/**
		 * Returns an ElementProperty of the Element by key
		 *
		 * @alias Element#getProp
		 * @param {String} propertyKey
		 * @returns {?ElementProperty}
		**/
		this.getProp = function(propertyKey) {
			return _properties[propertyKey] || null;
		};
		
		/**
		 * Returns all ElementProperty from the Element (reduced by the given filter)
		 *
		 * @alias Element#getProps
		 * @param {Function} [filter]
		 * @returns {Array}
		**/
		this.getProps = function(filter) {
			var props = [];
			
			forIn(_properties, function(propertyKey, property) {
				if (isUndefined(filter) || filter.call(this, propertyKey, property) === true) props.push(property);
				
				return false;
			}, this);
			
			return props;
		};
		
		return this;
	};
}());

/**
 * The type of the element
 *
 * @type String
 * @default 'Element'
 * @readonly
**/
elementProto.elementType = 'Element';

/**
 * The name of the element
 *
 * @type String
 * @default 'Element'
 * @readonly
**/
elementProto.elementName = 'Element';

/**
 * The id of the element
 *
 * @type String
 * @default null
 * @readonly
**/
elementProto.id = null;

/**
 * The uuid of the element
 *
 * @type String
 * @default null
 * @readonly
**/
elementProto.uuid = null;

Object.defineProperty(elementProto, 'className', {
	/**
	 * The classes of the element
	 *
	 * @name Element#className
	 * @type String
	 * @readonly
	 **/
	get: function() {
		return this.classList.all().join(' ');
	}
});

/**
 * The parentLayer of the element
 *
 * @type Layer
 * @default null
 * @readonly
**/
elementProto.parentLayer = null;

/**
 * The parentElement of the element
 *
 * @type ContainerElement
 * @default null
 * @readonly
**/
elementProto.parentElement = null;

/**
 * The classes of the element
 *
 * @type ClassList
 * @default null
 * @readonly
**/
elementProto.classList = null;

/**
 * The velocity of the element
 *
 * @type Vector2
 * @default null
**/
elementProto.velocity = null;

Object.defineProperty(elementProto, 'vX', {
	/**
	 * The horizontal velocity of the element
	 *
	 * @name Element#vX
	 * @type Number
	 **/
	get: function() {
		return this.velocity.x;
	},
	set: function(xVal) {
		return this.velocity.setX(xVal).x;
	}
});

Object.defineProperty(elementProto, 'vY', {
	/**
	 * The vertical velocity of the element
	 *
	 * @name Element#vY
	 * @type Number
	 **/
	get: function() {
		return this.velocity.y;
	},
	set: function(yVal) {
		return this.velocity.setY(yVal).y;
	}
});

/**
 * The x position of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.x = 0;

/**
 * The y position of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.y = 0;

/**
 * The maximum x position of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.maxX = 'none';

/**
 * The maximum y position of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.maxY = 'none';

/**
 * The minimum x position of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.minX = 'none';

/**
 * The minimum y position of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.minY = 'none';

/**
 * The horizontal offset of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.offsetX = 0;

/**
 * The vertical offset of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.offsetY = 0;

/**
 * The width of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.width = 0;

/**
 * The height of the element
 *
 * @type Number|String
 * @default 0
**/
elementProto.height = 0;

/**
 * The maximum width of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.maxWidth = 'none';

/**
 * The maximum height of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.maxHeight = 'none';

/**
 * The minimum width of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.minWidth = 'none';

/**
 * The minimum height of the element
 *
 * @type Number|String
 * @default 'none'
**/
elementProto.minHeight = 'none';

/**
 * The top position of the element on the screen, including margin
 *
 * @type Number
 * @default 0
 * @readonly
**/
elementProto.top = 0;

/**
 * The right position of the element on the screen, including margin
 *
 * @type Number
 * @default 0
 * @readonly
**/
elementProto.right = 0;

/**
 * The bottom position of the element on the screen, including margin
 *
 * @type Number
 * @default 0
 * @readonly
**/
elementProto.bottom = 0;

/**
 * The left position of the element on the screen, including margin
 *
 * @type Number
 * @default 0
 * @readonly
**/
elementProto.left = 0;

/**
 * The x position of the element, relative to the scene
 *
 * @type Number
 * @default 0
 * @readonly
**/
elementProto.screenX = 0;

/**
 * The y position of the element, relative to the scene
 *
 * @type Number
 * @default 0
 * @readonly
**/
elementProto.screenY = 0;

/**
 * The x position of the element, relative to it's parent
 *
 * @type Number
 * @default 0
 * @readonly
**/
elementProto.parentX = 0;

/**
 * The y position of the element, relative to it's parent
 *
 * @type Number
 * @default 0
 * @readonly
**/
elementProto.parentY = 0;

/**
 * The layout width of the element
 *
 * @type Number
 * @default 0
 * @readonly
**/
elementProto.renderWidth = 0;

/**
 * The layout height of the element
 *
 * @type Number
 * @default 0
 * @readonly
**/
elementProto.renderHeight = 0;

Object.defineProperties(elementProto, {
	screenXC: {
		/**
		 * The horizontal center position of the element, relative to the scene
		 *
		 * @name Element#screenXC
		 * @type Number
		 * @readonly
		 **/
		get: function() { return this.screenX + this.renderWidth / 2 }
	},
	screenYC: {
		/**
		 * The vertical center position of the element, relative to the scene
		 *
		 * @name Element#screenYC
		 * @type Number
		 * @readonly
		 **/
		get: function() { return this.screenY + this.renderHeight / 2 }
	},
	
	screenXE: {
		/**
		 * The horizontal end position of the element, relative to the scene
		 *
		 * @name Element#screenXE
		 * @type Number
		 * @readonly
		 **/
		get: function() { return this.screenX + this.renderWidth }
	},
	screenYE: {
		/**
		 * The vertical end position of the element, relative to the scene
		 *
		 * @name Element#screenYE
		 * @type Number
		 * @readonly
		 **/
		get: function() { return this.screenY + this.renderHeight }
	},
	
	
	parentXC: {
		/**
		 * The horizontal center position of the element, relative to it's parent
		 *
		 * @name Element#parentXC
		 * @type Number
		 * @readonly
		 **/
		get: function() { return this.parentX + this.renderWidth / 2 }
	},
	parentYC: {
		/**
		 * The vertical center position of the element, relative to it's parent
		 *
		 * @name Element#parentYC
		 * @type Number
		 * @readonly
		 **/
		get: function() { return this.parentY + this.renderHeight / 2 }
	},
	
	parentXE: {
		/**
		 * The horizontal end position of the element, relative to it's parent
		 *
		 * @name Element#parentXE
		 * @type Number
		 * @readonly
		 **/
		get: function() { return this.parentX + this.renderWidth }
	},
	parentYE: {
		/**
		 * The vertical end position of the element, relative to it's parent
		 *
		 * @name Element#parentYE
		 * @type Number
		 * @readonly
		 **/
		get: function() { return this.parentY + this.renderHeight }
	}
});

/**
 * The width ratio of the element
 *
 * @type Number
 * @default 1
**/
elementProto.scaleX = 1;

/**
 * The height ratio of the element
 *
 * @type Number
 * @default 1
**/
elementProto.scaleY = 1;

/**
 * The clockwise rotation of the entry
 *
 * @type Number
 * @default 0
**/
elementProto.angle = 0;

/**
 * If the element should be mirrored horizontally
 *
 * @type Boolean
 * @default false
**/
elementProto.flipX = false;

/**
 * If the element should be mirrored vertically
 *
 * @type Boolean
 * @default false
**/
elementProto.flipY = false;

/**
 * The flow of the element
 *
 * @type ('none'|'horizontal'|'vertical')
 * @default 'none'
**/
elementProto.flow = 'none';

/**
 * The wrap of the element
 *
 * @type Boolean
 * @default true
**/
elementProto.wrap = true;

/**
 * The dragging status of the element
 *
 * @type Boolean
 * @default false
 * @todo Implement dragState
**/
elementProto.dragState = false;

/**
 * The focus status of the element
 *
 * @type Boolean
 * @default false
 * @todo Implement onFocus
**/
elementProto.onFocus = false;

/**
 * If the element allows mouse events through transparent pixel
 *
 * @type Boolean
 * @default true
 * @todo Implement isBlock
**/
elementProto.isBlock = true;

/**
 * The cursor type of the element
 *
 * @type String
 * @default 'default'
 * @todo Implement cursor
**/
elementProto.cursor = 'default';

/**
 * If the element allows drop on it
 *
 * @type Boolean
 * @default false
 * @todo Implement allowDrop
**/
elementProto.allowDrop = false;

/**
 * The title of the element
 *
 * @type String
 * @default ''
 * @todo Implement title
**/
elementProto.title = '';

/**
 * The transparency of the element
 *
 * @type Number
 * @default 1
 * @todo Implement opacity
**/
elementProto.opacity = 1;

/**
 * The background of the element
 *
 * @type String
 * @default ''
**/
elementProto.background = '';

/**
 * The mask id of the element
 *
 * @type String
 * @default ''
**/
elementProto.mask = '';

/**
 * The horizontal align of the element
 *
 * @type ('left'|'center'|'right')
 * @default 'left'
**/
elementProto.horizontalAlign = 'left';

/**
 * The vertical align of the element
 *
 * @type ('top'|'middle'|'bottom')
 * @default 'top'
**/
elementProto.verticalAlign = 'top';

/**
 * The top margin of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.marginTop = 0;

/**
 * The right margin of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.marginRight = 0;

/**
 * The bottom margin of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.marginBottom = 0;

/**
 * The left margin of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.marginLeft = 0;

Object.defineProperty(elementProto, 'margin', {
	/**
	 * The margin of the element
	 *
	 * @name Element#margin
	 * @type String
	 **/
	get: function() {
		return this.marginTop + ' ' + this.marginRight + ' ' + this.marginBottom + ' ' + this.marginLeft;
	},
	set: function(margin) {
		var pieces = margin.split(' ')
		, len = pieces.length;
		
		if (len === 1) {
			this.marginTop = pieces[0];
			this.marginRight = pieces[0];
			this.marginBottom = pieces[0];
			this.marginLeft = pieces[0];
		} else if (len === 2) {
			this.marginTop = pieces[0];
			this.marginRight = pieces[1];
			this.marginBottom = pieces[0];
			this.marginLeft = pieces[1];
		} else if (len === 3) {
			this.marginTop = pieces[0];
			this.marginRight = pieces[1];
			this.marginBottom = pieces[2];
			this.marginLeft = pieces[1];
		} else {
			this.marginTop = pieces[0];
			this.marginRight = pieces[1];
			this.marginBottom = pieces[2];
			this.marginLeft = pieces[3];
		}
		
		return this.margin;
	}
});

/**
 * The top padding of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.paddingTop = 0;

/**
 * The right padding of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.paddingRight = 0;

/**
 * The bottom padding of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.paddingBottom = 0;

/**
 * The left padding of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.paddingLeft = 0;

Object.defineProperty(elementProto, 'padding', {
	/**
	 * The padding of the element
	 *
	 * @name Element#padding
	 * @type String
	 **/
	get: function() {
		return this.paddingTop + ' ' + this.paddingRight + ' ' + this.paddingBottom + ' ' + this.paddingLeft;
	},
	set: function(padding) {
		var pieces = padding.split(' ')
		, len = pieces.length;
		
		if (len === 1) {
			this.paddingTop = pieces[0];
			this.paddingRight = pieces[0];
			this.paddingBottom = pieces[0];
			this.paddingLeft = pieces[0];
		} else if (len === 2) {
			this.paddingTop = pieces[0];
			this.paddingRight = pieces[1];
			this.paddingBottom = pieces[0];
			this.paddingLeft = pieces[1];
		} else if (len === 3) {
			this.paddingTop = pieces[0];
			this.paddingRight = pieces[1];
			this.paddingBottom = pieces[2];
			this.paddingLeft = pieces[1];
		} else {
			this.paddingTop = pieces[0];
			this.paddingRight = pieces[1];
			this.paddingBottom = pieces[2];
			this.paddingLeft = pieces[3];
		}
		
		return this.padding;
	}
});

/**
 * The border of the element
 *
 * @name Element#border
 * @type String
**/
Object.defineProperty(elementProto, 'border', {
	get: undefined,
	set: function(border) {
		var pieces = border.split(' ')
		, len = pieces.length;
		
		if (len >= 1) {
			this.borderTopWidth = pieces[0];
			this.borderRightWidth = pieces[0];
			this.borderBottomWidth = pieces[0];
			this.borderLeftWidth = pieces[0];
		}
		
		if (len >= 2) {
			this.borderTopStyle = pieces[1];
			this.borderRightStyle = pieces[1];
			this.borderBottomStyle = pieces[1];
			this.borderLeftStyle = pieces[1];
		}
		
		if (len === 3) {
			this.borderTopColor = pieces[2];
			this.borderRightColor = pieces[2];
			this.borderBottomColor = pieces[2];
			this.borderLeftColor = pieces[2];
		}
		
		return border;
	}
});

/**
 * The top border of the element
 *
 * @name Element#borderTop
 * @type String
**/
Object.defineProperty(elementProto, 'borderTop', {
	get: undefined,
	set: function(borderTop) {
		var pieces = borderTop.split(' ')
		, len = pieces.length;
		
		if (len >= 1) this.borderTopWidth = pieces[0];
		if (len >= 2) this.borderTopStyle = pieces[1];
		if (len === 3) this.borderTopColor = pieces[2];
		
		return borderTop;
	}
});

/**
 * The right border of the element
 *
 * @name Element#borderRight
 * @type String
**/
Object.defineProperty(elementProto, 'borderRight', {
	get: undefined,
	set: function(borderRight) {
		var pieces = borderRight.split(' ')
		, len = pieces.length;
		
		if (len >= 1) this.borderRightWidth = pieces[0];
		if (len >= 2) this.borderRightStyle = pieces[1];
		if (len === 3) this.borderRightColor = pieces[2];
		
		return borderRight;
	}
});

/**
 * The bottom border of the element
 *
 * @name Element#borderBottom
 * @type String
**/
Object.defineProperty(elementProto, 'borderBottom', {
	get: undefined,
	set: function(borderBottom) {
		var pieces = borderBottom.split(' ')
		, len = pieces.length;
		
		if (len >= 1) this.borderBottomWidth = pieces[0];
		if (len >= 2) this.borderBottomStyle = pieces[1];
		if (len === 3) this.borderBottomColor = pieces[2];
		
		return borderBottom;
	}
});

/**
 * The left border of the element
 *
 * @name Element#borderLeft
 * @type String
**/
Object.defineProperty(elementProto, 'borderLeft', {
	get: undefined,
	set: function(borderLeft) {
		var pieces = borderLeft.split(' ')
		, len = pieces.length;
		
		if (len >= 1) this.borderLeftWidth = pieces[0];
		if (len >= 2) this.borderLeftStyle = pieces[1];
		if (len === 3) this.borderLeftColor = pieces[2];
		
		return borderLeft;
	}
});

/**
 * The top border width of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.borderTopWidth = 0;

/**
 * The right border width of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.borderRightWidth = 0;

/**
 * The bottom border width of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.borderBottomWidth = 0;

/**
 * The left border width of the element
 *
 * @type String|Number
 * @default 0
**/
elementProto.borderLeftWidth = 0;

Object.defineProperty(elementProto, 'borderWidth', {
	/**
	 * The width of the element's border
	 *
	 * @name Element#borderWidth
	 * @type String
	 **/
	get: function() {
		return this.borderTopWidth + ' ' + this.borderRightWidth + ' ' + this.borderBottomWidth + ' ' + this.borderLeftWidth;
	},
	set: function(borderWidth) {
		var pieces = borderWidth.split(' ')
		, len = pieces.length;
		
		if (len === 1) {
			this.borderTopWidth = pieces[0];
			this.borderRightWidth = pieces[0];
			this.borderBottomWidth = pieces[0];
			this.borderLeftWidth = pieces[0];
		} else if (len === 2) {
			this.borderTopWidth = pieces[0];
			this.borderRightWidth = pieces[1];
			this.borderBottomWidth = pieces[0];
			this.borderLeftWidth = pieces[1];
		} else if (len === 3) {
			this.borderTopWidth = pieces[0];
			this.borderRightWidth = pieces[1];
			this.borderBottomWidth = pieces[2];
			this.borderLeftWidth = pieces[1];
		} else {
			this.borderTopWidth = pieces[0];
			this.borderRightWidth = pieces[1];
			this.borderBottomWidth = pieces[2];
			this.borderLeftWidth = pieces[3];
		}
		
		return this.borderWidth;
	}
});

/**
 * The top border style of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderTopStyle = 'none';

/**
 * The right border style of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderRightStyle = 'none';

/**
 * The bottom border style of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderBottomStyle = 'none';

/**
 * The left border style of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderLeftStyle = 'none';

Object.defineProperty(elementProto, 'borderStyle', {
	/**
	 * The style of the element's border
	 *
	 * @name Element#borderStyle
	 * @type String
	 **/
	get: function() {
		return this.borderTopStyle + ' ' + this.borderRightStyle + ' ' + this.borderBottomStyle + ' ' + this.borderLeftStyle;
	},
	set: function(borderStyle) {
		var pieces = borderStyle.split(' ')
		, len = pieces.length;
		
		if (len === 1) {
			this.borderTopStyle = pieces[0];
			this.borderRightStyle = pieces[0];
			this.borderBottomStyle = pieces[0];
			this.borderLeftStyle = pieces[0];
		} else if (len === 2) {
			this.borderTopStyle = pieces[0];
			this.borderRightStyle = pieces[1];
			this.borderBottomStyle = pieces[0];
			this.borderLeftStyle = pieces[1];
		} else if (len === 3) {
			this.borderTopStyle = pieces[0];
			this.borderRightStyle = pieces[1];
			this.borderBottomStyle = pieces[2];
			this.borderLeftStyle = pieces[1];
		} else {
			this.borderTopStyle = pieces[0];
			this.borderRightStyle = pieces[1];
			this.borderBottomStyle = pieces[2];
			this.borderLeftStyle = pieces[3];
		}
		
		return this.borderStyle;
	}
});

/**
 * The top border color of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderTopColor = 'none';

/**
 * The right border color of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderRightColor = 'none';

/**
 * The bottom border color of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderBottomColor = 'none';

/**
 * The left border color of the element
 *
 * @type String
 * @default 'none'
**/
elementProto.borderLeftColor = 'none';

Object.defineProperty(elementProto, 'borderColor', {
	/**
	 * The color of the element's border
	 *
	 * @name Element#borderColor
	 * @type String
	 **/
	get: function() {
		return this.borderTopColor + ' ' + this.borderRightColor + ' ' + this.borderBottomColor + ' ' + this.borderLeftColor;
	},
	set: function(borderColor) {
		var pieces = borderColor.split(' ')
		, len = pieces.length;
		
		if (len === 1) {
			this.borderTopColor = pieces[0];
			this.borderRightColor = pieces[0];
			this.borderBottomColor = pieces[0];
			this.borderLeftColor = pieces[0];
		} else if (len === 2) {
			this.borderTopColor = pieces[0];
			this.borderRightColor = pieces[1];
			this.borderBottomColor = pieces[0];
			this.borderLeftColor = pieces[1];
		} else if (len === 3) {
			this.borderTopColor = pieces[0];
			this.borderRightColor = pieces[1];
			this.borderBottomColor = pieces[2];
			this.borderLeftColor = pieces[1];
		} else {
			this.borderTopColor = pieces[0];
			this.borderRightColor = pieces[1];
			this.borderBottomColor = pieces[2];
			this.borderLeftColor = pieces[3];
		}
		
		return this.borderColor;
	}
});

/**
 * Allows the element to be moved using the mouse
 *
 * @type Boolean
 * @default false
**/
elementProto.draggable = false;

/**
 * Registers a "mousemove" event listener on the element
 *
 * @param {String|Function} callback
 * @returns {Element} this
**/
elementProto.mousemove = function(callback) {
	if (isString(callback)) callback = parseMethod(callback);
	if (isFunction(callback)) this.addEventListener('mousemove', callback);
	
	return this;
};

/**
 * Registers a "mouseenter" event listener on the element
 *
 * @param {String|Function} callback
 * @returns {Element} this
**/
elementProto.mouseenter = function(callback) {
	if (isString(callback)) callback = parseMethod(callback);
	if (isFunction(callback)) this.addEventListener('mouseenter', callback);
	
	return this;
};

/**
 * Registers a "mouseleave" event listener on the element
 *
 * @param {String|Function} callback
 * @returns {Element} this
**/
elementProto.mouseleave = function(callback) {
	if (isString(callback)) callback = parseMethod(callback);
	if (isFunction(callback)) this.addEventListener('mouseleave', callback);
	
	return this;
};

/**
 * Registers a "mousedown" event listener on the element
 *
 * @param {String|Function} callback
 * @returns {Element} this
**/
elementProto.mousedown = function(callback) {
	if (isString(callback)) callback = parseMethod(callback);
	if (isFunction(callback)) this.addEventListener('mousedown', callback);
	
	return this;
};

/**
 * Registers a "mouseup" event listener on the element
 *
 * @param {String|Function} callback
 * @returns {Element} this
**/
elementProto.mouseup = function(callback) {
	if (isString(callback)) callback = parseMethod(callback);
	if (isFunction(callback)) this.addEventListener('mouseup', callback);
	
	return this;
};

/**
 * Edits the element
 *
 * @param {Object} source
 * @returns {Element} this
**/
elementProto.edit = function(source) {
	return use(this, source);
};

/**
 * Returns the element's scene or null
 *
 * @returns {?Scene}
 * @todo (?)Check Layer contains Element and Scene contains Layer
**/
elementProto.getScene = function() {
	var layer = this.parentLayer;
	
	return is(layer, Layer) && is(layer.root, Scene) ? layer.root : null;
};

/**
 * Determines if the element is child of a container
 *
 * @param {ContainerElement} container
 * @returns {Boolean}
**/
elementProto.isChildOf = function(container) {
	var current = container;
	
	do {
		if (this.parentElement === current) return true;
		
		current = current.parentElement;
	} while (is(current, ContainerElement));
	
	return false;
};

/**
 * Scales the element
 *
 * @param {int} widthRatio
 * @param {int} heightRatio
 * @returns {Element} this
**/
elementProto.scale = function(widthRatio, heightRatio) {
	this.scaleX = widthRatio;
	this.scaleY = heightRatio;
	
	return this;
};

/**
 * Adds a class to the element's classList
 *
 * @param {String} item
 * @param {int} [orderID]
 * @returns {Element} this
 * @see ClassList#add
**/
elementProto.addClass = function(item, orderID) {
	this.classList.add(item, orderID);
	
	return this;
};

/**
 * Toggles a class
 *
 * @param {String} item
 * @param {int} [orderID]
 * @returns {Element} this
 * @see ClassList#toggle
**/
elementProto.toggleClass = function(item, orderID) {
	this.classList.toggle(item, orderID);
	
	return this;
};

/**
 * Removes a class from the element's classList
 *
 * @param {String} item
 * @returns {Element} this
 * @see OrderedList#remove
**/
elementProto.removeClass = function(item) {
	this.classList.remove(item);
	
	return this;
};

/**
 * Toggles a boolean property of the element
 *
 * @param {String} propertyKey
 * @returns {Element} this
**/
elementProto.toggle = function(propertyKey) {
	if (isBoolean(this[propertyKey])) {
		this[propertyKey] = !this[propertyKey];
	}
	
	return this;
};

/**
 * Applies transformation to the rendering context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {Element} this
**/
elementProto.applyTransform = function(ctx) {
	var r = isNumber(this.angle) ? deg2rad(this.angle % 360) : 0
	, scaleX = isNumber(this.scaleX) ? this.scaleX : 1
	, scaleY = isNumber(this.scaleY) ? this.scaleY : 1
	, tx, ty;
	
	if (this.flipX === true) scaleX *= -1;
	if (this.flipY === true) scaleY *= -1;
	
	if (r !== 0 || scaleX !== 1 || scaleY !== 1) {
		tx = this.screenX + this.renderWidth / 2;
		ty = this.screenY + this.renderHeight / 2;
		
		ctx.translate(tx, ty);
		
		if (r !== 0) ctx.rotate(r);
		if (scaleX !== 1 || scaleY !== 1) ctx.scale(scaleX, scaleY);
		
		ctx.translate(-tx, -ty);
	}
	
	return this;
};

/**
 * Applies a mask to the rendering context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {Element} this
**/
elementProto.applyMask = function(ctx) {
	var mask = $masks.get(this.mask);
	
	if (!isNull(mask)) {
		ctx.beginPath();
		
		mask(ctx, this);
		
		ctx.clip();
	}
	
	return this;
};

/**
 * Draws background and border if necessary
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {Element} this
 * @todo Implement lineDash
**/
elementProto.drawBox = function(ctx) {
	var x = this.screenX
	, y = this.screenY
	, w = this.renderWidth
	, h = this.renderHeight;
	
	if (this.background !== '') {
		ctx.fillStyle = this.background;
		ctx.fillRect(x, y, w, h);
	}
	
	if (this.borderTopWidth > 0) {
		ctx.beginPath();
		ctx.lineWidth = this.borderTopWidth;
		ctx.strokeStyle = this.borderTopColor;
		// ctx.setLineDash();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.stroke();
	}
	
	if (this.borderRightWidth > 0) {
		ctx.beginPath();
		ctx.lineWidth = this.borderRightWidth;
		ctx.strokeStyle = this.borderRightColor;
		// ctx.setLineDash();
		ctx.moveTo(x + w, y);
		ctx.lineTo(x + w, y + h);
		ctx.stroke();
	}
	
	if (this.borderBottomWidth > 0) {
		ctx.beginPath();
		ctx.lineWidth = this.borderBottomWidth;
		ctx.strokeStyle = this.borderBottomColor;
		// ctx.setLineDash();
		ctx.moveTo(x + w, y + h);
		ctx.lineTo(x, y + h);
		ctx.stroke();
	}
	
	if (this.borderLeftWidth > 0) {
		ctx.beginPath();
		ctx.lineWidth = this.borderLeftWidth;
		ctx.strokeStyle = this.borderLeftColor;
		// ctx.setLineDash();
		ctx.moveTo(x, y + h);
		ctx.lineTo(x, y);
		ctx.stroke();
	}
	
	return this;
};

/**
 * Updates the element (move by it's velocity)
 *
 * @returns {Element} this
**/
elementProto.update = function() {
	if (isNumber(this.x) && isNumber(this.vX)) {
		this.x += this.vX;
		
		if (isNumber(this.minX) && isNumber(this.maxX)) {
			if (this.x <= this.minX) this.x = this.maxX;
			else
			if (this.x >= this.maxX) this.x = this.minX;
		}
	}
	
	if (isNumber(this.y) && isNumber(this.vY)) {
		this.y += this.vY;
		
		if (isNumber(this.minY) && isNumber(this.maxY)) {
			if (this.y <= this.minY) this.y = this.maxY;
			else
			if (this.y >= this.maxY) this.y = this.minY;
		}
	}
	
	return this;
};

/**
 * Creates an animation task
 *
 * @param {Object} animData
 * @param {int} duration
 * @param {int} [delay]
 * @returns {Task}
 * @todo Handle colors and non-numeric values
**/
elementProto.animation = function(animData, duration, delay) {
	var initial = getProps(this, keys(animData))
	, fn = function(tick, elapsed) {
		var percent = range(0, 1, elapsed / (duration || 0));
		
		forIn(initial, function(propKey) {
			this[propKey] = initial[propKey] + (animData[propKey] - initial[propKey]) * percent;
		}, this);
		
		return percent === 1;
	};
	
	return new Task(fn, delay, this);
};

/**
 * If the element is in a scene, adds an animation task to the scene's queue
 *
 * @param {Object} animData
 * @param {int} duration
 * @param {int} [delay]
 * @returns {?Task}
**/
elementProto.animate = function(animData, duration, delay) {
	var scene = this.getScene()
	, task = null;
	
	if (is(scene, Scene)) {
		task = this.animation(animData, duration, delay);
		
		scene.queue.add(task, true);
	}
	
	return task;
};

/**
 * Returns a clone of the element
 *
 * @returns {Element}
**/
elementProto.clone = function() {
	var constructor = $elements.getInstantiatable(this.elementName)
	, element = null
	, elementUse, properties;
	
	if (!isNull(constructor)) {
		elementUse = stdClass();
		properties = this.getProps();
		
		forEach(properties, function(prop) {
			if (prop.value !== 'inherit') elementUse[prop.key] = prop.value;
		});
		
		element = new constructor(elementUse);
	}
	
	return element;
};

/**
 * Returns the string value of the element
 *
 * @returns {String}
**/
elementProto.toString = function() {
	return 'Chill Element[' + this.elementType + ']';
};

var elementClass = $classes.fromPrototype(
	elementProto,
	[ // ignored properties
	'elementType', 'elementName',
	'top', 'right', 'bottom', 'left',
	'screenX', 'screenY',
	'parentX', 'parentY',
	'renderWidth', 'renderHeight',
	'onFocus', 'dragState'
	]
);

$elements.addType(elementProto.elementName, Element, false, true);
$classes.set(elementProto.elementType, elementClass);
