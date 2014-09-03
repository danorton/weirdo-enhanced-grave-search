/**
 * This component provides the browser-independent source code that is injected
 * into to the browser tab context.
 *
 * © 2014 Daniel Norton d/b/a WeirdoSoft - {@link http://weirdosoft.com|weirdosoft.com}
 */

goog.provide('weird.Utils');
goog.require('weird');



/**
 * General-purpose utility functions. Singleton usage, only.
 *
 * @constructor
 */
window['weird']['Utils'] = function() {
  /**
   * Our own console object.
   * @type {Object}
   */
  var console;
  if (WEIRD_NOCONSOLE) {
    console = {
      group: function() {},
      groupCollapsed: function() {},
      groupEnd: function() {},
      log: function() {},
      info: function() {},
      warn: function() {},
      error: function() {}
    };
  }
  else {
    var console = {
      log: function() {
        return window.console.log.apply(window.console, arguments); },
      info: function() {
        return window.console.info.apply(window.console, arguments); },
      warn: function() {
        return window.console.warn.apply(window.console, arguments); },
      error: function() {
        return window.console.error.apply(window.console, arguments); }
    };

  }

  /**
   * @return {boolean} Whether or not we're running in the context of a Google
   *     Chrome Extension.
   */
  this.isChromeExtension = function() {
    return window.chrome && chrome.runtime && chrome.runtime.id;
  };

  /**
   * @return {Object} Our console object.
   */
  this.getConsole = function() { return console; };

  /**
   * Parse a URL query string into an object with keys/values.
   *
   * @param {string} queryString URL query string to parse.
   * @param {string=} opt_separator A query parameter separator. e.g. "&" or
   *     ";". Default: "&"
   * @return {boolean} Our console object.
   */
  this.parseQueryParams = function(queryString, opt_separator) {
    var params = {};
    if ((typeof queryString) == 'undefined') queryString = location.search;
    if ((typeof opt_separator) === 'undefined') opt_separator = '&';
    if (queryString.length && queryString[0] == '?') {
      queryString = queryString.slice(1);
    }
    queryString.split(opt_separator).forEach(function(duple) {
      duple = duple.split(/=(.+)?/, 2);
      if (duple[0]) {
        if (duple.length > 1) {
          params[duple[0]] = duple[1];
        }
        else {
          params[duple[0]] = true;
        }
      }
    });

    return params;
  };

  /**
   * Given the SELECT element's option text, get the offset of the OPTION.
   *
   * @param {Object} eSelect SELECT element.
   * @param {string} text Text to search for.
   * @return {number} Offset of the matching OPTION element.
   */
  this.getSelectOffsetByText = function(eSelect, text) {
    var iOffset;
    for (iOffset = 0; iOffset < eSelect.options.length; iOffset++) {
      if (eSelect.options[iOffset].textContent == text) {
        return iOffset;
      }
    }
  };

  /**
   * Get the text of the SELECT element's selected option.
   *
   * @param {Object} eSelect SELECT element.
   * @return {string} Text of selected option.
   */
  this.getSelectSelectedOptionText = function(eSelect) {
    var option = eSelect.options[eSelect.selectedIndex];
    if (option) {
      return option.textContent;
    }
  };

  /**
   * Deep clone a SELECT element with all its options.
   *
   * @param {Object} destSelect New SELECT element.
   * @param {Object} srcSelect  SELECT element to be cloned.
   */
  this.cloneSelectOptions = function(destSelect, srcSelect) {
    destSelect.options.length = 0;
    var clone = srcSelect.cloneNode(true);
    for (var i = 0; clone.options.length; i++) {
      destSelect.options.add(clone.options[0]);
    }
  };

  /**
   * Given the SELECT element's option value, get the offset of the OPTION.
   *
   * @param {Object} eSelect SELECT element.
   * @param {string} value Value to search for.
   * @return {number} Offset of the matching OPTION element. (undefined if not
   *     found)
   */
  this.getSelectedIndexByValue = function(eSelect, value) {
    for (var i = 0; i < eSelect.options.length; i++) {
      if (eSelect.options[i].value == value) return i;
    }
  };

};


/**
 * Our singleton object for the Utils class.
 *
 * @type {Object}
 */
window['weird']['utils'] = new window['weird']['Utils']();
