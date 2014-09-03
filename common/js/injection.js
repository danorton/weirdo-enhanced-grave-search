/**
 * This component provides the browser-independent source code that is injected
 * into to the browser tab context.
 *
 * © 2014 Daniel Norton d/b/a WeirdoSoft - {@link http://weirdosoft.com|weirdosoft.com}
 */
goog.require('weird');
goog.provide('weird.EnhancedGravesInjection');
goog.require('weird.Utils');



/**
 * Main browser extension injection code. Singleton usage, only.
 *
 * @constructor
 * @param {weird.Utils} utils Utils library reference.
 */
window['weird']['EnhancedGravesInjection'] = function(utils) {
  /** Our console object */
  var console = utils.getConsole();

  /** Constant for Ireland name text
   * @const
   */
  var IRELAND = 'Ireland';

  /** Constant for USA name text
   * @const
   */
  var USA = 'The United States';

  /** Constant for All countries text
   * @const
   */
  var ALL_COUNTRIES = 'All Countries';

  /** Constant for All countries select offset
   * @const
   */
  var SELECT_ALL_COUNTRIES = 1;

  /** Constant for USA select offset
   * @const
   */
  var SELECT_USA = 3;

  /** Constant for All states select offset
   * @const
   */
  var SELECT_ALL_STATES = 0;

  /** Constant for All U.S. states select offset
   * @const
   */
  var SELECT_ALL_US_STATES = 1;

  /** Constant for no U.S. states select offset
   * @const
   */
  var SELECT_NO_US_STATES = 2;

  /** Constant for first U.S. state select offset
   * @const
   */
  var SELECT_FIRST_USA_STATE = 3;

  /**
   * Invoke method in original website code.
   *
   * @param {string} divId ID of the target DIV element.
   * @param {string} visState Visibility state.
   */
  function toggleVisibility(divId, visState) {
    location.href =
        'javascript:toggleVisibility("' +
        divId + '",' +
        visState +
        '); void 0';
  }

  /**
   * Initial OPTION values for countries with pre-loaded states.
   *
   * @dict
   */
  var stateOptionsInnerHTML = {
    'Ireland': [ // We treat Ireland counties as states
      '<option value="0" selected>All counties</option>',
      '<option value="1204">Carlow</option>',
      '<option value="1205">Cavan</option>',
      '<option value="1206">Clare</option>',
      '<option value="1207">Cork</option>',
      '<option value="1208">Donegal</option>',
      '<option value="1209">Dublin</option>',
      '<option value="1210">Galway</option>',
      '<option value="1211">Kerry</option>',
      '<option value="1212">Kildare</option>',
      '<option value="1213">Kilkenny</option>',
      '<option value="1215">Laois</option>',
      '<option value="1214">Leitrim</option>',
      '<option value="1216">Limerick</option>',
      '<option value="1217">Longford</option>',
      '<option value="1218">Louth</option>',
      '<option value="1219">Mayo</option>',
      '<option value="1220">Meath</option>',
      '<option value="1221">Monaghan</option>',
      '<option value="1222">Offaly</option>',
      '<option value="1223">Roscommon</option>',
      '<option value="1224">Sligo</option>',
      '<option value="1225">Tipperary</option>',
      '<option value="1226">Waterford</option>',
      '<option value="1227">Westmeath</option>',
      '<option value="1228">Wexford</option>',
      '<option value="1229">Wicklow</option>'
    ],
    'Northern Ireland': [ // We treat Northern Ireland counties as states
      '<option value="0" selected>All counties</option>',
      '<option value="4250">Antrim</option>',
      '<option value="4252">Armagh</option>',
      '<option value="4262">Down</option>',
      '<option value="4264">Fermanagh</option>',
      '<option value="4268">Londonderry</option>',
      '<option value="4584">Tyrone</option>'
    ]
  };

  /**
   * References to SELECT objects for countries with pre-loaded states.
   *
   * @dict
   */
  var savedStateOptions = {
    'Ireland': true,
    'Northern Ireland': true,
    'The United States': true
  };

  /**
   * Names of INPUT/SELECT elements for the general search form.
   *
   * @dict
   */
  var fieldNamesGeneralSearch = {
    'country': 'GScntry',
    'state': 'GSst',
    'region': 'GScnty',
    'city': 'GScty',
    'cemetery': 'GScid'
  };

  /**
   * Names of INPUT/SELECT elements for the cemetery search form.
   *
   * @dict
   */
  var fieldNamesCemeterySearch = {
    'country': 'CScntry',
    'state': 'CSst',
    'region': 'CScnty',
    'city': null,
    'cemetery': null
  };

  /**
   * URL query parameters, as a dict.
   *
   * @dict
   */
  var queryParams = utils.parseQueryParams(location.search, '&');

  /** Names of INPUT/SELECT objects for the current form. */
  var fieldNames = null;

  /**
   * Currently selected country.
   * @type {?string}
   */
  var currentCountry = null;

  /** Country SELECT element. */
  var countrySelect = null;

  /** State SELECT element. */
  var stateSelect = null;  // a.k.a. "Irish county"

  /** Region (U.S. County/Parish) SELECT element. */
  var regionSelect = null; // a.k.a. "U.S. county"

  /** City SELECT element. */
  var citySelect = null;

  /** Cemetery SELECT element. */
  var cemeterySelect = null;

  /**
   * Re-load the initial selection, if specified in the URL query.
   *
   * @param {Object} eInput INPUT or SELECT element.
   * @param {string} paramName URL query parameter name.
   */
  function reloadInput(eInput, paramName) {
    if (queryParams[paramName]) {
      console.log('reloadInput', paramName, queryParams[paramName]);
      try {
        if (eInput.tagName == 'SELECT') {
          eInput.selectedIndex =
              utils.getSelectedIndexByValue(
                  eInput,
                  queryParams[paramName]
              );
        }
        else if (eInput.tagName == 'INPUT' && eInput.type == 'text') {
          eInput.value = queryParams[paramName].slice(0, 10);
        }
      }
      catch (e) {
        // ignore
        console.warn("failed reloadInput['" + paramName + "']", e);
      }
    }
  }

  /**
   * Event handler for when the selected country changes.
   *
   * @param {Object=} opt_evt DOM event.
   */
  function onCountrySelectChange(opt_evt) {
    var newCountry = utils.getSelectSelectedOptionText(countrySelect);
    if (newCountry && newCountry[0] == '-') {
      countrySelect.selectedIndex = SELECT_ALL_COUNTRIES;
      onCountrySelectChange();
      return;
    }
    if (newCountry == currentCountry) return; // uninteresting
    console.log('onCountrySelectChange: ' +
        currentCountry + ' => ' + newCountry);

    // update current country
    currentCountry = newCountry;

    // change the state select options
    if (savedStateOptions[newCountry]) {
      loadStateSelectOptions(newCountry);
    }
    else {
      // if loading a country without selectable states, load US states
      loadStateSelectOptions(USA);
    }

    if (currentCountry == ALL_COUNTRIES ||
        savedStateOptions[currentCountry]) {
      // Enable states selection for countries with states
      console.log('ENABLING state selection');
      stateSelect.removeAttribute('disabled');
    }
    else {
      // Disable states selection for other countries
      console.log('DISABLING state selection');
      stateSelect.disabled = true;
    }
    onStateSelectChange(opt_evt);
  }

  /**
   * Event handler for when the selected state changes.
   *
   * @param {Object=} opt_evt DOM event.
   */
  function onStateSelectChange(opt_evt) {
    var selectedIndex = stateSelect.selectedIndex;
    console.log('onStateSelectChange', opt_evt);
    if ((!savedStateOptions[currentCountry]) &&
        stateSelect.selectedIndex >= SELECT_FIRST_USA_STATE) {
      countrySelect.selectedIndex = SELECT_USA;
      onCountrySelectChange();
      stateSelect.selectedIndex = selectedIndex;
      onStateSelectChange();
      return;
    }
    else if (currentCountry == USA &&
        stateSelect.selectedIndex >= SELECT_FIRST_USA_STATE) {
      toggleVisibility('countyDiv', 1);
    }
    else {
      if (currentCountry == USA) {
        // correct an invalid selection for USA
        stateSelect.selectedIndex = SELECT_ALL_US_STATES;
      }
      else if (!savedStateOptions[currentCountry]) {
        // correct an invalid selection for a country w/o selectable states
        if (stateSelect.selectedIndex != SELECT_NO_US_STATES) {
          stateSelect.selectedIndex = SELECT_NO_US_STATES;
        }
      }
      toggleVisibility('countyDiv', 0);
    }
  }

  /**
   * Load the SELECT element for states (i.e. the subdivisions of a country.
   * e.g. Counties for Ireland, Provinces for Canada, &c.)
   *
   * @param {string} countryName Country name text.
   */
  function loadStateSelectOptions(countryName) {
    utils.cloneSelectOptions(
        stateSelect,
        savedStateOptions[countryName]
    );
    // set the default selection
    if (savedStateOptions[currentCountry]) {
      if (currentCountry == USA) {
        stateSelect.selectedIndex = SELECT_ALL_US_STATES;
      }
      else {
        stateSelect.selectedIndex = SELECT_ALL_STATES;
      }
    }
    else {
      stateSelect.selectedIndex = SELECT_NO_US_STATES;
    }
  }

  /**
   * Indicate whether this tab is active or inactive.
   *
   * @param {boolean} isActive Whether to set active or inactive.
   */
  function setTabActive(isActive) {
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(null, isActive ? 'ACTIVE' : 'INACTIVE');
    }
  }

  /**
   * Initialize. Called back after getting config from storage.
   *
   * @param {Object} config Initial configuration.
   */
  function initSync(config) {
    var countryName,
        oldSelect,
        selectedCountry,
        isGeneralSearch,
        deathYearInput,
        deathYearRelInput,
        birthYearInput,
        birthYearRelInput,
        memorialIdInput,
        dateFilterInput,
        orderByInput;

    if (config['enabled']) {
      console.log('extension ENABLED in this tab', config);
    }
    else {
      console.log('extension DISABLED in this tab', config);
      return;
    }

    // get country select & remove hard-coded change event hook, "onchange"
    fieldNames = fieldNamesGeneralSearch;
    oldSelect = document.getElementsByName(fieldNames['country'])[0];
    console.log("fieldNames['country']", fieldNames['country']);
    console.log(document.getElementsByName(fieldNames['country'])[0]);
    console.log(document.getElementsByName('GScntry')[0]);
    console.log(document);
    isGeneralSearch = Boolean(oldSelect);

    if (isGeneralSearch) {
      console.log('general search form');
      console.log('oldSelect', oldSelect);
      deathYearInput = document.getElementsByName('GSdy')[0];
      deathYearRelInput = document.getElementsByName('GSdyrel')[0];
      birthYearInput = document.getElementsByName('GSby')[0];
      birthYearRelInput = document.getElementsByName('GSbyrel')[0];
      memorialIdInput = document.getElementsByName('GSgrid')[0];
      dateFilterInput = document.getElementsByName('df')[0];
      orderByInput = document.getElementsByName('GSob')[0];
    }
    else {
      // Not general search form. Try cemetery search form.
      fieldNames = fieldNamesCemeterySearch;

      oldSelect = document.getElementsByName(fieldNames['country'])[0];
      if (!oldSelect) {
        // The form is not on this page
        console.warn('no supported form');
        setTabActive(false);
        return;
      }
      console.log('cemetery search form');
    }
    setTabActive(true);

    oldSelect.removeAttribute('onchange');
    countrySelect = oldSelect.cloneNode(true);
    oldSelect.parentNode.replaceChild(countrySelect, oldSelect);

    // get state select and remove hard-coded change event hook, "onchange"
    var oldSelect = document.getElementsByName(fieldNames['state'])[0];
    oldSelect.removeAttribute('onchange');
    stateSelect = oldSelect.cloneNode(true);
    oldSelect.parentNode.replaceChild(stateSelect, oldSelect);

    // get region (U.S. county), city and cemetery selects
    regionSelect =
        document.getElementsByName(fieldNames['region'])[0];
    if (fieldNames['city']) {
      citySelect =
          document.getElementsByName(fieldNames['city'])[0];
    }
    if (fieldNames['cemetery']) {
      cemeterySelect =
          document.getElementsByName(fieldNames['cemetery'])[0];
    }

    // initialize state select options
    for (countryName in savedStateOptions) {
      if (countryName == USA) {
        savedStateOptions[USA] = stateSelect.cloneNode(true);
      }
      else {
        savedStateOptions[countryName] =
            document.createElement('select');
        savedStateOptions[countryName].innerHTML =
            stateOptionsInnerHTML[countryName].join();
        delete stateOptionsInnerHTML[countryName];
      }
    }

    // watch for country change
    countrySelect.addEventListener(
        'change',
        function(evt) {
          return onCountrySelectChange(evt);
        },
        false);

    // watch for state (Irish county) change
    stateSelect.addEventListener(
        'change',
        function(evt) {
          return onStateSelectChange(evt);
        },
        false);

    // If no country specified, select default
    if (config['defaultCountry'] &&
        !queryParams[fieldNames['country']]) {
      console.log('Selecting ' + config['defaultCountry']);
      countrySelect.value = config['defaultCountry'];
    }
    else if (!isGeneralSearch) {
      reloadInput(countrySelect, fieldNames['country']);
    }
    // trigger country change event
    onCountrySelectChange();

    // re-select subordinate selections if overlaid
    selectedCountry = utils.getSelectSelectedOptionText(countrySelect);
    if (//selectedCountry != USA &&
        savedStateOptions[selectedCountry]) {
      reloadInput(stateSelect, fieldNames['state']);
      if (isGeneralSearch) {
        reloadInput(regionSelect, fieldNames['region']);
        reloadInput(citySelect, fieldNames['city']);
      }
      else {
        reloadInput(
            cemeterySelect,
            fieldNames['cemetery']
        );
      }
    }

    // Other field selections are broken at FindAGrave. Fix them.
    if (isGeneralSearch) {
      reloadInput(deathYearInput, 'GSdy');
      reloadInput(deathYearRelInput, 'GSdyrel');
      reloadInput(birthYearInput, 'GSby');
      reloadInput(birthYearRelInput, 'GSbyrel');
      reloadInput(memorialIdInput, 'GRid');
      reloadInput(dateFilterInput, 'df');
      reloadInput(orderByInput, 'GSob');
    }

  }

  /**
   * Initialize singleton instance. Get configuration from storage and invoke
   * initSync().
   */
  function init() {
    if (window.chrome && chrome.storage) {
      chrome.storage.sync.get(
          {
            'enabled': true,
            'defaultCountry': 0
          },
          function(items) {
            initSync(items);
          }
      );
    }
  }

  /** Initialize instance */
  this.init = function() { init(); };

};


window['weird']['enhancedGravesInjection'] =
    new window['weird']['EnhancedGravesInjection'](window['weird']['utils']);
window['weird']['enhancedGravesInjection'].init();

