/**
 * Creates a new ContainerElement
 *
 * @class ContainerElement
 * @extends Element
 * @param {String} id
 * @param {Object} [elementUse]
 * @description todoc
**/
function ContainerElement(id, elementUse) {
	Element.call(this);
	privateContainerElement.call(this);
	
	this.id = String(id);
	
	this.classList.add(containerElementProto.elementType, 1);
	
	this.edit(elementUse);
}

/** @lends ContainerElement# **/
var containerElementProto = ContainerElement.prototype = Object.create(Element.prototype);
containerElementProto.constructor = ContainerElement;

function privateContainerElement() {
	var _elements = new OrderedList();
	
	/**
	 * Adds an element to the ContainerElement
	 *
	 * @alias ContainerElement#add
	 * @param {Element} element
	 * @param {int} [orderID]
	 * @returns {ContainerElement} this
	**/
	this.add = function(element, orderID) {
		_elements.add(element, orderID);
		
		return this;
	};
	
	/**
	 * Adds an element to the ContainerElement exactly before the given reference element
	 *
	 * @alias ContainerElement#addBefore
	 * @param {Element} element
	 * @param {Element} reference
	 * @returns {ContainerElement} this
	**/
	this.addBefore = function(element, reference) {
		_elements.addBefore(element, reference);
		
		return this;
	};
	
	/**
	 * Adds an element to the ContainerElement exactly after the given reference element
	 *
	 * @alias ContainerElement#addAfter
	 * @param {Element} element
	 * @param {Element} reference
	 * @returns {ContainerElement} this
	**/
	this.addAfter = function(element, reference) {
		_elements.addAfter(element, reference);
		
		return this;
	};
	
	/**
	 * Checks if the ContainerElement contains a specific element
	 *
	 * @alias ContainerElement#has
	 * @param {Element} searchElement
	 * @returns {Boolean}
	**/
	this.has = function(searchElement) {
		return _elements.has(searchElement);
	};
	
	/**
	 * Removes an element from the ContainerElement
	 *
	 * @alias ContainerElement#remove
	 * @param {Element} element
	 * @returns {?Element} removed
	**/
	this.remove = function(element) {
		return _elements.remove(element);
	};
	
	/**
	 * Returns the number of elements in the ContainerElement
	 *
	 * @alias ContainerElement#count
	 * @param {Boolean} ifRecursive
	 * @returns {int}
	**/
	this.count = function(ifRecursive) {
		var count = _elements.count;
		
		if (ifRecursive === true) {
			this.each(function(element) {
				if (is(element, ContainerElement)) count += element.count;
			});
		}
		
		return count;
	};
	
	/**
	 * Returns an array of all the elements in the ContainerElement
	 *
	 * @alias ContainerElement#getElements
	 * @returns {Array}
	**/
	this.getElements = function() {
		return _elements.all();
	};
	
	/**
	 * Returns the first element
	 *
	 * @alias ContainerElement#first
	 * @returns {?Element}
	**/
	this.first = function() {
		return _elements.first();
	};
	
	/**
	 * Returns the last element
	 *
	 * @alias ContainerElement#last
	 * @returns {?Element}
	**/
	this.last = function() {
		return _elements.last();
	};
	
	/**
	 * Executes a provided callback function once per element in ascending order
	 *
	 * @alias ContainerElement#each
	 * @param {Function} callback
	 * @param {*} [thisArg]
	 * @param {Boolean} [ifRecursive]
	 * @returns {ContainerElement} this
	**/
	this.each = function(callback, thisArg, ifRecursive) {
		_elements.each(function(element) {
			callback.call(thisArg, element);
			
			if (ifRecursive !== false && is(element, ContainerElement)) {
				element.each(callback, thisArg);
			}
		});
		
		return this;
	};
	
	return this;
}

/**
 * The type of the element
 *
 * @type String
 * @default 'ContainerElement'
 * @readonly
**/
containerElementProto.elementType = 'ContainerElement';

/**
 * The name of the element
 *
 * @type String
 * @default 'Container'
 * @readonly
**/
containerElementProto.elementName = 'Container';

/**
 * Draws the container background to the given context
 *
 * @param {CanvasRenderingContext2D} ctx
 * @returns {ContainerElement} this
**/
containerElementProto.draw = function(ctx) {
	var bg = this.background;
	
	if (isString(bg) && bg.length > 0) {
		ctx.beginPath();
		ctx.fillStyle = bg;
		ctx.fillRect(this.screenX, this.screenY, this.renderWidth, this.renderHeight);
	}
	
	return this;
};

var containerElementClass = stdClass();
containerElementClass.width = 'fit';
containerElementClass.height = 'fit';

$elements.addType(containerElementProto.elementName, ContainerElement, true, true);
$classes.set(containerElementProto.elementType, containerElementClass);
