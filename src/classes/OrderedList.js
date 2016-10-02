/**
 * Creates a new OrderedList
 *
 * @class OrderedList
 * @description todoc
**/
function OrderedList() {
	var list = Object.create(null)
	, isDirty = true;
	
	/**
	 * The number of items in the OrderedList
	 *
	 * @alias OrderedList#count
	 * @type int
	 * @readonly
	**/
	this.count = 0;
	
	/**
	 * Adds an item to the OrderedList
	 *
	 * @alias OrderedList#add
	 * @param {*} item
	 * @param {int} [orderID]
	 * @returns {OrderedList} this
	**/
	this.add = function(item, orderID) {
		if (!(typeof orderID === 'number' && orderID === orderID | 0 && isFinite(orderID))) {
			orderID = this.lastID() || 0;
		}
		
		if (list[orderID] === undefined) {
			list[orderID] = [];
			isDirty = true;
		}
		
		list[orderID].push(item);
		
		++this.count;
		
		return this;
	};
	
	/**
	 * Adds an item to the OrderedList exactly before the given reference item
	 *
	 * @alias OrderedList#addBefore
	 * @param {*} item
	 * @param {*} reference
	 * @returns {OrderedList} this
	**/
	this.addBefore = function(item, reference) {
		var orderID = this.getOrderOf(reference)
		, index;
		
		if (orderID !== null) {
			index = list[orderID].indexOf(reference);
			
			if (index !== -1) {
				list[orderID].splice(index, 0, item);
				
				++this.count;
			}
		}
		
		return this;
	};
	
	/**
	 * Adds an item to the OrderedList exactly after the given reference item
	 *
	 * @alias OrderedList#addAfter
	 * @param {*} item
	 * @param {*} reference
	 * @returns {OrderedList} this
	**/
	this.addAfter = function(item, reference) {
		var orderID = this.getOrderOf(reference)
		, index;
		
		if (orderID !== null) {
			index = list[orderID].indexOf(reference);
			
			if (index !== -1) {
				list[orderID].splice(index + 1, 0, item);
				
				++this.count;
			}
		}
		
		return this;
	};
	
	/**
	 * Removes an item from the OrderedList
	 *
	 * @alias OrderedList#remove
	 * @param {*} item
	 * @returns {?*} removed
	**/
	this.remove = function(item) {
		var orderID = this.getOrderOf(item)
		, removed = null
		, index;
		
		if (orderID !== null) {
			index = list[orderID].indexOf(item);
			
			if (index !== -1) {
				removed = list[orderID].splice(index, 1)[0];
				
				--this.count;
			}
		}
		
		return removed;
	};
	
	/**
	 * Checks if the OrderedList contains a specific item
	 *
	 * @alias OrderedList#has
	 * @param {*} item
	 * @returns {Boolean}
	**/
	this.has = function(item) {
		return this.getOrderOf(item) !== null;
	};
	
	/**
	 * Changes the place of the given item to the given order
	 *
	 * @alias OrderedList#reOrder
	 * @param {*} item
	 * @param {int} orderID
	 * @returns {OrderedList} this
	**/
	this.reOrder = function(item, orderID) {
		return this.remove(item).add(item, orderID);
	};
	
	/**
	 * Removes all items from the OrderedList
	 *
	 * @alias OrderedList#clear
	 * @returns {OrderedList} this
	**/
	this.clear = function() {
		this.order = {};
		
		this.count = 0;
		isDirty = true;
		
		return this;
	};
	
	/**
	 * Executes a provided callback function once per item in ascending order
	 *
	 * @alias OrderedList#each
	 * @param {Function} callback
	 * @param {*} [thisArg]
	 * @returns {OrderedList} this
	**/
	this.each = function(callback, thisArg) {
		var i = 0;
		
		this.getOrders().forEach(function(orderID) {
			list[orderID].forEach(function(item) {
				callback.call(thisArg, item, i++);
			});
		});
		
		return this;
	};
	
	/**
	 * Executes a provided callback function once per item in descending, stops when the callback's return value is not undefined and returns
	 *
	 * @alias OrderedList#execute
	 * @param {Function} callback
	 * @param {*} [thisArg]
	 * @returns {?*}
	**/
	this.execute = function(callback, thisArg) {
		var order = this.getOrders()
		, i = 0
		, j = order.length - 1
		, k, items, returnValue;
		
		for (; j >= 0; --j) {
			items = list[order[j]];
			k = items.length - 1;
			
			for (; k >= 0; --k) {
				returnValue = callback.call(thisArg, items[k], i++);
				
				if (returnValue !== undefined) return returnValue;
			}
		}
		
		return null;
	};
	
	/**
	 * Returns the lowest orderID of the OrderedList
	 *
	 * @alias OrderedList#firstID
	 * @returns {?int}
	**/
	this.firstID = function() {
		var id = this.getOrders()[0];
		
		return id === undefined ? null : id;
	};
	
	/**
	 * Returns the highest orderID of the OrderedList
	 *
	 * @alias OrderedList#lastID
	 * @returns {?int}
	**/
	this.lastID = function() {
		var id = this.getOrders().slice(-1)[0];
		
		return id === undefined ? null : id;
	};
	
	/**
	 * Returns the first element of the lowest orderID
	 *
	 * @alias OrderedList#first
	 * @returns {?*}
	**/
	this.first = function() {
		var items = list[this.firstID()];
		
		return items !== undefined && items.length > 0 ? items[0] : null;
	};
	
	/**
	 * Returns the last element of the highest orderID
	 *
	 * @alias OrderedList#last
	 * @returns {?*}
	**/
	this.last = function() {
		var items = list[this.lastID()];
		
		return items !== undefined && items.length > 0 ? items.slice(-1)[0] : null;
	};
	
	/**
	 * Returns an array of all the orderIDs in ascending order
	 *
	 * @method
	 * @name OrderedList#getOrders
	 * @returns {Array}
	**/
	this.getOrders = (function() {
		var cache = null;
		
		function sortFn(a, b) {
			return a - b;
		}
		
		return function getOrders() {
			if (isDirty) {
				cache = Object.keys(list).sort(sortFn);
				isDirty = false;
			}
			
			return cache;
		};
	}());
	
	/**
	 * Returns an array of all the items
	 *
	 * @alias OrderedList#all
	 * @returns {Array}
	**/
	this.all = function() {
		var items = [];
		
		this.each(function(item) {
			items.push(item);
		});
		
		return items;
	};
	
	/**
	 * Returns the orderID of the given item
	 *
	 * @alias OrderedList#getOrderOf
	 * @param {*} item
	 * @returns {?int}
	**/
	this.getOrderOf = function(item) {
		var returnValue = null,
			hasOwn = Object.prototype.hasOwnProperty,
			orderID;
		
		for (orderID in list) {
			if (hasOwn.call(list, orderID)) {
				if (list[orderID].indexOf(item) !== -1) {
					returnValue = orderID;
					
					break;
				}
			}
		}
		
		return returnValue;
	};
}

/** @lends OrderedList# **/
var orderedListProto = OrderedList.prototype = Object.create(null);
orderedListProto.constructor = OrderedList;

/**
 * Returns the string value of the orderedList
 *
 * @returns {String}
**/
orderedListProto.toString = function() {
	return '[object OrderedList]';
};
