/**
 * This component provides code that runs in the Chrome Extension popup.
 *
 * © 2014 Daniel Norton d/b/a WeirdoSoft - {@link http://weirdosoft.com|weirdosoft.com}
 */
// popup.js
goog.require('weird');
goog.provide('weird.EnhancedGravesPopup');

/**
 * The Chrome Extension popup.
 *
 * @constructor
 */
window['weird']['EnhancedGravesPopup'] = function() {

  /**
   * The default configuration.
   * @const
   */
  var defaultConfig = {
    'enabled': true,
    'defaultCountry': 0 // use website default
  };

  /**
   * Render the enabled state in a checkbox.
   *
   * @param {boolean} enabled Whether we're enabled or not.
   */
  function renderEnabled(enabled) {
    var e = document.getElementById('en_toggle');
    if (enabled) {
      e.checked = true;
    }
    else {
      e.removeAttribute('checked');
    }
  }

  /**
   * Render the default country in the selection element.
   *
   * @param {string} defaultCountry The country name text or zero (0) to leave
   *     the website selection as-is.
   */
  function renderDefaultCountry(defaultCountry) {
    var e = document.getElementById('def_country_select');
    if (!defaultCountry) {
      defaultCountry = 0;
    }
    e.value = defaultCountry;
  }

  /* Initialize this instance. */
  function syncInit() {

    // initialize the form from storage
    chrome.storage.sync.get(defaultConfig, function(items) {
      renderEnabled(items['enabled']);
      renderDefaultCountry(items['defaultCountry']);
    });

    // relay enabled checkbox changes to storage
    document.getElementById('en_toggle').addEventListener(
        'change',
        /** @param {Event} evt */
        function(evt) {
          chrome.storage.sync.set({
            'enabled': document.getElementById('en_toggle').checked
          });
        },
        false
    );

    // relay changes default country selection changes to storage
    document.getElementById('def_country_select').addEventListener(
        'change',
        function(evt) {
          chrome.storage.sync.set({
            'defaultCountry': evt.target.value
          });
        },
        false
    );
  }

  /** Initialize the singleton instance after the DOM has finished loading. */
  function init() {

    // arm dom ready event (or fire it now, if already ready)
    if (document.loaded) {
      syncInit();
    }
    else {
      window.addEventListener(
          'load',
          function() {
            syncInit();
          },
          false
      );
    }
 
  }

  /** Initialize the singleton instance */
  this.init = function() { return init(); };

};

window['weird']['enhancedGravesPopup'] =
    new window['weird']['EnhancedGravesPopup']();
window['weird']['enhancedGravesPopup'].init();
