/**
 * $abstracts namespace
 *
 * @namespace $abstracts
 * @extends Collection
 * @description todoc
**/
var $abstracts = inherit(Collection);

$methods.createAbstractElement = function(elemID, elementType, elementUse, args) {
	$abstracts.set(elemID, new AbstractElement(elementType, elementUse, args));
	
	return this;
};
