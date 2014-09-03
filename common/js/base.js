/**
 * This component provides the browser-independent source code that is injected
 * into to the browser tab context.
 *
 * © 2014 Daniel Norton d/b/a WeirdoSoft - {@link http://weirdosoft.com|weirdosoft.com}
 */

goog.provide('weird');


/** Disable console.log debug output. Default: true
 * @define {boolean} Disable console.log debug output. Default: true
 */
var WEIRD_NOCONSOLE = 0;


/**
 * Base namespace for the Weird library.  Checks to see weird is already defined
 * in the current scope before assigning to prevent clobbering if base.js is
 * loaded more than once.
 *
 * @type {Object}
 */
var weird = window['weird'] || {};
window['weird'] = weird;

