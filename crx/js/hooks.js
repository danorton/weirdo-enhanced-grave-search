/**
 * This component provides code that runs in the Chrome Extension background
 * environment.
 *
 * © 2014 Daniel Norton d/b/a WeirdoSoft - {@link http://weirdosoft.com|weirdosoft.com}
 */
goog.require('weird');
goog.provide('weird.EnhancedGravesHooks');
goog.require('weird.Utils');
goog.require('weird.enhancedGravesIcon');



/**
 * Code that runs in the Chrome Extension background environment. Singleton,
 * only.
 *
 * @constructor
 * @param {Object} console Our console object.
 */
weird['EnhancedGravesHooks'] = function(console) {
  /** The list of tabs where our extension is loaded. */
  var ourTabs = {};

  /**
   * Get the list of tabs where our extension is loaded.
   *
   * @return {Object} List of tabs where our extension is loaded, keyed by
   *     tab ID.
   */
  function getTabs() {
    return ourTabs;
  }

  /**
   * Mark the specified tag as active.
   *
   * @param {number} tabId Tab ID.
   * @return {Object} List of active tabs.
   */
  function setTabActive(tabId) {
    console.log('setTabActive:', tabId);
    if (!ourTabs[tabId]) {
      ourTabs[tabId] = { active: true };
    }
    else {
      ourTabs[tabId].active = true;
    }
    return ourTabs[tabId];
  }

  /**
   * Mark the specified tag as inactive.
   *
   * @param {number} tabId Tab ID.
   * @return {Object} List of active tabs.
   */
  function setTabInactive(tabId) {
    console.log('setTabInactive:', tabId);
    if (!ourTabs[tabId]) {
      ourTabs[tabId] = { active: false };
    }
    else {
      ourTabs[tabId].active = false;
    }
    return ourTabs[tabId];
  }

  /**
   * Add the specified tag and mark it active.
   *
   * @param {number} tabId Tab ID.
   * @return {Object} List of active tabs.
   */
  function addTab(tabId) {
    console.log('addTab:', tabId);
    if (!ourTabs[tabId]) {
      ourTabs[tabId] = { active: true };
    }
    return ourTabs[tabId];
  }

  /**
   * Receive notification to inject code into the current tab.
   *
   * @param {number} tabId Tab ID.
   * @param {ChangeInfo} changeInfo
   * @param {Tab} tab
   */
  function onUpdatedEvent(tabId, changeInfo, tab) {
    if (changeInfo.status == 'loading') {
      chrome.tabs.executeScript(tabId, {
        file: 'injection.js'
        //runAt: 'document_idle'
      },
      function(ar) {
        if ((!chrome.runtime.lastError) && ar) {
          if (addTab(tabId).active) {
            chrome.pageAction.show(tabId);
            weird['enhancedGravesIcon'].init();
          }
          else {
            chrome.pageAction.hide(tabId);
          }
        }
      });
    }
  }

  /**
   * Receive notification to remove the specified tab from our list.
   *
   * @param {number} tabId Tab ID.
   * @param {RemoveInfo} removeInfo
   */
  function onRemovedEvent(tabId, removeInfo) {
    if (ourTabs[tabId]) {
      console.log('onRemovedEvent', tabId);
      delete ourTabs[tabId];
    }
  }

  /**
   * Handle messages that tell us to enable or disable our extension in a tab.
   *
   * @param {?Object|string} message The message.
   * @param {?Object} sender Information about the tab sending the message.
   * @param {function=} opt_sendResponse Callback function to send a response.
   */
  function onMessageEvent(message, sender, opt_sendResponse) {
    console.log('onMessageEvent', message, sender);
    if (message === 'INACTIVE') {
      setTabInactive(sender.tab.id);
      chrome.pageAction.hide(sender.tab.id);
    }
    else if (message === 'ACTIVE') {
      setTabActive(sender.tab.id);
      chrome.pageAction.show(sender.tab.id);
    }
  }

  /**
   * Initialize this singleton instance.
   */
  function init() {
    chrome.tabs.onUpdated.addListener(onUpdatedEvent);
    chrome.tabs.onRemoved.addListener(onRemovedEvent);
    chrome.runtime.onMessage.addListener(onMessageEvent);
  }

  /**
   * Initialize this singleton instance.
   */
  this.init = function() { init(); };

  /**
   * Get the list of tabs where our extension is loaded.
   *
   * @return {Object} List of tabs where our extension is loaded, keyed by
   *     tab ID.
   */
  this.getTabs = function() { return getTabs(); };
  this['getTabs'] = function() { return getTabs(); };

};

weird['enhancedGravesHooks'] =
    new weird['EnhancedGravesHooks'](weird['utils'].getConsole());
weird['enhancedGravesHooks'].init();

