/**
 * $canvas namespace
 *
 * @namespace $canvas
 * @description todoc
**/
var $canvas = stdClass();

/**
 * The canvas DOM element
 *
 * @memberof $canvas
 * @type HTMLCanvasElement
**/
$canvas.DOMElement = createElement('canvas');

/**
 * The 2d context of the canvas
 *
 * @memberof $canvas
 * @type CanvasRenderingContext2D
**/
$canvas.ctx = $canvas.DOMElement.getContext('2d');
