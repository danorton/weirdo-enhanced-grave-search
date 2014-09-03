/**
 * This component provides code that manages the Chrome Extension icon.
 *
 * © 2014 Daniel Norton d/b/a WeirdoSoft - {@link http://weirdosoft.com|weirdosoft.com}
 */
goog.require('weird');
goog.require('weird.Utils');
goog.provide('weird.enhancedGravesIcon');



/**
 * Manage our Chrome Extension icon. Singleton, only.
 *
 * @param {chrome} chrome Chrome browser object.
 * @param {Object} console Our console object.
 * @constructor
 */
window['weird']['EnhancedGravesIcon'] = function(chrome, console) {

  /**
   * Whether the extension is enabled.
   * @type {boolean}
   */
  var isEnabled;

  /**
   * Select the icon that indicates if the extension is enabled or not.
   *
   * @param {boolean} enabled Whether to select the enabled or disabled icon.
   */
  var setPopupIcon = function(enabled) {
    var tabs, tab, tabId;
    console.log('setPopupIcon: ' + (enabled ? 'ENABLED' : 'DISABLED'));
    tabs = weird['enhancedGravesHooks']['getTabs']();
    console.log('getTabs()', tabs);
    for (tabId in tabs) {
      tabId = Number(tabId);
      if (tabs[tabId].active) {
        if (enabled) {
          console.log('setting EnAbLeD, tab', tabId);
          chrome.pageAction.setIcon({
            tabId: tabId,
            path: {
              '19': '../24px-icon.png',
              '38': '../38px-icon.png'
            }
          });
        }
        else {
          console.log('setting DisAbLeD, tab', tabId);
          chrome.pageAction.setIcon({
            tabId: tabId,
            path: {
              '19': '../24px-icon-disabled.png',
              '38': '../38px-icon-disabled.png'
            }
          });
        }
      }
    }
  };

  /**
   * Update the icon from the state in storage.
   */
  var updateIcon = function() {
    console.log('updateIcon');
    chrome.storage.sync.get({enabled: true}, function(items) {
      console.log('updateIcon get callback: ' +
          (items.enabled ? 'ENABLED' : 'DISABLED'));
      setPopupIcon(items.enabled);
    });
  };

  /**
   * Handle callback for changes of our storage items.
   *
   * @param {Object} changes Description of changes to storage.
   * @param {string} areaName Area of storage that has changed.
   */
  var storageChangeEvent = function(changes, areaName) {
    console.log('storageChangeEvent', changes);
    if (areaName == 'sync' &&
        changes.enabled &&
        (changes.enabled.newValue != isEnabled)) {
      console.log('icon changed:', changes.enabled.newValue);
      isEnabled = changes.enabled.newValue;
      setPopupIcon(isEnabled);
    }
  };

  /** Initialize this singleton. */
  var init = function() {
    console.log('initIcon', document);
    //chrome.runtime.onMessage.addListener(popupMessageEvent);
    chrome.storage.onChanged.addListener(storageChangeEvent);
    updateIcon();
  };

  /**
   *  @param {any} msg
   *  @param {MessageSender} messageSender
   */
  var popupMessageEvent = function(msg, messageSender) {
    //updateIcon();
    console.log('popupMessageEvent', msg, messageSender);
  };

  /** Initialize this singleton. */
  this.init = function() { init(); };
};


/** @type {Object} */
weird['enhancedGravesIcon'] =
    new weird['EnhancedGravesIcon'](
        chrome,
        weird['utils'].getConsole()
    );

