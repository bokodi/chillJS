## chillJS ##

#### JavaScript 2D library ####


chillJS is a 2D HTML5 canvas library, designed to write graphical applications easily and fast.


##### quickstart #####
<a href="http://bokodi.github.io/chillJS/tutorials" target="_blank">Get started with chillJS</a> or <a href="http://bokodi.github.io/chillJS/examples/" target="_blank">check out some of the examples</a>. For more information <a href="http://bokodi.github.io/chillJS/docs/" target="_blank">see the documentation</a>.

##### usage #####
Download the required source files: `chill.min.js`, `chill.css` and include them in your html.

##### build #####
Build requires <a href="https://nodejs.org/" target="_blank">Node.js</a> and <a href="http://gulpjs.com/" target="_blank">Gulp</a>.

```
gulp build
```

##### documentation #####
chillJS uses <a href="http://usejsdoc.org/" target="_blank">JSDoc 3</a> to generate the documentation:

```
jsdoc chill.js -d "./docs" -t ./builder/jsdoc-template --readme "./README.md"
```


##### dependencies #####
- <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame" target="_blank">requestAnimationFrame</a>
- <a href="http://kangax.github.io/compat-table/es5/" target="_blank">EcmaScript 5</a>

##### status #####
chillJS is not production ready.

##### contributing #####
Contributions are welcome.

##### license #####
<a href="http://opensource.org/licenses/MIT" target="_blank">MIT License</a>
