/*!
 * SyntaxHighlighter
 * https://github.com/syntaxhighlighter/syntaxhighlighter
 * 
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 * 
 * @version
 * 4.0.1 (Thu, 01 Mar 2018 15:43:03 GMT)
 * 
 * @copyright
 * Copyright (C) 2004-2016 Alex Gorbatchev.
 * 
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _core = __webpack_require__(1);
	
	Object.keys(_core).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _core[key];
	    }
	  });
	});
	
	var _domready = __webpack_require__(60);
	
	var _domready2 = _interopRequireDefault(_domready);
	
	var _core2 = _interopRequireDefault(_core);
	
	var _dasherize = __webpack_require__(61);
	
	var dasherize = _interopRequireWildcard(_dasherize);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// configured through the `--compat` parameter.
	if (true) {
	  __webpack_require__(62);
	}
	
	(0, _domready2.default)(function () {
	  return _core2.default.highlight(dasherize.object(window.syntaxhighlighterConfig || {}));
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var optsParser = __webpack_require__(2),
	    match = __webpack_require__(5),
	    Renderer = __webpack_require__(9).default,
	    utils = __webpack_require__(10),
	    transformers = __webpack_require__(11),
	    dom = __webpack_require__(17),
	    config = __webpack_require__(18),
	    defaults = __webpack_require__(19),
	    HtmlScript = __webpack_require__(20);
	
	var sh = {
	  Match: match.Match,
	  Highlighter: __webpack_require__(22),
	
	  config: __webpack_require__(18),
	  regexLib: __webpack_require__(3).commonRegExp,
	
	  /** Internal 'global' variables. */
	  vars: {
	    discoveredBrushes: null,
	    highlighters: {}
	  },
	
	  /** This object is populated by user included external brush files. */
	  brushes: {},
	
	  /**
	   * Finds all elements on the page which should be processes by SyntaxHighlighter.
	   *
	   * @param {Object} globalParams   Optional parameters which override element's
	   *                  parameters. Only used if element is specified.
	   *
	   * @param {Object} element  Optional element to highlight. If none is
	   *              provided, all elements in the current document
	   *              are returned which qualify.
	   *
	   * @return {Array}  Returns list of <code>{ target: DOMElement, params: Object }</code> objects.
	   */
	  findElements: function findElements(globalParams, element) {
	    var elements = element ? [element] : utils.toArray(document.getElementsByTagName(sh.config.tagName)),
	        conf = sh.config,
	        result = [];
	
	    // support for <SCRIPT TYPE="syntaxhighlighter" /> feature
	    elements = elements.concat(dom.getSyntaxHighlighterScriptTags());
	
	    if (elements.length === 0) return result;
	
	    for (var i = 0, l = elements.length; i < l; i++) {
	      var item = {
	        target: elements[i],
	        // local params take precedence over globals
	        params: optsParser.defaults(optsParser.parse(elements[i].className), globalParams)
	      };
	
	      if (item.params['brush'] == null) continue;
	
	      result.push(item);
	    }
	
	    return result;
	  },
	
	  /**
	   * Shorthand to highlight all elements on the page that are marked as
	   * SyntaxHighlighter source code.
	   *
	   * @param {Object} globalParams   Optional parameters which override element's
	   *                  parameters. Only used if element is specified.
	   *
	   * @param {Object} element  Optional element to highlight. If none is
	   *              provided, all elements in the current document
	   *              are highlighted.
	   */
	  highlight: function highlight(globalParams, element) {
	    var elements = sh.findElements(globalParams, element),
	        propertyName = 'innerHTML',
	        brush = null,
	        renderer,
	        conf = sh.config;
	
	    if (elements.length === 0) return;
	
	    for (var i = 0, l = elements.length; i < l; i++) {
	      var element = elements[i],
	          target = element.target,
	          params = element.params,
	          brushName = params.brush,
	          brush,
	          matches,
	          code;
	
	      if (brushName == null) continue;
	
	      brush = findBrush(brushName);
	
	      if (!brush) continue;
	
	      // local params take precedence over defaults
	      params = optsParser.defaults(params || {}, defaults);
	      params = optsParser.defaults(params, config);
	
	      // Instantiate a brush
	      if (params['html-script'] == true || defaults['html-script'] == true) {
	        brush = new HtmlScript(findBrush('xml'), brush);
	        brushName = 'htmlscript';
	      } else {
	        brush = new brush();
	      }
	
	      code = target[propertyName];
	
	      // remove CDATA from <SCRIPT/> tags if it's present
	      if (conf.useScriptTags) code = stripCData(code);
	
	      // Inject title if the attribute is present
	      if ((target.title || '') != '') params.title = target.title;
	
	      params['brush'] = brushName;
	
	      code = transformers(code, params);
	      matches = match.applyRegexList(code, brush.regexList, params);
	      renderer = new Renderer(code, matches, params);
	
	      element = dom.create('div');
	      element.innerHTML = renderer.getHtml();
	
	      // id = utils.guid();
	      // element.id = highlighters.id(id);
	      // highlighters.set(id, element);
	
	      if (params.quickCode) dom.attachEvent(dom.findElement(element, '.code'), 'dblclick', dom.quickCodeHandler);
	
	      // carry over ID
	      if ((target.id || '') != '') element.id = target.id;
	
	      target.parentNode.replaceChild(element, target);
	    }
	  }
	}; // end of sh
	
	/**
	 * Displays an alert.
	 * @param {String} str String to display.
	 */
	function alert(str) {
	  window.alert('SyntaxHighlighter\n\n' + str);
	};
	
	/**
	 * Finds a brush by its alias.
	 *
	 * @param {String} alias    Brush alias.
	 * @param {Boolean} showAlert Suppresses the alert if false.
	 * @return {Brush}        Returns bursh constructor if found, null otherwise.
	 */
	function findBrush(alias, showAlert) {
	  var brushes = sh.vars.discoveredBrushes,
	      result = null;
	
	  if (brushes == null) {
	    brushes = {};
	
	    // Find all brushes
	    for (var brushName in sh.brushes) {
	      var brush = sh.brushes[brushName],
	          aliases = brush.aliases;
	
	      if (aliases == null) {
	        continue;
	      }
	
	      brush.className = brush.className || brush.aliases[0];
	      brush.brushName = brush.className || brushName.toLowerCase();
	
	      for (var i = 0, l = aliases.length; i < l; i++) {
	        brushes[aliases[i]] = brushName;
	      }
	    }
	
	    sh.vars.discoveredBrushes = brushes;
	  }
	
	  result = sh.brushes[brushes[alias]];
	
	  if (result == null && showAlert) alert(sh.config.strings.noBrush + alias);
	
	  return result;
	};
	
	/**
	 * Strips <![CDATA[]]> from <SCRIPT /> content because it should be used
	 * there in most cases for XHTML compliance.
	 * @param {String} original Input code.
	 * @return {String} Returns code without leading <![CDATA[]]> tags.
	 */
	function stripCData(original) {
	  var left = '<![CDATA[',
	      right = ']]>',
	
	  // for some reason IE inserts some leading blanks here
	  copy = utils.trim(original),
	      changed = false,
	      leftLength = left.length,
	      rightLength = right.length;
	
	  if (copy.indexOf(left) == 0) {
	    copy = copy.substring(leftLength);
	    changed = true;
	  }
	
	  var copyLength = copy.length;
	
	  if (copy.indexOf(right) == copyLength - rightLength) {
	    copy = copy.substring(0, copyLength - rightLength);
	    changed = true;
	  }
	
	  return changed ? copy : original;
	};
	
	var brushCounter = 0;
	
	exports.default = sh;
	var registerBrush = exports.registerBrush = function registerBrush(brush) {
	  return sh.brushes['brush' + brushCounter++] = brush.default || brush;
	};
	var clearRegisteredBrushes = exports.clearRegisteredBrushes = function clearRegisteredBrushes() {
	  sh.brushes = {};
	  brushCounter = 0;
	};
	
	/* an EJS hook for `gulp build --brushes` command
	 * */
	
	registerBrush(__webpack_require__(23));
	
	registerBrush(__webpack_require__(24));
	
	registerBrush(__webpack_require__(22));
	
	registerBrush(__webpack_require__(25));
	
	registerBrush(__webpack_require__(26));
	
	registerBrush(__webpack_require__(27));
	
	registerBrush(__webpack_require__(28));
	
	registerBrush(__webpack_require__(29));
	
	registerBrush(__webpack_require__(30));
	
	registerBrush(__webpack_require__(31));
	
	registerBrush(__webpack_require__(32));
	
	registerBrush(__webpack_require__(33));
	
	registerBrush(__webpack_require__(34));
	
	registerBrush(__webpack_require__(35));
	
	registerBrush(__webpack_require__(36));
	
	registerBrush(__webpack_require__(37));
	
	registerBrush(__webpack_require__(38));
	
	registerBrush(__webpack_require__(39));
	
	registerBrush(__webpack_require__(40));
	
	registerBrush(__webpack_require__(41));
	
	registerBrush(__webpack_require__(42));
	
	registerBrush(__webpack_require__(43));
	
	registerBrush(__webpack_require__(44));
	
	registerBrush(__webpack_require__(45));
	
	registerBrush(__webpack_require__(46));
	
	registerBrush(__webpack_require__(47));
	
	registerBrush(__webpack_require__(48));
	
	registerBrush(__webpack_require__(49));
	
	registerBrush(__webpack_require__(50));
	
	registerBrush(__webpack_require__(51));
	
	registerBrush(__webpack_require__(52));
	
	registerBrush(__webpack_require__(53));
	
	registerBrush(__webpack_require__(54));
	
	registerBrush(__webpack_require__(55));
	
	registerBrush(__webpack_require__(56));
	
	registerBrush(__webpack_require__(57));
	
	registerBrush(__webpack_require__(58));
	
	registerBrush(__webpack_require__(59));
	
	registerBrush(__webpack_require__(63)); // rust
	
	/*
	
	 */

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var XRegExp = __webpack_require__(3).XRegExp;
	
	var BOOLEANS = { 'true': true, 'false': false };
	
	function camelize(key) {
	  return key.replace(/-(\w+)/g, function (match, word) {
	    return word.charAt(0).toUpperCase() + word.substr(1);
	  });
	}
	
	function process(value) {
	  var result = BOOLEANS[value];
	  return result == null ? value : result;
	}
	
	module.exports = {
	  defaults: function defaults(target, source) {
	    for (var key in source || {}) {
	      if (!target.hasOwnProperty(key)) target[key] = target[camelize(key)] = source[key];
	    }return target;
	  },
	
	  parse: function parse(str) {
	    var match,
	        key,
	        result = {},
	        arrayRegex = XRegExp("^\\[(?<values>(.*?))\\]$"),
	        pos = 0,
	        regex = XRegExp("(?<name>[\\w-]+)" + "\\s*:\\s*" + "(?<value>" + "[\\w%#-]+|" + // word
	    "\\[.*?\\]|" + // [] array
	    '".*?"|' + // "" string
	    "'.*?'" + // '' string
	    ")\\s*;?", "g");
	
	    while ((match = XRegExp.exec(str, regex, pos)) != null) {
	      var value = match.value.replace(/^['"]|['"]$/g, '') // strip quotes from end of strings
	      ;
	
	      // try to parse array value
	      if (value != null && arrayRegex.test(value)) {
	        var m = XRegExp.exec(value, arrayRegex);
	        value = m.values.length > 0 ? m.values.split(/\s*,\s*/) : [];
	      }
	
	      value = process(value);
	      result[match.name] = result[camelize(match.name)] = value;
	      pos = match.index + match[0].length;
	    }
	
	    return result;
	  }
	};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.commonRegExp = exports.XRegExp = undefined;
	
	var _xregexp = __webpack_require__(4);
	
	var _xregexp2 = _interopRequireDefault(_xregexp);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.XRegExp = _xregexp2.default;
	var commonRegExp = exports.commonRegExp = {
	  multiLineCComments: (0, _xregexp2.default)('/\\*.*?\\*/', 'gs'),
	  singleLineCComments: /\/\/.*$/gm,
	  singleLinePerlComments: /#.*$/gm,
	  doubleQuotedString: /"([^\\"\n]|\\.)*"/g,
	  singleQuotedString: /'([^\\'\n]|\\.)*'/g,
	  multiLineDoubleQuotedString: (0, _xregexp2.default)('"([^\\\\"]|\\\\.)*"', 'gs'),
	  multiLineSingleQuotedString: (0, _xregexp2.default)("'([^\\\\']|\\\\.)*'", 'gs'),
	  xmlComments: (0, _xregexp2.default)('(&lt;|<)!--.*?--(&gt;|>)', 'gs'),
	  url: /\w+:\/\/[\w-.\/?%&=:@;#]*/g,
	  phpScriptTags: { left: /(&lt;|<)\?(?:=|php)?/g, right: /\?(&gt;|>)/g, 'eof': true },
	  aspScriptTags: { left: /(&lt;|<)%=?/g, right: /%(&gt;|>)/g },
	  scriptScriptTags: { left: /(&lt;|<)\s*script.*?(&gt;|>)/gi, right: /(&lt;|<)\/\s*script\s*(&gt;|>)/gi }
	};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/*!
	 * XRegExp 3.1.0-dev
	 * <xregexp.com>
	 * Steven Levithan (c) 2007-2015 MIT License
	 */
	
	/**
	 * XRegExp provides augmented, extensible regular expressions. You get additional regex syntax and
	 * flags, beyond what browsers support natively. XRegExp is also a regex utility belt with tools to
	 * make your client-side grepping simpler and more powerful, while freeing you from related
	 * cross-browser inconsistencies.
	 */
	
	'use strict';
	
	/* ==============================
	 * Private variables
	 * ============================== */
	
	// Property name used for extended regex instance data
	
	var REGEX_DATA = 'xregexp';
	// Optional features that can be installed and uninstalled
	var features = {
	    astral: false,
	    natives: false
	};
	// Native methods to use and restore ('native' is an ES3 reserved keyword)
	var nativ = {
	    exec: RegExp.prototype.exec,
	    test: RegExp.prototype.test,
	    match: String.prototype.match,
	    replace: String.prototype.replace,
	    split: String.prototype.split
	};
	// Storage for fixed/extended native methods
	var fixed = {};
	// Storage for regexes cached by `XRegExp.cache`
	var regexCache = {};
	// Storage for pattern details cached by the `XRegExp` constructor
	var patternCache = {};
	// Storage for regex syntax tokens added internally or by `XRegExp.addToken`
	var tokens = [];
	// Token scopes
	var defaultScope = 'default';
	var classScope = 'class';
	// Regexes that match native regex syntax, including octals
	var nativeTokens = {
	    // Any native multicharacter token in default scope, or any single character
	    'default': /\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??|[\s\S]/,
	    // Any native multicharacter token in character class scope, or any single character
	    'class': /\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|[\s\S]/
	};
	// Any backreference or dollar-prefixed character in replacement strings
	var replacementToken = /\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g;
	// Check for correct `exec` handling of nonparticipating capturing groups
	var correctExecNpcg = nativ.exec.call(/()??/, '')[1] === undefined;
	// Check for ES6 `u` flag support
	var hasNativeU = function () {
	    var isSupported = true;
	    try {
	        new RegExp('', 'u');
	    } catch (exception) {
	        isSupported = false;
	    }
	    return isSupported;
	}();
	// Check for ES6 `y` flag support
	var hasNativeY = function () {
	    var isSupported = true;
	    try {
	        new RegExp('', 'y');
	    } catch (exception) {
	        isSupported = false;
	    }
	    return isSupported;
	}();
	// Check for ES6 `flags` prop support
	var hasFlagsProp = /a/.flags !== undefined;
	// Tracker for known flags, including addon flags
	var registeredFlags = {
	    g: true,
	    i: true,
	    m: true,
	    u: hasNativeU,
	    y: hasNativeY
	};
	// Shortcut to `Object.prototype.toString`
	var toString = {}.toString;
	
	/* ==============================
	 * Private functions
	 * ============================== */
	
	/**
	 * Attaches extended data and `XRegExp.prototype` properties to a regex object.
	 *
	 * @private
	 * @param {RegExp} regex Regex to augment.
	 * @param {Array} captureNames Array with capture names, or `null`.
	 * @param {String} xSource XRegExp pattern used to generate `regex`, or `null` if N/A.
	 * @param {String} xFlags XRegExp flags used to generate `regex`, or `null` if N/A.
	 * @param {Boolean} [isInternalOnly=false] Whether the regex will be used only for internal
	 *   operations, and never exposed to users. For internal-only regexes, we can improve perf by
	 *   skipping some operations like attaching `XRegExp.prototype` properties.
	 * @returns {RegExp} Augmented regex.
	 */
	function augment(regex, captureNames, xSource, xFlags, isInternalOnly) {
	    var p;
	
	    regex[REGEX_DATA] = {
	        captureNames: captureNames
	    };
	
	    if (isInternalOnly) {
	        return regex;
	    }
	
	    // Can't auto-inherit these since the XRegExp constructor returns a nonprimitive value
	    if (regex.__proto__) {
	        regex.__proto__ = XRegExp.prototype;
	    } else {
	        for (p in XRegExp.prototype) {
	            // An `XRegExp.prototype.hasOwnProperty(p)` check wouldn't be worth it here, since
	            // this is performance sensitive, and enumerable `Object.prototype` or
	            // `RegExp.prototype` extensions exist on `regex.prototype` anyway
	            regex[p] = XRegExp.prototype[p];
	        }
	    }
	
	    regex[REGEX_DATA].source = xSource;
	    // Emulate the ES6 `flags` prop by ensuring flags are in alphabetical order
	    regex[REGEX_DATA].flags = xFlags ? xFlags.split('').sort().join('') : xFlags;
	
	    return regex;
	}
	
	/**
	 * Removes any duplicate characters from the provided string.
	 *
	 * @private
	 * @param {String} str String to remove duplicate characters from.
	 * @returns {String} String with any duplicate characters removed.
	 */
	function clipDuplicates(str) {
	    return nativ.replace.call(str, /([\s\S])(?=[\s\S]*\1)/g, '');
	}
	
	/**
	 * Copies a regex object while preserving extended data and augmenting with `XRegExp.prototype`
	 * properties. The copy has a fresh `lastIndex` property (set to zero). Allows adding and removing
	 * flags g and y while copying the regex.
	 *
	 * @private
	 * @param {RegExp} regex Regex to copy.
	 * @param {Object} [options] Options object with optional properties:
	 *   <li>`addG` {Boolean} Add flag g while copying the regex.
	 *   <li>`addY` {Boolean} Add flag y while copying the regex.
	 *   <li>`removeG` {Boolean} Remove flag g while copying the regex.
	 *   <li>`removeY` {Boolean} Remove flag y while copying the regex.
	 *   <li>`isInternalOnly` {Boolean} Whether the copied regex will be used only for internal
	 *     operations, and never exposed to users. For internal-only regexes, we can improve perf by
	 *     skipping some operations like attaching `XRegExp.prototype` properties.
	 * @returns {RegExp} Copy of the provided regex, possibly with modified flags.
	 */
	function copyRegex(regex, options) {
	    if (!XRegExp.isRegExp(regex)) {
	        throw new TypeError('Type RegExp expected');
	    }
	
	    var xData = regex[REGEX_DATA] || {},
	        flags = getNativeFlags(regex),
	        flagsToAdd = '',
	        flagsToRemove = '',
	        xregexpSource = null,
	        xregexpFlags = null;
	
	    options = options || {};
	
	    if (options.removeG) {
	        flagsToRemove += 'g';
	    }
	    if (options.removeY) {
	        flagsToRemove += 'y';
	    }
	    if (flagsToRemove) {
	        flags = nativ.replace.call(flags, new RegExp('[' + flagsToRemove + ']+', 'g'), '');
	    }
	
	    if (options.addG) {
	        flagsToAdd += 'g';
	    }
	    if (options.addY) {
	        flagsToAdd += 'y';
	    }
	    if (flagsToAdd) {
	        flags = clipDuplicates(flags + flagsToAdd);
	    }
	
	    if (!options.isInternalOnly) {
	        if (xData.source !== undefined) {
	            xregexpSource = xData.source;
	        }
	        // null or undefined; don't want to add to `flags` if the previous value was null, since
	        // that indicates we're not tracking original precompilation flags
	        if (xData.flags != null) {
	            // Flags are only added for non-internal regexes by `XRegExp.globalize`. Flags are
	            // never removed for non-internal regexes, so don't need to handle it
	            xregexpFlags = flagsToAdd ? clipDuplicates(xData.flags + flagsToAdd) : xData.flags;
	        }
	    }
	
	    // Augment with `XRegExp.prototype` properties, but use the native `RegExp` constructor to
	    // avoid searching for special tokens. That would be wrong for regexes constructed by
	    // `RegExp`, and unnecessary for regexes constructed by `XRegExp` because the regex has
	    // already undergone the translation to native regex syntax
	    regex = augment(new RegExp(regex.source, flags), hasNamedCapture(regex) ? xData.captureNames.slice(0) : null, xregexpSource, xregexpFlags, options.isInternalOnly);
	
	    return regex;
	}
	
	/**
	 * Converts hexadecimal to decimal.
	 *
	 * @private
	 * @param {String} hex
	 * @returns {Number}
	 */
	function dec(hex) {
	    return parseInt(hex, 16);
	}
	
	/**
	 * Returns native `RegExp` flags used by a regex object.
	 *
	 * @private
	 * @param {RegExp} regex Regex to check.
	 * @returns {String} Native flags in use.
	 */
	function getNativeFlags(regex) {
	    return hasFlagsProp ? regex.flags :
	    // Explicitly using `RegExp.prototype.toString` (rather than e.g. `String` or
	    // concatenation with an empty string) allows this to continue working predictably when
	    // `XRegExp.proptotype.toString` is overriden
	    nativ.exec.call(/\/([a-z]*)$/i, RegExp.prototype.toString.call(regex))[1];
	}
	
	/**
	 * Determines whether a regex has extended instance data used to track capture names.
	 *
	 * @private
	 * @param {RegExp} regex Regex to check.
	 * @returns {Boolean} Whether the regex uses named capture.
	 */
	function hasNamedCapture(regex) {
	    return !!(regex[REGEX_DATA] && regex[REGEX_DATA].captureNames);
	}
	
	/**
	 * Converts decimal to hexadecimal.
	 *
	 * @private
	 * @param {Number|String} dec
	 * @returns {String}
	 */
	function hex(dec) {
	    return parseInt(dec, 10).toString(16);
	}
	
	/**
	 * Returns the first index at which a given value can be found in an array.
	 *
	 * @private
	 * @param {Array} array Array to search.
	 * @param {*} value Value to locate in the array.
	 * @returns {Number} Zero-based index at which the item is found, or -1.
	 */
	function indexOf(array, value) {
	    var len = array.length,
	        i;
	
	    for (i = 0; i < len; ++i) {
	        if (array[i] === value) {
	            return i;
	        }
	    }
	
	    return -1;
	}
	
	/**
	 * Determines whether a value is of the specified type, by resolving its internal [[Class]].
	 *
	 * @private
	 * @param {*} value Object to check.
	 * @param {String} type Type to check for, in TitleCase.
	 * @returns {Boolean} Whether the object matches the type.
	 */
	function isType(value, type) {
	    return toString.call(value) === '[object ' + type + ']';
	}
	
	/**
	 * Checks whether the next nonignorable token after the specified position is a quantifier.
	 *
	 * @private
	 * @param {String} pattern Pattern to search within.
	 * @param {Number} pos Index in `pattern` to search at.
	 * @param {String} flags Flags used by the pattern.
	 * @returns {Boolean} Whether the next token is a quantifier.
	 */
	function isQuantifierNext(pattern, pos, flags) {
	    return nativ.test.call(flags.indexOf('x') > -1 ?
	    // Ignore any leading whitespace, line comments, and inline comments
	    /^(?:\s+|#.*|\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/ :
	    // Ignore any leading inline comments
	    /^(?:\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/, pattern.slice(pos));
	}
	
	/**
	 * Pads the provided string with as many leading zeros as needed to get to length 4. Used to produce
	 * fixed-length hexadecimal values.
	 *
	 * @private
	 * @param {String} str
	 * @returns {String}
	 */
	function pad4(str) {
	    while (str.length < 4) {
	        str = '0' + str;
	    }
	    return str;
	}
	
	/**
	 * Checks for flag-related errors, and strips/applies flags in a leading mode modifier. Offloads
	 * the flag preparation logic from the `XRegExp` constructor.
	 *
	 * @private
	 * @param {String} pattern Regex pattern, possibly with a leading mode modifier.
	 * @param {String} flags Any combination of flags.
	 * @returns {Object} Object with properties `pattern` and `flags`.
	 */
	function prepareFlags(pattern, flags) {
	    var i;
	
	    // Recent browsers throw on duplicate flags, so copy this behavior for nonnative flags
	    if (clipDuplicates(flags) !== flags) {
	        throw new SyntaxError('Invalid duplicate regex flag ' + flags);
	    }
	
	    // Strip and apply a leading mode modifier with any combination of flags except g or y
	    pattern = nativ.replace.call(pattern, /^\(\?([\w$]+)\)/, function ($0, $1) {
	        if (nativ.test.call(/[gy]/, $1)) {
	            throw new SyntaxError('Cannot use flag g or y in mode modifier ' + $0);
	        }
	        // Allow duplicate flags within the mode modifier
	        flags = clipDuplicates(flags + $1);
	        return '';
	    });
	
	    // Throw on unknown native or nonnative flags
	    for (i = 0; i < flags.length; ++i) {
	        if (!registeredFlags[flags.charAt(i)]) {
	            throw new SyntaxError('Unknown regex flag ' + flags.charAt(i));
	        }
	    }
	
	    return {
	        pattern: pattern,
	        flags: flags
	    };
	}
	
	/**
	 * Prepares an options object from the given value.
	 *
	 * @private
	 * @param {String|Object} value Value to convert to an options object.
	 * @returns {Object} Options object.
	 */
	function prepareOptions(value) {
	    var options = {};
	
	    if (isType(value, 'String')) {
	        XRegExp.forEach(value, /[^\s,]+/, function (match) {
	            options[match] = true;
	        });
	
	        return options;
	    }
	
	    return value;
	}
	
	/**
	 * Registers a flag so it doesn't throw an 'unknown flag' error.
	 *
	 * @private
	 * @param {String} flag Single-character flag to register.
	 */
	function registerFlag(flag) {
	    if (!/^[\w$]$/.test(flag)) {
	        throw new Error('Flag must be a single character A-Za-z0-9_$');
	    }
	
	    registeredFlags[flag] = true;
	}
	
	/**
	 * Runs built-in and custom regex syntax tokens in reverse insertion order at the specified
	 * position, until a match is found.
	 *
	 * @private
	 * @param {String} pattern Original pattern from which an XRegExp object is being built.
	 * @param {String} flags Flags being used to construct the regex.
	 * @param {Number} pos Position to search for tokens within `pattern`.
	 * @param {Number} scope Regex scope to apply: 'default' or 'class'.
	 * @param {Object} context Context object to use for token handler functions.
	 * @returns {Object} Object with properties `matchLength`, `output`, and `reparse`; or `null`.
	 */
	function runTokens(pattern, flags, pos, scope, context) {
	    var i = tokens.length,
	        leadChar = pattern.charAt(pos),
	        result = null,
	        match,
	        t;
	
	    // Run in reverse insertion order
	    while (i--) {
	        t = tokens[i];
	        if (t.leadChar && t.leadChar !== leadChar || t.scope !== scope && t.scope !== 'all' || t.flag && flags.indexOf(t.flag) === -1) {
	            continue;
	        }
	
	        match = XRegExp.exec(pattern, t.regex, pos, 'sticky');
	        if (match) {
	            result = {
	                matchLength: match[0].length,
	                output: t.handler.call(context, match, scope, flags),
	                reparse: t.reparse
	            };
	            // Finished with token tests
	            break;
	        }
	    }
	
	    return result;
	}
	
	/**
	 * Enables or disables implicit astral mode opt-in. When enabled, flag A is automatically added to
	 * all new regexes created by XRegExp. This causes an error to be thrown when creating regexes if
	 * the Unicode Base addon is not available, since flag A is registered by that addon.
	 *
	 * @private
	 * @param {Boolean} on `true` to enable; `false` to disable.
	 */
	function setAstral(on) {
	    features.astral = on;
	}
	
	/**
	 * Enables or disables native method overrides.
	 *
	 * @private
	 * @param {Boolean} on `true` to enable; `false` to disable.
	 */
	function setNatives(on) {
	    RegExp.prototype.exec = (on ? fixed : nativ).exec;
	    RegExp.prototype.test = (on ? fixed : nativ).test;
	    String.prototype.match = (on ? fixed : nativ).match;
	    String.prototype.replace = (on ? fixed : nativ).replace;
	    String.prototype.split = (on ? fixed : nativ).split;
	
	    features.natives = on;
	}
	
	/**
	 * Returns the object, or throws an error if it is `null` or `undefined`. This is used to follow
	 * the ES5 abstract operation `ToObject`.
	 *
	 * @private
	 * @param {*} value Object to check and return.
	 * @returns {*} The provided object.
	 */
	function toObject(value) {
	    // null or undefined
	    if (value == null) {
	        throw new TypeError('Cannot convert null or undefined to object');
	    }
	
	    return value;
	}
	
	/* ==============================
	 * Constructor
	 * ============================== */
	
	/**
	 * Creates an extended regular expression object for matching text with a pattern. Differs from a
	 * native regular expression in that additional syntax and flags are supported. The returned object
	 * is in fact a native `RegExp` and works with all native methods.
	 *
	 * @class XRegExp
	 * @constructor
	 * @param {String|RegExp} pattern Regex pattern string, or an existing regex object to copy.
	 * @param {String} [flags] Any combination of flags.
	 *   Native flags:
	 *     <li>`g` - global
	 *     <li>`i` - ignore case
	 *     <li>`m` - multiline anchors
	 *     <li>`u` - unicode (ES6)
	 *     <li>`y` - sticky (Firefox 3+, ES6)
	 *   Additional XRegExp flags:
	 *     <li>`n` - explicit capture
	 *     <li>`s` - dot matches all (aka singleline)
	 *     <li>`x` - free-spacing and line comments (aka extended)
	 *     <li>`A` - astral (requires the Unicode Base addon)
	 *   Flags cannot be provided when constructing one `RegExp` from another.
	 * @returns {RegExp} Extended regular expression object.
	 * @example
	 *
	 * // With named capture and flag x
	 * XRegExp('(?<year>  [0-9]{4} ) -?  # year  \n\
	 *          (?<month> [0-9]{2} ) -?  # month \n\
	 *          (?<day>   [0-9]{2} )     # day   ', 'x');
	 *
	 * // Providing a regex object copies it. Native regexes are recompiled using native (not XRegExp)
	 * // syntax. Copies maintain extended data, are augmented with `XRegExp.prototype` properties, and
	 * // have fresh `lastIndex` properties (set to zero).
	 * XRegExp(/regex/);
	 */
	function XRegExp(pattern, flags) {
	    var context = {
	        hasNamedCapture: false,
	        captureNames: []
	    },
	        scope = defaultScope,
	        output = '',
	        pos = 0,
	        result,
	        token,
	        generated,
	        appliedPattern,
	        appliedFlags;
	
	    if (XRegExp.isRegExp(pattern)) {
	        if (flags !== undefined) {
	            throw new TypeError('Cannot supply flags when copying a RegExp');
	        }
	        return copyRegex(pattern);
	    }
	
	    // Copy the argument behavior of `RegExp`
	    pattern = pattern === undefined ? '' : String(pattern);
	    flags = flags === undefined ? '' : String(flags);
	
	    if (XRegExp.isInstalled('astral') && flags.indexOf('A') === -1) {
	        // This causes an error to be thrown if the Unicode Base addon is not available
	        flags += 'A';
	    }
	
	    if (!patternCache[pattern]) {
	        patternCache[pattern] = {};
	    }
	
	    if (!patternCache[pattern][flags]) {
	        // Check for flag-related errors, and strip/apply flags in a leading mode modifier
	        result = prepareFlags(pattern, flags);
	        appliedPattern = result.pattern;
	        appliedFlags = result.flags;
	
	        // Use XRegExp's tokens to translate the pattern to a native regex pattern.
	        // `appliedPattern.length` may change on each iteration if tokens use `reparse`
	        while (pos < appliedPattern.length) {
	            do {
	                // Check for custom tokens at the current position
	                result = runTokens(appliedPattern, appliedFlags, pos, scope, context);
	                // If the matched token used the `reparse` option, splice its output into the
	                // pattern before running tokens again at the same position
	                if (result && result.reparse) {
	                    appliedPattern = appliedPattern.slice(0, pos) + result.output + appliedPattern.slice(pos + result.matchLength);
	                }
	            } while (result && result.reparse);
	
	            if (result) {
	                output += result.output;
	                pos += result.matchLength || 1;
	            } else {
	                // Get the native token at the current position
	                token = XRegExp.exec(appliedPattern, nativeTokens[scope], pos, 'sticky')[0];
	                output += token;
	                pos += token.length;
	                if (token === '[' && scope === defaultScope) {
	                    scope = classScope;
	                } else if (token === ']' && scope === classScope) {
	                    scope = defaultScope;
	                }
	            }
	        }
	
	        patternCache[pattern][flags] = {
	            // Cleanup token cruft: repeated `(?:)(?:)` and leading/trailing `(?:)`
	            pattern: nativ.replace.call(output, /\(\?:\)(?:[*+?]|\{\d+(?:,\d*)?})?\??(?=\(\?:\))|^\(\?:\)(?:[*+?]|\{\d+(?:,\d*)?})?\??|\(\?:\)(?:[*+?]|\{\d+(?:,\d*)?})?\??$/g, ''),
	            // Strip all but native flags
	            flags: nativ.replace.call(appliedFlags, /[^gimuy]+/g, ''),
	            // `context.captureNames` has an item for each capturing group, even if unnamed
	            captures: context.hasNamedCapture ? context.captureNames : null
	        };
	    }
	
	    generated = patternCache[pattern][flags];
	    return augment(new RegExp(generated.pattern, generated.flags), generated.captures, pattern, flags);
	};
	
	// Add `RegExp.prototype` to the prototype chain
	XRegExp.prototype = new RegExp();
	
	/* ==============================
	 * Public properties
	 * ============================== */
	
	/**
	 * The XRegExp version number as a string containing three dot-separated parts. For example,
	 * '2.0.0-beta-3'.
	 *
	 * @static
	 * @memberOf XRegExp
	 * @type String
	 */
	XRegExp.version = '3.1.0-dev';
	
	/* ==============================
	 * Public methods
	 * ============================== */
	
	/**
	 * Extends XRegExp syntax and allows custom flags. This is used internally and can be used to
	 * create XRegExp addons. If more than one token can match the same string, the last added wins.
	 *
	 * @memberOf XRegExp
	 * @param {RegExp} regex Regex object that matches the new token.
	 * @param {Function} handler Function that returns a new pattern string (using native regex syntax)
	 *   to replace the matched token within all future XRegExp regexes. Has access to persistent
	 *   properties of the regex being built, through `this`. Invoked with three arguments:
	 *   <li>The match array, with named backreference properties.
	 *   <li>The regex scope where the match was found: 'default' or 'class'.
	 *   <li>The flags used by the regex, including any flags in a leading mode modifier.
	 *   The handler function becomes part of the XRegExp construction process, so be careful not to
	 *   construct XRegExps within the function or you will trigger infinite recursion.
	 * @param {Object} [options] Options object with optional properties:
	 *   <li>`scope` {String} Scope where the token applies: 'default', 'class', or 'all'.
	 *   <li>`flag` {String} Single-character flag that triggers the token. This also registers the
	 *     flag, which prevents XRegExp from throwing an 'unknown flag' error when the flag is used.
	 *   <li>`optionalFlags` {String} Any custom flags checked for within the token `handler` that are
	 *     not required to trigger the token. This registers the flags, to prevent XRegExp from
	 *     throwing an 'unknown flag' error when any of the flags are used.
	 *   <li>`reparse` {Boolean} Whether the `handler` function's output should not be treated as
	 *     final, and instead be reparseable by other tokens (including the current token). Allows
	 *     token chaining or deferring.
	 *   <li>`leadChar` {String} Single character that occurs at the beginning of any successful match
	 *     of the token (not always applicable). This doesn't change the behavior of the token unless
	 *     you provide an erroneous value. However, providing it can increase the token's performance
	 *     since the token can be skipped at any positions where this character doesn't appear.
	 * @example
	 *
	 * // Basic usage: Add \a for the ALERT control code
	 * XRegExp.addToken(
	 *   /\\a/,
	 *   function() {return '\\x07';},
	 *   {scope: 'all'}
	 * );
	 * XRegExp('\\a[\\a-\\n]+').test('\x07\n\x07'); // -> true
	 *
	 * // Add the U (ungreedy) flag from PCRE and RE2, which reverses greedy and lazy quantifiers.
	 * // Since `scope` is not specified, it uses 'default' (i.e., transformations apply outside of
	 * // character classes only)
	 * XRegExp.addToken(
	 *   /([?*+]|{\d+(?:,\d*)?})(\??)/,
	 *   function(match) {return match[1] + (match[2] ? '' : '?');},
	 *   {flag: 'U'}
	 * );
	 * XRegExp('a+', 'U').exec('aaa')[0]; // -> 'a'
	 * XRegExp('a+?', 'U').exec('aaa')[0]; // -> 'aaa'
	 */
	XRegExp.addToken = function (regex, handler, options) {
	    options = options || {};
	    var optionalFlags = options.optionalFlags,
	        i;
	
	    if (options.flag) {
	        registerFlag(options.flag);
	    }
	
	    if (optionalFlags) {
	        optionalFlags = nativ.split.call(optionalFlags, '');
	        for (i = 0; i < optionalFlags.length; ++i) {
	            registerFlag(optionalFlags[i]);
	        }
	    }
	
	    // Add to the private list of syntax tokens
	    tokens.push({
	        regex: copyRegex(regex, {
	            addG: true,
	            addY: hasNativeY,
	            isInternalOnly: true
	        }),
	        handler: handler,
	        scope: options.scope || defaultScope,
	        flag: options.flag,
	        reparse: options.reparse,
	        leadChar: options.leadChar
	    });
	
	    // Reset the pattern cache used by the `XRegExp` constructor, since the same pattern and
	    // flags might now produce different results
	    XRegExp.cache.flush('patterns');
	};
	
	/**
	 * Caches and returns the result of calling `XRegExp(pattern, flags)`. On any subsequent call with
	 * the same pattern and flag combination, the cached copy of the regex is returned.
	 *
	 * @memberOf XRegExp
	 * @param {String} pattern Regex pattern string.
	 * @param {String} [flags] Any combination of XRegExp flags.
	 * @returns {RegExp} Cached XRegExp object.
	 * @example
	 *
	 * while (match = XRegExp.cache('.', 'gs').exec(str)) {
	 *   // The regex is compiled once only
	 * }
	 */
	XRegExp.cache = function (pattern, flags) {
	    if (!regexCache[pattern]) {
	        regexCache[pattern] = {};
	    }
	    return regexCache[pattern][flags] || (regexCache[pattern][flags] = XRegExp(pattern, flags));
	};
	
	// Intentionally undocumented
	XRegExp.cache.flush = function (cacheName) {
	    if (cacheName === 'patterns') {
	        // Flush the pattern cache used by the `XRegExp` constructor
	        patternCache = {};
	    } else {
	        // Flush the regex cache populated by `XRegExp.cache`
	        regexCache = {};
	    }
	};
	
	/**
	 * Escapes any regular expression metacharacters, for use when matching literal strings. The result
	 * can safely be used at any point within a regex that uses any flags.
	 *
	 * @memberOf XRegExp
	 * @param {String} str String to escape.
	 * @returns {String} String with regex metacharacters escaped.
	 * @example
	 *
	 * XRegExp.escape('Escaped? <.>');
	 * // -> 'Escaped\?\ <\.>'
	 */
	XRegExp.escape = function (str) {
	    return nativ.replace.call(toObject(str), /[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	};
	
	/**
	 * Executes a regex search in a specified string. Returns a match array or `null`. If the provided
	 * regex uses named capture, named backreference properties are included on the match array.
	 * Optional `pos` and `sticky` arguments specify the search start position, and whether the match
	 * must start at the specified position only. The `lastIndex` property of the provided regex is not
	 * used, but is updated for compatibility. Also fixes browser bugs compared to the native
	 * `RegExp.prototype.exec` and can be used reliably cross-browser.
	 *
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {RegExp} regex Regex to search with.
	 * @param {Number} [pos=0] Zero-based index at which to start the search.
	 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
	 *   only. The string `'sticky'` is accepted as an alternative to `true`.
	 * @returns {Array} Match array with named backreference properties, or `null`.
	 * @example
	 *
	 * // Basic use, with named backreference
	 * var match = XRegExp.exec('U+2620', XRegExp('U\\+(?<hex>[0-9A-F]{4})'));
	 * match.hex; // -> '2620'
	 *
	 * // With pos and sticky, in a loop
	 * var pos = 2, result = [], match;
	 * while (match = XRegExp.exec('<1><2><3><4>5<6>', /<(\d)>/, pos, 'sticky')) {
	 *   result.push(match[1]);
	 *   pos = match.index + match[0].length;
	 * }
	 * // result -> ['2', '3', '4']
	 */
	XRegExp.exec = function (str, regex, pos, sticky) {
	    var cacheKey = 'g',
	        addY = false,
	        match,
	        r2;
	
	    addY = hasNativeY && !!(sticky || regex.sticky && sticky !== false);
	    if (addY) {
	        cacheKey += 'y';
	    }
	
	    regex[REGEX_DATA] = regex[REGEX_DATA] || {};
	
	    // Shares cached copies with `XRegExp.match`/`replace`
	    r2 = regex[REGEX_DATA][cacheKey] || (regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
	        addG: true,
	        addY: addY,
	        removeY: sticky === false,
	        isInternalOnly: true
	    }));
	
	    r2.lastIndex = pos = pos || 0;
	
	    // Fixed `exec` required for `lastIndex` fix, named backreferences, etc.
	    match = fixed.exec.call(r2, str);
	
	    if (sticky && match && match.index !== pos) {
	        match = null;
	    }
	
	    if (regex.global) {
	        regex.lastIndex = match ? r2.lastIndex : 0;
	    }
	
	    return match;
	};
	
	/**
	 * Executes a provided function once per regex match. Searches always start at the beginning of the
	 * string and continue until the end, regardless of the state of the regex's `global` property and
	 * initial `lastIndex`.
	 *
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {RegExp} regex Regex to search with.
	 * @param {Function} callback Function to execute for each match. Invoked with four arguments:
	 *   <li>The match array, with named backreference properties.
	 *   <li>The zero-based match index.
	 *   <li>The string being traversed.
	 *   <li>The regex object being used to traverse the string.
	 * @example
	 *
	 * // Extracts every other digit from a string
	 * var evens = [];
	 * XRegExp.forEach('1a2345', /\d/, function(match, i) {
	 *   if (i % 2) evens.push(+match[0]);
	 * });
	 * // evens -> [2, 4]
	 */
	XRegExp.forEach = function (str, regex, callback) {
	    var pos = 0,
	        i = -1,
	        match;
	
	    while (match = XRegExp.exec(str, regex, pos)) {
	        // Because `regex` is provided to `callback`, the function could use the deprecated/
	        // nonstandard `RegExp.prototype.compile` to mutate the regex. However, since
	        // `XRegExp.exec` doesn't use `lastIndex` to set the search position, this can't lead
	        // to an infinite loop, at least. Actually, because of the way `XRegExp.exec` caches
	        // globalized versions of regexes, mutating the regex will not have any effect on the
	        // iteration or matched strings, which is a nice side effect that brings extra safety
	        callback(match, ++i, str, regex);
	
	        pos = match.index + (match[0].length || 1);
	    }
	};
	
	/**
	 * Copies a regex object and adds flag `g`. The copy maintains extended data, is augmented with
	 * `XRegExp.prototype` properties, and has a fresh `lastIndex` property (set to zero). Native
	 * regexes are not recompiled using XRegExp syntax.
	 *
	 * @memberOf XRegExp
	 * @param {RegExp} regex Regex to globalize.
	 * @returns {RegExp} Copy of the provided regex with flag `g` added.
	 * @example
	 *
	 * var globalCopy = XRegExp.globalize(/regex/);
	 * globalCopy.global; // -> true
	 */
	XRegExp.globalize = function (regex) {
	    return copyRegex(regex, { addG: true });
	};
	
	/**
	 * Installs optional features according to the specified options. Can be undone using
	 * {@link #XRegExp.uninstall}.
	 *
	 * @memberOf XRegExp
	 * @param {Object|String} options Options object or string.
	 * @example
	 *
	 * // With an options object
	 * XRegExp.install({
	 *   // Enables support for astral code points in Unicode addons (implicitly sets flag A)
	 *   astral: true,
	 *
	 *   // Overrides native regex methods with fixed/extended versions that support named
	 *   // backreferences and fix numerous cross-browser bugs
	 *   natives: true
	 * });
	 *
	 * // With an options string
	 * XRegExp.install('astral natives');
	 */
	XRegExp.install = function (options) {
	    options = prepareOptions(options);
	
	    if (!features.astral && options.astral) {
	        setAstral(true);
	    }
	
	    if (!features.natives && options.natives) {
	        setNatives(true);
	    }
	};
	
	/**
	 * Checks whether an individual optional feature is installed.
	 *
	 * @memberOf XRegExp
	 * @param {String} feature Name of the feature to check. One of:
	 *   <li>`natives`
	 *   <li>`astral`
	 * @returns {Boolean} Whether the feature is installed.
	 * @example
	 *
	 * XRegExp.isInstalled('natives');
	 */
	XRegExp.isInstalled = function (feature) {
	    return !!features[feature];
	};
	
	/**
	 * Returns `true` if an object is a regex; `false` if it isn't. This works correctly for regexes
	 * created in another frame, when `instanceof` and `constructor` checks would fail.
	 *
	 * @memberOf XRegExp
	 * @param {*} value Object to check.
	 * @returns {Boolean} Whether the object is a `RegExp` object.
	 * @example
	 *
	 * XRegExp.isRegExp('string'); // -> false
	 * XRegExp.isRegExp(/regex/i); // -> true
	 * XRegExp.isRegExp(RegExp('^', 'm')); // -> true
	 * XRegExp.isRegExp(XRegExp('(?s).')); // -> true
	 */
	XRegExp.isRegExp = function (value) {
	    return toString.call(value) === '[object RegExp]';
	    //return isType(value, 'RegExp');
	};
	
	/**
	 * Returns the first matched string, or in global mode, an array containing all matched strings.
	 * This is essentially a more convenient re-implementation of `String.prototype.match` that gives
	 * the result types you actually want (string instead of `exec`-style array in match-first mode,
	 * and an empty array instead of `null` when no matches are found in match-all mode). It also lets
	 * you override flag g and ignore `lastIndex`, and fixes browser bugs.
	 *
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {RegExp} regex Regex to search with.
	 * @param {String} [scope='one'] Use 'one' to return the first match as a string. Use 'all' to
	 *   return an array of all matched strings. If not explicitly specified and `regex` uses flag g,
	 *   `scope` is 'all'.
	 * @returns {String|Array} In match-first mode: First match as a string, or `null`. In match-all
	 *   mode: Array of all matched strings, or an empty array.
	 * @example
	 *
	 * // Match first
	 * XRegExp.match('abc', /\w/); // -> 'a'
	 * XRegExp.match('abc', /\w/g, 'one'); // -> 'a'
	 * XRegExp.match('abc', /x/g, 'one'); // -> null
	 *
	 * // Match all
	 * XRegExp.match('abc', /\w/g); // -> ['a', 'b', 'c']
	 * XRegExp.match('abc', /\w/, 'all'); // -> ['a', 'b', 'c']
	 * XRegExp.match('abc', /x/, 'all'); // -> []
	 */
	XRegExp.match = function (str, regex, scope) {
	    var global = regex.global && scope !== 'one' || scope === 'all',
	        cacheKey = (global ? 'g' : '') + (regex.sticky ? 'y' : '') || 'noGY',
	        result,
	        r2;
	
	    regex[REGEX_DATA] = regex[REGEX_DATA] || {};
	
	    // Shares cached copies with `XRegExp.exec`/`replace`
	    r2 = regex[REGEX_DATA][cacheKey] || (regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
	        addG: !!global,
	        addY: !!regex.sticky,
	        removeG: scope === 'one',
	        isInternalOnly: true
	    }));
	
	    result = nativ.match.call(toObject(str), r2);
	
	    if (regex.global) {
	        regex.lastIndex = scope === 'one' && result ?
	        // Can't use `r2.lastIndex` since `r2` is nonglobal in this case
	        result.index + result[0].length : 0;
	    }
	
	    return global ? result || [] : result && result[0];
	};
	
	/**
	 * Retrieves the matches from searching a string using a chain of regexes that successively search
	 * within previous matches. The provided `chain` array can contain regexes and or objects with
	 * `regex` and `backref` properties. When a backreference is specified, the named or numbered
	 * backreference is passed forward to the next regex or returned.
	 *
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {Array} chain Regexes that each search for matches within preceding results.
	 * @returns {Array} Matches by the last regex in the chain, or an empty array.
	 * @example
	 *
	 * // Basic usage; matches numbers within <b> tags
	 * XRegExp.matchChain('1 <b>2</b> 3 <b>4 a 56</b>', [
	 *   XRegExp('(?is)<b>.*?</b>'),
	 *   /\d+/
	 * ]);
	 * // -> ['2', '4', '56']
	 *
	 * // Passing forward and returning specific backreferences
	 * html = '<a href="http://xregexp.com/api/">XRegExp</a>\
	 *         <a href="http://www.google.com/">Google</a>';
	 * XRegExp.matchChain(html, [
	 *   {regex: /<a href="([^"]+)">/i, backref: 1},
	 *   {regex: XRegExp('(?i)^https?://(?<domain>[^/?#]+)'), backref: 'domain'}
	 * ]);
	 * // -> ['xregexp.com', 'www.google.com']
	 */
	XRegExp.matchChain = function (str, chain) {
	    return function recurseChain(values, level) {
	        var item = chain[level].regex ? chain[level] : { regex: chain[level] },
	            matches = [],
	            addMatch = function addMatch(match) {
	            if (item.backref) {
	                /* Safari 4.0.5 (but not 5.0.5+) inappropriately uses sparse arrays to hold
	                 * the `undefined`s for backreferences to nonparticipating capturing
	                 * groups. In such cases, a `hasOwnProperty` or `in` check on its own would
	                 * inappropriately throw the exception, so also check if the backreference
	                 * is a number that is within the bounds of the array.
	                 */
	                if (!(match.hasOwnProperty(item.backref) || +item.backref < match.length)) {
	                    throw new ReferenceError('Backreference to undefined group: ' + item.backref);
	                }
	
	                matches.push(match[item.backref] || '');
	            } else {
	                matches.push(match[0]);
	            }
	        },
	            i;
	
	        for (i = 0; i < values.length; ++i) {
	            XRegExp.forEach(values[i], item.regex, addMatch);
	        }
	
	        return level === chain.length - 1 || !matches.length ? matches : recurseChain(matches, level + 1);
	    }([str], 0);
	};
	
	/**
	 * Returns a new string with one or all matches of a pattern replaced. The pattern can be a string
	 * or regex, and the replacement can be a string or a function to be called for each match. To
	 * perform a global search and replace, use the optional `scope` argument or include flag g if using
	 * a regex. Replacement strings can use `${n}` for named and numbered backreferences. Replacement
	 * functions can use named backreferences via `arguments[0].name`. Also fixes browser bugs compared
	 * to the native `String.prototype.replace` and can be used reliably cross-browser.
	 *
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {RegExp|String} search Search pattern to be replaced.
	 * @param {String|Function} replacement Replacement string or a function invoked to create it.
	 *   Replacement strings can include special replacement syntax:
	 *     <li>$$ - Inserts a literal $ character.
	 *     <li>$&, $0 - Inserts the matched substring.
	 *     <li>$` - Inserts the string that precedes the matched substring (left context).
	 *     <li>$' - Inserts the string that follows the matched substring (right context).
	 *     <li>$n, $nn - Where n/nn are digits referencing an existent capturing group, inserts
	 *       backreference n/nn.
	 *     <li>${n} - Where n is a name or any number of digits that reference an existent capturing
	 *       group, inserts backreference n.
	 *   Replacement functions are invoked with three or more arguments:
	 *     <li>The matched substring (corresponds to $& above). Named backreferences are accessible as
	 *       properties of this first argument.
	 *     <li>0..n arguments, one for each backreference (corresponding to $1, $2, etc. above).
	 *     <li>The zero-based index of the match within the total search string.
	 *     <li>The total string being searched.
	 * @param {String} [scope='one'] Use 'one' to replace the first match only, or 'all'. If not
	 *   explicitly specified and using a regex with flag g, `scope` is 'all'.
	 * @returns {String} New string with one or all matches replaced.
	 * @example
	 *
	 * // Regex search, using named backreferences in replacement string
	 * var name = XRegExp('(?<first>\\w+) (?<last>\\w+)');
	 * XRegExp.replace('John Smith', name, '${last}, ${first}');
	 * // -> 'Smith, John'
	 *
	 * // Regex search, using named backreferences in replacement function
	 * XRegExp.replace('John Smith', name, function(match) {
	 *   return match.last + ', ' + match.first;
	 * });
	 * // -> 'Smith, John'
	 *
	 * // String search, with replace-all
	 * XRegExp.replace('RegExp builds RegExps', 'RegExp', 'XRegExp', 'all');
	 * // -> 'XRegExp builds XRegExps'
	 */
	XRegExp.replace = function (str, search, replacement, scope) {
	    var isRegex = XRegExp.isRegExp(search),
	        global = search.global && scope !== 'one' || scope === 'all',
	        cacheKey = (global ? 'g' : '') + (search.sticky ? 'y' : '') || 'noGY',
	        s2 = search,
	        result;
	
	    if (isRegex) {
	        search[REGEX_DATA] = search[REGEX_DATA] || {};
	
	        // Shares cached copies with `XRegExp.exec`/`match`. Since a copy is used, `search`'s
	        // `lastIndex` isn't updated *during* replacement iterations
	        s2 = search[REGEX_DATA][cacheKey] || (search[REGEX_DATA][cacheKey] = copyRegex(search, {
	            addG: !!global,
	            addY: !!search.sticky,
	            removeG: scope === 'one',
	            isInternalOnly: true
	        }));
	    } else if (global) {
	        s2 = new RegExp(XRegExp.escape(String(search)), 'g');
	    }
	
	    // Fixed `replace` required for named backreferences, etc.
	    result = fixed.replace.call(toObject(str), s2, replacement);
	
	    if (isRegex && search.global) {
	        // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
	        search.lastIndex = 0;
	    }
	
	    return result;
	};
	
	/**
	 * Performs batch processing of string replacements. Used like {@link #XRegExp.replace}, but
	 * accepts an array of replacement details. Later replacements operate on the output of earlier
	 * replacements. Replacement details are accepted as an array with a regex or string to search for,
	 * the replacement string or function, and an optional scope of 'one' or 'all'. Uses the XRegExp
	 * replacement text syntax, which supports named backreference properties via `${name}`.
	 *
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {Array} replacements Array of replacement detail arrays.
	 * @returns {String} New string with all replacements.
	 * @example
	 *
	 * str = XRegExp.replaceEach(str, [
	 *   [XRegExp('(?<name>a)'), 'z${name}'],
	 *   [/b/gi, 'y'],
	 *   [/c/g, 'x', 'one'], // scope 'one' overrides /g
	 *   [/d/, 'w', 'all'],  // scope 'all' overrides lack of /g
	 *   ['e', 'v', 'all'],  // scope 'all' allows replace-all for strings
	 *   [/f/g, function($0) {
	 *     return $0.toUpperCase();
	 *   }]
	 * ]);
	 */
	XRegExp.replaceEach = function (str, replacements) {
	    var i, r;
	
	    for (i = 0; i < replacements.length; ++i) {
	        r = replacements[i];
	        str = XRegExp.replace(str, r[0], r[1], r[2]);
	    }
	
	    return str;
	};
	
	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 *
	 * @memberOf XRegExp
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * XRegExp.split('a b c', ' ');
	 * // -> ['a', 'b', 'c']
	 *
	 * // With limit
	 * XRegExp.split('a b c', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * XRegExp.split('..word1..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', '..']
	 */
	XRegExp.split = function (str, separator, limit) {
	    return fixed.split.call(toObject(str), separator, limit);
	};
	
	/**
	 * Executes a regex search in a specified string. Returns `true` or `false`. Optional `pos` and
	 * `sticky` arguments specify the search start position, and whether the match must start at the
	 * specified position only. The `lastIndex` property of the provided regex is not used, but is
	 * updated for compatibility. Also fixes browser bugs compared to the native
	 * `RegExp.prototype.test` and can be used reliably cross-browser.
	 *
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {RegExp} regex Regex to search with.
	 * @param {Number} [pos=0] Zero-based index at which to start the search.
	 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
	 *   only. The string `'sticky'` is accepted as an alternative to `true`.
	 * @returns {Boolean} Whether the regex matched the provided value.
	 * @example
	 *
	 * // Basic use
	 * XRegExp.test('abc', /c/); // -> true
	 *
	 * // With pos and sticky
	 * XRegExp.test('abc', /c/, 0, 'sticky'); // -> false
	 * XRegExp.test('abc', /c/, 2, 'sticky'); // -> true
	 */
	XRegExp.test = function (str, regex, pos, sticky) {
	    // Do this the easy way :-)
	    return !!XRegExp.exec(str, regex, pos, sticky);
	};
	
	/**
	 * Uninstalls optional features according to the specified options. All optional features start out
	 * uninstalled, so this is used to undo the actions of {@link #XRegExp.install}.
	 *
	 * @memberOf XRegExp
	 * @param {Object|String} options Options object or string.
	 * @example
	 *
	 * // With an options object
	 * XRegExp.uninstall({
	 *   // Disables support for astral code points in Unicode addons
	 *   astral: true,
	 *
	 *   // Restores native regex methods
	 *   natives: true
	 * });
	 *
	 * // With an options string
	 * XRegExp.uninstall('astral natives');
	 */
	XRegExp.uninstall = function (options) {
	    options = prepareOptions(options);
	
	    if (features.astral && options.astral) {
	        setAstral(false);
	    }
	
	    if (features.natives && options.natives) {
	        setNatives(false);
	    }
	};
	
	/**
	 * Returns an XRegExp object that is the union of the given patterns. Patterns can be provided as
	 * regex objects or strings. Metacharacters are escaped in patterns provided as strings.
	 * Backreferences in provided regex objects are automatically renumbered to work correctly within
	 * the larger combined pattern. Native flags used by provided regexes are ignored in favor of the
	 * `flags` argument.
	 *
	 * @memberOf XRegExp
	 * @param {Array} patterns Regexes and strings to combine.
	 * @param {String} [flags] Any combination of XRegExp flags.
	 * @returns {RegExp} Union of the provided regexes and strings.
	 * @example
	 *
	 * XRegExp.union(['a+b*c', /(dogs)\1/, /(cats)\1/], 'i');
	 * // -> /a\+b\*c|(dogs)\1|(cats)\2/i
	 */
	XRegExp.union = function (patterns, flags) {
	    var parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,
	        output = [],
	        numCaptures = 0,
	        numPriorCaptures,
	        captureNames,
	        pattern,
	        rewrite = function rewrite(match, paren, backref) {
	        var name = captureNames[numCaptures - numPriorCaptures];
	
	        // Capturing group
	        if (paren) {
	            ++numCaptures;
	            // If the current capture has a name, preserve the name
	            if (name) {
	                return '(?<' + name + '>';
	            }
	            // Backreference
	        } else if (backref) {
	            // Rewrite the backreference
	            return '\\' + (+backref + numPriorCaptures);
	        }
	
	        return match;
	    },
	        i;
	
	    if (!(isType(patterns, 'Array') && patterns.length)) {
	        throw new TypeError('Must provide a nonempty array of patterns to merge');
	    }
	
	    for (i = 0; i < patterns.length; ++i) {
	        pattern = patterns[i];
	
	        if (XRegExp.isRegExp(pattern)) {
	            numPriorCaptures = numCaptures;
	            captureNames = pattern[REGEX_DATA] && pattern[REGEX_DATA].captureNames || [];
	
	            // Rewrite backreferences. Passing to XRegExp dies on octals and ensures patterns
	            // are independently valid; helps keep this simple. Named captures are put back
	            output.push(nativ.replace.call(XRegExp(pattern.source).source, parts, rewrite));
	        } else {
	            output.push(XRegExp.escape(pattern));
	        }
	    }
	
	    return XRegExp(output.join('|'), flags);
	};
	
	/* ==============================
	 * Fixed/extended native methods
	 * ============================== */
	
	/**
	 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
	 * bugs in the native `RegExp.prototype.exec`. Calling `XRegExp.install('natives')` uses this to
	 * override the native method. Use via `XRegExp.exec` without overriding natives.
	 *
	 * @private
	 * @param {String} str String to search.
	 * @returns {Array} Match array with named backreference properties, or `null`.
	 */
	fixed.exec = function (str) {
	    var origLastIndex = this.lastIndex,
	        match = nativ.exec.apply(this, arguments),
	        name,
	        r2,
	        i;
	
	    if (match) {
	        // Fix browsers whose `exec` methods don't return `undefined` for nonparticipating
	        // capturing groups. This fixes IE 5.5-8, but not IE 9's quirks mode or emulation of
	        // older IEs. IE 9 in standards mode follows the spec
	        if (!correctExecNpcg && match.length > 1 && indexOf(match, '') > -1) {
	            r2 = copyRegex(this, {
	                removeG: true,
	                isInternalOnly: true
	            });
	            // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
	            // matching due to characters outside the match
	            nativ.replace.call(String(str).slice(match.index), r2, function () {
	                var len = arguments.length,
	                    i;
	                // Skip index 0 and the last 2
	                for (i = 1; i < len - 2; ++i) {
	                    if (arguments[i] === undefined) {
	                        match[i] = undefined;
	                    }
	                }
	            });
	        }
	
	        // Attach named capture properties
	        if (this[REGEX_DATA] && this[REGEX_DATA].captureNames) {
	            // Skip index 0
	            for (i = 1; i < match.length; ++i) {
	                name = this[REGEX_DATA].captureNames[i - 1];
	                if (name) {
	                    match[name] = match[i];
	                }
	            }
	        }
	
	        // Fix browsers that increment `lastIndex` after zero-length matches
	        if (this.global && !match[0].length && this.lastIndex > match.index) {
	            this.lastIndex = match.index;
	        }
	    }
	
	    if (!this.global) {
	        // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
	        this.lastIndex = origLastIndex;
	    }
	
	    return match;
	};
	
	/**
	 * Fixes browser bugs in the native `RegExp.prototype.test`. Calling `XRegExp.install('natives')`
	 * uses this to override the native method.
	 *
	 * @private
	 * @param {String} str String to search.
	 * @returns {Boolean} Whether the regex matched the provided value.
	 */
	fixed.test = function (str) {
	    // Do this the easy way :-)
	    return !!fixed.exec.call(this, str);
	};
	
	/**
	 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
	 * bugs in the native `String.prototype.match`. Calling `XRegExp.install('natives')` uses this to
	 * override the native method.
	 *
	 * @private
	 * @param {RegExp|*} regex Regex to search with. If not a regex object, it is passed to `RegExp`.
	 * @returns {Array} If `regex` uses flag g, an array of match strings or `null`. Without flag g,
	 *   the result of calling `regex.exec(this)`.
	 */
	fixed.match = function (regex) {
	    var result;
	
	    if (!XRegExp.isRegExp(regex)) {
	        // Use the native `RegExp` rather than `XRegExp`
	        regex = new RegExp(regex);
	    } else if (regex.global) {
	        result = nativ.match.apply(this, arguments);
	        // Fixes IE bug
	        regex.lastIndex = 0;
	
	        return result;
	    }
	
	    return fixed.exec.call(regex, toObject(this));
	};
	
	/**
	 * Adds support for `${n}` tokens for named and numbered backreferences in replacement text, and
	 * provides named backreferences to replacement functions as `arguments[0].name`. Also fixes browser
	 * bugs in replacement text syntax when performing a replacement using a nonregex search value, and
	 * the value of a replacement regex's `lastIndex` property during replacement iterations and upon
	 * completion. Calling `XRegExp.install('natives')` uses this to override the native method. Note
	 * that this doesn't support SpiderMonkey's proprietary third (`flags`) argument. Use via
	 * `XRegExp.replace` without overriding natives.
	 *
	 * @private
	 * @param {RegExp|String} search Search pattern to be replaced.
	 * @param {String|Function} replacement Replacement string or a function invoked to create it.
	 * @returns {String} New string with one or all matches replaced.
	 */
	fixed.replace = function (search, replacement) {
	    var isRegex = XRegExp.isRegExp(search),
	        origLastIndex,
	        captureNames,
	        result;
	
	    if (isRegex) {
	        if (search[REGEX_DATA]) {
	            captureNames = search[REGEX_DATA].captureNames;
	        }
	        // Only needed if `search` is nonglobal
	        origLastIndex = search.lastIndex;
	    } else {
	        search += ''; // Type-convert
	    }
	
	    // Don't use `typeof`; some older browsers return 'function' for regex objects
	    if (isType(replacement, 'Function')) {
	        // Stringifying `this` fixes a bug in IE < 9 where the last argument in replacement
	        // functions isn't type-converted to a string
	        result = nativ.replace.call(String(this), search, function () {
	            var args = arguments,
	                i;
	            if (captureNames) {
	                // Change the `arguments[0]` string primitive to a `String` object that can
	                // store properties. This really does need to use `String` as a constructor
	                args[0] = new String(args[0]);
	                // Store named backreferences on the first argument
	                for (i = 0; i < captureNames.length; ++i) {
	                    if (captureNames[i]) {
	                        args[0][captureNames[i]] = args[i + 1];
	                    }
	                }
	            }
	            // Update `lastIndex` before calling `replacement`. Fixes IE, Chrome, Firefox,
	            // Safari bug (last tested IE 9, Chrome 17, Firefox 11, Safari 5.1)
	            if (isRegex && search.global) {
	                search.lastIndex = args[args.length - 2] + args[0].length;
	            }
	            // ES6 specs the context for replacement functions as `undefined`
	            return replacement.apply(undefined, args);
	        });
	    } else {
	        // Ensure that the last value of `args` will be a string when given nonstring `this`,
	        // while still throwing on null or undefined context
	        result = nativ.replace.call(this == null ? this : String(this), search, function () {
	            // Keep this function's `arguments` available through closure
	            var args = arguments;
	            return nativ.replace.call(String(replacement), replacementToken, function ($0, $1, $2) {
	                var n;
	                // Named or numbered backreference with curly braces
	                if ($1) {
	                    // XRegExp behavior for `${n}`:
	                    // 1. Backreference to numbered capture, if `n` is an integer. Use `0` for
	                    //    for the entire match. Any number of leading zeros may be used.
	                    // 2. Backreference to named capture `n`, if it exists and is not an
	                    //    integer overridden by numbered capture. In practice, this does not
	                    //    overlap with numbered capture since XRegExp does not allow named
	                    //    capture to use a bare integer as the name.
	                    // 3. If the name or number does not refer to an existing capturing group,
	                    //    it's an error.
	                    n = +$1; // Type-convert; drop leading zeros
	                    if (n <= args.length - 3) {
	                        return args[n] || '';
	                    }
	                    // Groups with the same name is an error, else would need `lastIndexOf`
	                    n = captureNames ? indexOf(captureNames, $1) : -1;
	                    if (n < 0) {
	                        throw new SyntaxError('Backreference to undefined group ' + $0);
	                    }
	                    return args[n + 1] || '';
	                }
	                // Else, special variable or numbered backreference without curly braces
	                if ($2 === '$') {
	                    // $$
	                    return '$';
	                }
	                if ($2 === '&' || +$2 === 0) {
	                    // $&, $0 (not followed by 1-9), $00
	                    return args[0];
	                }
	                if ($2 === '`') {
	                    // $` (left context)
	                    return args[args.length - 1].slice(0, args[args.length - 2]);
	                }
	                if ($2 === "'") {
	                    // $' (right context)
	                    return args[args.length - 1].slice(args[args.length - 2] + args[0].length);
	                }
	                // Else, numbered backreference without curly braces
	                $2 = +$2; // Type-convert; drop leading zero
	                // XRegExp behavior for `$n` and `$nn`:
	                // - Backrefs end after 1 or 2 digits. Use `${..}` for more digits.
	                // - `$1` is an error if no capturing groups.
	                // - `$10` is an error if less than 10 capturing groups. Use `${1}0` instead.
	                // - `$01` is `$1` if at least one capturing group, else it's an error.
	                // - `$0` (not followed by 1-9) and `$00` are the entire match.
	                // Native behavior, for comparison:
	                // - Backrefs end after 1 or 2 digits. Cannot reference capturing group 100+.
	                // - `$1` is a literal `$1` if no capturing groups.
	                // - `$10` is `$1` followed by a literal `0` if less than 10 capturing groups.
	                // - `$01` is `$1` if at least one capturing group, else it's a literal `$01`.
	                // - `$0` is a literal `$0`.
	                if (!isNaN($2)) {
	                    if ($2 > args.length - 3) {
	                        throw new SyntaxError('Backreference to undefined group ' + $0);
	                    }
	                    return args[$2] || '';
	                }
	                // `$` followed by an unsupported char is an error, unlike native JS
	                throw new SyntaxError('Invalid token ' + $0);
	            });
	        });
	    }
	
	    if (isRegex) {
	        if (search.global) {
	            // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
	            search.lastIndex = 0;
	        } else {
	            // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
	            search.lastIndex = origLastIndex;
	        }
	    }
	
	    return result;
	};
	
	/**
	 * Fixes browser bugs in the native `String.prototype.split`. Calling `XRegExp.install('natives')`
	 * uses this to override the native method. Use via `XRegExp.split` without overriding natives.
	 *
	 * @private
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 */
	fixed.split = function (separator, limit) {
	    if (!XRegExp.isRegExp(separator)) {
	        // Browsers handle nonregex split correctly, so use the faster native method
	        return nativ.split.apply(this, arguments);
	    }
	
	    var str = String(this),
	        output = [],
	        origLastIndex = separator.lastIndex,
	        lastLastIndex = 0,
	        lastLength;
	
	    // Values for `limit`, per the spec:
	    // If undefined: pow(2,32) - 1
	    // If 0, Infinity, or NaN: 0
	    // If positive number: limit = floor(limit); if (limit >= pow(2,32)) limit -= pow(2,32);
	    // If negative number: pow(2,32) - floor(abs(limit))
	    // If other: Type-convert, then use the above rules
	    // This line fails in very strange ways for some values of `limit` in Opera 10.5-10.63,
	    // unless Opera Dragonfly is open (go figure). It works in at least Opera 9.5-10.1 and 11+
	    limit = (limit === undefined ? -1 : limit) >>> 0;
	
	    XRegExp.forEach(str, separator, function (match) {
	        // This condition is not the same as `if (match[0].length)`
	        if (match.index + match[0].length > lastLastIndex) {
	            output.push(str.slice(lastLastIndex, match.index));
	            if (match.length > 1 && match.index < str.length) {
	                Array.prototype.push.apply(output, match.slice(1));
	            }
	            lastLength = match[0].length;
	            lastLastIndex = match.index + lastLength;
	        }
	    });
	
	    if (lastLastIndex === str.length) {
	        if (!nativ.test.call(separator, '') || lastLength) {
	            output.push('');
	        }
	    } else {
	        output.push(str.slice(lastLastIndex));
	    }
	
	    separator.lastIndex = origLastIndex;
	    return output.length > limit ? output.slice(0, limit) : output;
	};
	
	/* ==============================
	 * Built-in syntax/flag tokens
	 * ============================== */
	
	/*
	 * Letter escapes that natively match literal characters: `\a`, `\A`, etc. These should be
	 * SyntaxErrors but are allowed in web reality. XRegExp makes them errors for cross-browser
	 * consistency and to reserve their syntax, but lets them be superseded by addons.
	 */
	XRegExp.addToken(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4}|{[\dA-Fa-f]+})|x(?![\dA-Fa-f]{2}))/, function (match, scope) {
	    // \B is allowed in default scope only
	    if (match[1] === 'B' && scope === defaultScope) {
	        return match[0];
	    }
	    throw new SyntaxError('Invalid escape ' + match[0]);
	}, {
	    scope: 'all',
	    leadChar: '\\'
	});
	
	/*
	 * Unicode code point escape with curly braces: `\u{N..}`. `N..` is any one or more digit
	 * hexadecimal number from 0-10FFFF, and can include leading zeros. Requires the native ES6 `u` flag
	 * to support code points greater than U+FFFF. Avoids converting code points above U+FFFF to
	 * surrogate pairs (which could be done without flag `u`), since that could lead to broken behavior
	 * if you follow a `\u{N..}` token that references a code point above U+FFFF with a quantifier, or
	 * if you use the same in a character class.
	 */
	XRegExp.addToken(/\\u{([\dA-Fa-f]+)}/, function (match, scope, flags) {
	    var code = dec(match[1]);
	    if (code > 0x10FFFF) {
	        throw new SyntaxError('Invalid Unicode code point ' + match[0]);
	    }
	    if (code <= 0xFFFF) {
	        // Converting to \uNNNN avoids needing to escape the literal character and keep it
	        // separate from preceding tokens
	        return '\\u' + pad4(hex(code));
	    }
	    // If `code` is between 0xFFFF and 0x10FFFF, require and defer to native handling
	    if (hasNativeU && flags.indexOf('u') > -1) {
	        return match[0];
	    }
	    throw new SyntaxError('Cannot use Unicode code point above \\u{FFFF} without flag u');
	}, {
	    scope: 'all',
	    leadChar: '\\'
	});
	
	/*
	 * Empty character class: `[]` or `[^]`. This fixes a critical cross-browser syntax inconsistency.
	 * Unless this is standardized (per the ES spec), regex syntax can't be accurately parsed because
	 * character class endings can't be determined.
	 */
	XRegExp.addToken(/\[(\^?)]/, function (match) {
	    // For cross-browser compatibility with ES3, convert [] to \b\B and [^] to [\s\S].
	    // (?!) should work like \b\B, but is unreliable in some versions of Firefox
	    return match[1] ? '[\\s\\S]' : '\\b\\B';
	}, { leadChar: '[' });
	
	/*
	 * Comment pattern: `(?# )`. Inline comments are an alternative to the line comments allowed in
	 * free-spacing mode (flag x).
	 */
	XRegExp.addToken(/\(\?#[^)]*\)/, function (match, scope, flags) {
	    // Keep tokens separated unless the following token is a quantifier
	    return isQuantifierNext(match.input, match.index + match[0].length, flags) ? '' : '(?:)';
	}, { leadChar: '(' });
	
	/*
	 * Whitespace and line comments, in free-spacing mode (aka extended mode, flag x) only.
	 */
	XRegExp.addToken(/\s+|#.*/, function (match, scope, flags) {
	    // Keep tokens separated unless the following token is a quantifier
	    return isQuantifierNext(match.input, match.index + match[0].length, flags) ? '' : '(?:)';
	}, { flag: 'x' });
	
	/*
	 * Dot, in dotall mode (aka singleline mode, flag s) only.
	 */
	XRegExp.addToken(/\./, function () {
	    return '[\\s\\S]';
	}, {
	    flag: 's',
	    leadChar: '.'
	});
	
	/*
	 * Named backreference: `\k<name>`. Backreference names can use the characters A-Z, a-z, 0-9, _,
	 * and $ only. Also allows numbered backreferences as `\k<n>`.
	 */
	XRegExp.addToken(/\\k<([\w$]+)>/, function (match) {
	    // Groups with the same name is an error, else would need `lastIndexOf`
	    var index = isNaN(match[1]) ? indexOf(this.captureNames, match[1]) + 1 : +match[1],
	        endIndex = match.index + match[0].length;
	    if (!index || index > this.captureNames.length) {
	        throw new SyntaxError('Backreference to undefined group ' + match[0]);
	    }
	    // Keep backreferences separate from subsequent literal numbers
	    return '\\' + index + (endIndex === match.input.length || isNaN(match.input.charAt(endIndex)) ? '' : '(?:)');
	}, { leadChar: '\\' });
	
	/*
	 * Numbered backreference or octal, plus any following digits: `\0`, `\11`, etc. Octals except `\0`
	 * not followed by 0-9 and backreferences to unopened capture groups throw an error. Other matches
	 * are returned unaltered. IE < 9 doesn't support backreferences above `\99` in regex syntax.
	 */
	XRegExp.addToken(/\\(\d+)/, function (match, scope) {
	    if (!(scope === defaultScope && /^[1-9]/.test(match[1]) && +match[1] <= this.captureNames.length) && match[1] !== '0') {
	        throw new SyntaxError('Cannot use octal escape or backreference to undefined group ' + match[0]);
	    }
	    return match[0];
	}, {
	    scope: 'all',
	    leadChar: '\\'
	});
	
	/*
	 * Named capturing group; match the opening delimiter only: `(?<name>`. Capture names can use the
	 * characters A-Z, a-z, 0-9, _, and $ only. Names can't be integers. Supports Python-style
	 * `(?P<name>` as an alternate syntax to avoid issues in some older versions of Opera which natively
	 * supported the Python-style syntax. Otherwise, XRegExp might treat numbered backreferences to
	 * Python-style named capture as octals.
	 */
	XRegExp.addToken(/\(\?P?<([\w$]+)>/, function (match) {
	    // Disallow bare integers as names because named backreferences are added to match
	    // arrays and therefore numeric properties may lead to incorrect lookups
	    if (!isNaN(match[1])) {
	        throw new SyntaxError('Cannot use integer as capture name ' + match[0]);
	    }
	    if (match[1] === 'length' || match[1] === '__proto__') {
	        throw new SyntaxError('Cannot use reserved word as capture name ' + match[0]);
	    }
	    if (indexOf(this.captureNames, match[1]) > -1) {
	        throw new SyntaxError('Cannot use same name for multiple groups ' + match[0]);
	    }
	    this.captureNames.push(match[1]);
	    this.hasNamedCapture = true;
	    return '(';
	}, { leadChar: '(' });
	
	/*
	 * Capturing group; match the opening parenthesis only. Required for support of named capturing
	 * groups. Also adds explicit capture mode (flag n).
	 */
	XRegExp.addToken(/\((?!\?)/, function (match, scope, flags) {
	    if (flags.indexOf('n') > -1) {
	        return '(?:';
	    }
	    this.captureNames.push(null);
	    return '(';
	}, {
	    optionalFlags: 'n',
	    leadChar: '('
	});
	
	/* ==============================
	 * Expose XRegExp
	 * ============================== */
	
	module.exports = XRegExp;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _match = __webpack_require__(6);
	
	Object.keys(_match).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _match[key];
	    }
	  });
	});
	
	var _applyRegexList = __webpack_require__(7);
	
	Object.keys(_applyRegexList).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _applyRegexList[key];
	    }
	  });
	});

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Match = exports.Match = function () {
	  function Match(value, index, css) {
	    _classCallCheck(this, Match);
	
	    this.value = value;
	    this.index = index;
	    this.length = value.length;
	    this.css = css;
	    this.brushName = null;
	  }
	
	  _createClass(Match, [{
	    key: "toString",
	    value: function toString() {
	      return this.value;
	    }
	  }]);

	  return Match;
	}();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.applyRegexList = applyRegexList;
	
	var _matches = __webpack_require__(8);
	
	/**
	 * Applies all regular expression to the code and stores all found
	 * matches in the `this.matches` array.
	 */
	function applyRegexList(code, regexList) {
	  var result = [];
	
	  regexList = regexList || [];
	
	  for (var i = 0, l = regexList.length; i < l; i++) {
	    // BUG: length returns len+1 for array if methods added to prototype chain (oising@gmail.com)
	    if (_typeof(regexList[i]) === 'object') result = result.concat((0, _matches.find)(code, regexList[i]));
	  }
	
	  result = (0, _matches.sort)(result);
	  result = (0, _matches.removeNested)(result);
	  result = (0, _matches.compact)(result);
	
	  return result;
	}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.find = find;
	exports.sort = sort;
	exports.compact = compact;
	exports.removeNested = removeNested;
	
	var _match = __webpack_require__(6);
	
	var _syntaxhighlighterRegex = __webpack_require__(3);
	
	/**
	 * Executes given regular expression on provided code and returns all matches that are found.
	 *
	 * @param {String} code    Code to execute regular expression on.
	 * @param {Object} regex   Regular expression item info from `regexList` collection.
	 * @return {Array}         Returns a list of Match objects.
	 */
	function find(code, regexInfo) {
	  function defaultAdd(match, regexInfo) {
	    return match[0];
	  };
	
	  var index = 0,
	      match = null,
	      matches = [],
	      process = regexInfo.func ? regexInfo.func : defaultAdd,
	      pos = 0;
	
	  while (match = _syntaxhighlighterRegex.XRegExp.exec(code, regexInfo.regex, pos)) {
	    var resultMatch = process(match, regexInfo);
	
	    if (typeof resultMatch === 'string') resultMatch = [new _match.Match(resultMatch, match.index, regexInfo.css)];
	
	    matches = matches.concat(resultMatch);
	    pos = match.index + match[0].length;
	  }
	
	  return matches;
	};
	
	/**
	 * Sorts matches by index position and then by length.
	 */
	function sort(matches) {
	  function sortMatchesCallback(m1, m2) {
	    // sort matches by index first
	    if (m1.index < m2.index) return -1;else if (m1.index > m2.index) return 1;else {
	      // if index is the same, sort by length
	      if (m1.length < m2.length) return -1;else if (m1.length > m2.length) return 1;
	    }
	
	    return 0;
	  }
	
	  return matches.sort(sortMatchesCallback);
	}
	
	function compact(matches) {
	  var result = [],
	      i,
	      l;
	
	  for (i = 0, l = matches.length; i < l; i++) {
	    if (matches[i]) result.push(matches[i]);
	  }return result;
	}
	
	/**
	 * Checks to see if any of the matches are inside of other matches.
	 * This process would get rid of highligted strings inside comments,
	 * keywords inside strings and so on.
	 */
	function removeNested(matches) {
	  // Optimized by Jose Prado (http://joseprado.com)
	  for (var i = 0, l = matches.length; i < l; i++) {
	    if (matches[i] === null) continue;
	
	    var itemI = matches[i],
	        itemIEndPos = itemI.index + itemI.length;
	
	    for (var j = i + 1, l = matches.length; j < l && matches[i] !== null; j++) {
	      var itemJ = matches[j];
	
	      if (itemJ === null) continue;else if (itemJ.index > itemIEndPos) break;else if (itemJ.index == itemI.index && itemJ.length > itemI.length) matches[i] = null;else if (itemJ.index >= itemI.index && itemJ.index < itemIEndPos) matches[j] = null;
	    }
	  }
	
	  return matches;
	}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Renderer;
	/**
	 * Pads number with zeros until it's length is the same as given length.
	 *
	 * @param {Number} number Number to pad.
	 * @param {Number} length Max string length with.
	 * @return {String}     Returns a string padded with proper amount of '0'.
	 */
	function padNumber(number, length) {
	  var result = number.toString();
	
	  while (result.length < length) {
	    result = '0' + result;
	  }return result;
	};
	
	function getLines(str) {
	  return str.split(/\r?\n/);
	}
	
	function getLinesToHighlight(opts) {
	  var results = {},
	      linesToHighlight,
	      l,
	      i;
	
	  linesToHighlight = opts.highlight || [];
	
	  if (typeof linesToHighlight.push !== 'function') linesToHighlight = [linesToHighlight];
	
	  for (i = 0, l = linesToHighlight.length; i < l; i++) {
	    results[linesToHighlight[i]] = true;
	  }return results;
	}
	
	function Renderer(code, matches, opts) {
	  var _this = this;
	
	  _this.opts = opts;
	  _this.code = code;
	  _this.matches = matches;
	  _this.lines = getLines(code);
	  _this.linesToHighlight = getLinesToHighlight(opts);
	}
	
	Renderer.prototype = {
	  /**
	   * Wraps each line of the string into <code/> tag with given style applied to it.
	   *
	   * @param {String} str   Input string.
	   * @param {String} css   Style name to apply to the string.
	   * @return {String}      Returns input string with each line surrounded by <span/> tag.
	   */
	  wrapLinesWithCode: function wrapLinesWithCode(str, css) {
	    if (str == null || str.length == 0 || str == '\n' || css == null) return str;
	
	    var _this = this,
	        results = [],
	        lines,
	        line,
	        spaces,
	        i,
	        l;
	
	    str = str.replace(/</g, '&lt;');
	
	    // Replace two or more sequential spaces with &nbsp; leaving last space untouched.
	    str = str.replace(/ {2,}/g, function (m) {
	      spaces = '';
	
	      for (i = 0, l = m.length; i < l - 1; i++) {
	        spaces += _this.opts.space;
	      }return spaces + ' ';
	    });
	
	    lines = getLines(str);
	
	    // Split each line and apply <span class="...">...</span> to them so that leading spaces aren't included.
	    for (i = 0, l = lines.length; i < l; i++) {
	      line = lines[i];
	      spaces = '';
	
	      if (line.length > 0) {
	        line = line.replace(/^(&nbsp;| )+/, function (s) {
	          spaces = s;
	          return '';
	        });
	
	        line = line.length === 0 ? spaces : spaces + '<code class="' + css + '">' + line + '</code>';
	      }
	
	      results.push(line);
	    }
	
	    return results.join('\n');
	  },
	
	  /**
	   * Turns all URLs in the code into <a/> tags.
	   * @param {String} code Input code.
	   * @return {String} Returns code with </a> tags.
	   */
	  processUrls: function processUrls(code) {
	    var gt = /(.*)((&gt;|&lt;).*)/,
	        url = /\w+:\/\/[\w-.\/?%&=:@;#]*/g;
	
	    return code.replace(url, function (m) {
	      var suffix = '',
	          match = null;
	
	      // We include &lt; and &gt; in the URL for the common cases like <http://google.com>
	      // The problem is that they get transformed into &lt;http://google.com&gt;
	      // Where as &gt; easily looks like part of the URL string.
	
	      if (match = gt.exec(m)) {
	        m = match[1];
	        suffix = match[2];
	      }
	
	      return '<a href="' + m + '">' + m + '</a>' + suffix;
	    });
	  },
	
	  /**
	   * Creates an array containing integer line numbers starting from the 'first-line' param.
	   * @return {Array} Returns array of integers.
	   */
	  figureOutLineNumbers: function figureOutLineNumbers(code) {
	    var lineNumbers = [],
	        lines = this.lines,
	        firstLine = parseInt(this.opts.firstLine || 1),
	        i,
	        l;
	
	    for (i = 0, l = lines.length; i < l; i++) {
	      lineNumbers.push(i + firstLine);
	    }return lineNumbers;
	  },
	
	  /**
	   * Generates HTML markup for a single line of code while determining alternating line style.
	   * @param {Integer} lineNumber  Line number.
	   * @param {String} code Line  HTML markup.
	   * @return {String}       Returns HTML markup.
	   */
	  wrapLine: function wrapLine(lineIndex, lineNumber, lineHtml) {
	    var classes = ['line', 'number' + lineNumber, 'index' + lineIndex, 'alt' + (lineNumber % 2 == 0 ? 1 : 2).toString()];
	
	    if (this.linesToHighlight[lineNumber]) classes.push('highlighted');
	
	    if (lineNumber == 0) classes.push('break');
	
	    return '<div class="' + classes.join(' ') + '">' + lineHtml + '</div>';
	  },
	
	  /**
	   * Generates HTML markup for line number column.
	   * @param {String} code     Complete code HTML markup.
	   * @param {Array} lineNumbers Calculated line numbers.
	   * @return {String}       Returns HTML markup.
	   */
	  renderLineNumbers: function renderLineNumbers(code, lineNumbers) {
	    var _this = this,
	        opts = _this.opts,
	        html = '',
	        count = _this.lines.length,
	        firstLine = parseInt(opts.firstLine || 1),
	        pad = opts.padLineNumbers,
	        lineNumber,
	        i;
	
	    if (pad == true) pad = (firstLine + count - 1).toString().length;else if (isNaN(pad) == true) pad = 0;
	
	    for (i = 0; i < count; i++) {
	      lineNumber = lineNumbers ? lineNumbers[i] : firstLine + i;
	      code = lineNumber == 0 ? opts.space : padNumber(lineNumber, pad);
	      html += _this.wrapLine(i, lineNumber, code);
	    }
	
	    return html;
	  },
	
	  /**
	   * Splits block of text into individual DIV lines.
	   * @param {String} code     Code to highlight.
	   * @param {Array} lineNumbers Calculated line numbers.
	   * @return {String}       Returns highlighted code in HTML form.
	   */
	  getCodeLinesHtml: function getCodeLinesHtml(html, lineNumbers) {
	    // html = utils.trim(html);
	
	    var _this = this,
	        opts = _this.opts,
	        lines = getLines(html),
	        padLength = opts.padLineNumbers,
	        firstLine = parseInt(opts.firstLine || 1),
	        brushName = opts.brush,
	        html = '';
	
	    for (var i = 0, l = lines.length; i < l; i++) {
	      var line = lines[i],
	          indent = /^(&nbsp;|\s)+/.exec(line),
	          spaces = null,
	          lineNumber = lineNumbers ? lineNumbers[i] : firstLine + i;
	      ;
	
	      if (indent != null) {
	        spaces = indent[0].toString();
	        line = line.substr(spaces.length);
	        spaces = spaces.replace(' ', opts.space);
	      }
	
	      // line = utils.trim(line);
	
	      if (line.length == 0) line = opts.space;
	
	      html += _this.wrapLine(i, lineNumber, (spaces != null ? '<code class="' + brushName + ' spaces">' + spaces + '</code>' : '') + line);
	    }
	
	    return html;
	  },
	
	  /**
	   * Returns HTML for the table title or empty string if title is null.
	   */
	  getTitleHtml: function getTitleHtml(title) {
	    return title ? '<caption>' + title + '</caption>' : '';
	  },
	
	  /**
	   * Finds all matches in the source code.
	   * @param {String} code   Source code to process matches in.
	   * @param {Array} matches Discovered regex matches.
	   * @return {String} Returns formatted HTML with processed mathes.
	   */
	  getMatchesHtml: function getMatchesHtml(code, matches) {
	    function getBrushNameCss(match) {
	      var result = match ? match.brushName || brushName : brushName;
	      return result ? result + ' ' : '';
	    };
	
	    var _this = this,
	        pos = 0,
	        result = '',
	        brushName = _this.opts.brush || '',
	        match,
	        matchBrushName,
	        i,
	        l;
	
	    // Finally, go through the final list of matches and pull the all
	    // together adding everything in between that isn't a match.
	    for (i = 0, l = matches.length; i < l; i++) {
	      match = matches[i];
	
	      if (match === null || match.length === 0) continue;
	
	      matchBrushName = getBrushNameCss(match);
	
	      result += _this.wrapLinesWithCode(code.substr(pos, match.index - pos), matchBrushName + 'plain') + _this.wrapLinesWithCode(match.value, matchBrushName + match.css);
	
	      pos = match.index + match.length + (match.offset || 0);
	    }
	
	    // don't forget to add whatever's remaining in the string
	    result += _this.wrapLinesWithCode(code.substr(pos), getBrushNameCss() + 'plain');
	
	    return result;
	  },
	
	  /**
	   * Generates HTML markup for the whole syntax highlighter.
	   * @param {String} code Source code.
	   * @return {String} Returns HTML markup.
	   */
	  getHtml: function getHtml() {
	    var _this = this,
	        opts = _this.opts,
	        code = _this.code,
	        matches = _this.matches,
	        classes = ['syntaxhighlighter'],
	        lineNumbers,
	        gutter,
	        html;
	
	    if (opts.collapse === true) classes.push('collapsed');
	
	    gutter = opts.gutter !== false;
	
	    if (!gutter) classes.push('nogutter');
	
	    // add custom user style name
	    classes.push(opts.className);
	
	    // add brush alias to the class name for custom CSS
	    classes.push(opts.brush);
	
	    if (gutter) lineNumbers = _this.figureOutLineNumbers(code);
	
	    // processes found matches into the html
	    html = _this.getMatchesHtml(code, matches);
	
	    // finally, split all lines so that they wrap well
	    html = _this.getCodeLinesHtml(html, lineNumbers);
	
	    // finally, process the links
	    if (opts.autoLinks) html = _this.processUrls(html);
	
	    html = '\n      <div class="' + classes.join(' ') + '">\n        <table border="0" cellpadding="0" cellspacing="0">\n          ' + _this.getTitleHtml(opts.title) + '\n          <tbody>\n            <tr>\n              ' + (gutter ? '<td class="gutter">' + _this.renderLineNumbers(code) + '</td>' : '') + '\n              <td class="code">\n                <div class="container">' + html + '</div>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    ';
	
	    return html;
	  }
	};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Splits block of text into lines.
	 * @param {String} block Block of text.
	 * @return {Array} Returns array of lines.
	 */
	function splitLines(block) {
	  return block.split(/\r?\n/);
	}
	
	/**
	 * Executes a callback on each line and replaces each line with result from the callback.
	 * @param {Object} str      Input string.
	 * @param {Object} callback   Callback function taking one string argument and returning a string.
	 */
	function eachLine(str, callback) {
	  var lines = splitLines(str);
	
	  for (var i = 0, l = lines.length; i < l; i++) {
	    lines[i] = callback(lines[i], i);
	  }return lines.join('\n');
	}
	
	/**
	 * Generates a unique element ID.
	 */
	function guid(prefix) {
	  return (prefix || '') + Math.round(Math.random() * 1000000).toString();
	}
	
	/**
	 * Merges two objects. Values from obj2 override values in obj1.
	 * Function is NOT recursive and works only for one dimensional objects.
	 * @param {Object} obj1 First object.
	 * @param {Object} obj2 Second object.
	 * @return {Object} Returns combination of both objects.
	 */
	function merge(obj1, obj2) {
	  var result = {},
	      name;
	
	  for (name in obj1) {
	    result[name] = obj1[name];
	  }for (name in obj2) {
	    result[name] = obj2[name];
	  }return result;
	}
	
	/**
	 * Removes all white space at the begining and end of a string.
	 *
	 * @param {String} str   String to trim.
	 * @return {String}      Returns string without leading and following white space characters.
	 */
	function trim(str) {
	  return str.replace(/^\s+|\s+$/g, '');
	}
	
	/**
	 * Converts the source to array object. Mostly used for function arguments and
	 * lists returned by getElementsByTagName() which aren't Array objects.
	 * @param {List} source Source list.
	 * @return {Array} Returns array.
	 */
	function toArray(source) {
	  return Array.prototype.slice.apply(source);
	}
	
	/**
	 * Attempts to convert string to boolean.
	 * @param {String} value Input string.
	 * @return {Boolean} Returns true if input was "true", false if input was "false" and value otherwise.
	 */
	function toBoolean(value) {
	  var result = { "true": true, "false": false }[value];
	  return result == null ? value : result;
	}
	
	module.exports = {
	  splitLines: splitLines,
	  eachLine: eachLine,
	  guid: guid,
	  merge: merge,
	  trim: trim,
	  toArray: toArray,
	  toBoolean: toBoolean
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var trim = __webpack_require__(12),
	    bloggerMode = __webpack_require__(13),
	    stripBrs = __webpack_require__(14),
	    unindenter = __webpack_require__(15),
	    retabber = __webpack_require__(16);
	
	module.exports = function (code, opts) {
	  code = trim(code, opts);
	  code = bloggerMode(code, opts);
	  code = stripBrs(code, opts);
	  code = unindenter.unindent(code, opts);
	
	  var tabSize = opts['tab-size'];
	  code = opts['smart-tabs'] === true ? retabber.smart(code, tabSize) : retabber.regular(code, tabSize);
	
	  return code;
	};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function (code, opts) {
	   return code
	   // This is a special trim which only removes first and last empty lines
	   // and doesn't affect valid leading space on the first line.
	   .replace(/^[ ]*[\n]+|[\n]*[ ]*$/g, '')
	
	   // IE lets these buggers through
	   .replace(/\r/g, ' ');
	};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function (code, opts) {
	  var br = /<br\s*\/?>|&lt;br\s*\/?&gt;/gi;
	
	  if (opts['bloggerMode'] === true) code = code.replace(br, '\n');
	
	  return code;
	};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function (code, opts) {
	  var br = /<br\s*\/?>|&lt;br\s*\/?&gt;/gi;
	
	  if (opts['stripBrs'] === true) code = code.replace(br, '');
	
	  return code;
	};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	'use strict';
	
	function isEmpty(str) {
	  return (/^\s*$/.test(str)
	  );
	}
	
	module.exports = {
	  unindent: function unindent(code) {
	    var lines = code.split(/\r?\n/),
	        regex = /^\s*/,
	        min = 1000,
	        line,
	        matches,
	        i,
	        l;
	
	    // go through every line and check for common number of indents
	    for (i = 0, l = lines.length; i < l && min > 0; i++) {
	      line = lines[i];
	
	      if (isEmpty(line)) continue;
	
	      matches = regex.exec(line);
	
	      // In the event that just one line doesn't have leading white space
	      // we can't unindent anything, so bail completely.
	      if (matches == null) return code;
	
	      min = Math.min(matches[0].length, min);
	    }
	
	    // trim minimum common number of white space from the begining of every line
	    if (min > 0) for (i = 0, l = lines.length; i < l; i++) {
	      if (!isEmpty(lines[i])) lines[i] = lines[i].substr(min);
	    }return lines.join('\n');
	  }
	};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	'use strict';
	
	var spaces = '';
	
	// Create a string with 1000 spaces to copy spaces from...
	// It's assumed that there would be no indentation longer than that.
	for (var i = 0; i < 50; i++) {
	  spaces += '                    ';
	} // 20 spaces * 50
	
	// This function inserts specified amount of spaces in the string
	// where a tab is while removing that given tab.
	function insertSpaces(line, pos, count) {
	  return line.substr(0, pos) + spaces.substr(0, count) + line.substr(pos + 1, line.length) // pos + 1 will get rid of the tab
	  ;
	}
	
	module.exports = {
	  smart: function smart(code, tabSize) {
	    var lines = code.split(/\r?\n/),
	        tab = '\t',
	        line,
	        pos,
	        i,
	        l;
	
	    // Go through all the lines and do the 'smart tabs' magic.
	    for (i = 0, l = lines.length; i < l; i++) {
	      line = lines[i];
	
	      if (line.indexOf(tab) === -1) continue;
	
	      pos = 0;
	
	      while ((pos = line.indexOf(tab)) !== -1) {
	        // This is pretty much all there is to the 'smart tabs' logic.
	        // Based on the position within the line and size of a tab,
	        // calculate the amount of spaces we need to insert.
	        line = insertSpaces(line, pos, tabSize - pos % tabSize);
	      }
	
	      lines[i] = line;
	    }
	
	    return lines.join('\n');
	  },
	
	  regular: function regular(code, tabSize) {
	    return code.replace(/\t/g, spaces.substr(0, tabSize));
	  }
	};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Finds all &lt;SCRIPT TYPE="text/syntaxhighlighter" /> elementss.
	 * Finds both "text/syntaxhighlighter" and "syntaxhighlighter"
	 * ...in order to make W3C validator happy with subtype and backwardscompatible without subtype
	 * @return {Array} Returns array of all found SyntaxHighlighter tags.
	 */
	function getSyntaxHighlighterScriptTags() {
	  var tags = document.getElementsByTagName('script'),
	      result = [];
	
	  for (var i = 0; i < tags.length; i++) {
	    if (tags[i].type == 'text/syntaxhighlighter' || tags[i].type == 'syntaxhighlighter') result.push(tags[i]);
	  }return result;
	};
	
	/**
	 * Checks if target DOM elements has specified CSS class.
	 * @param {DOMElement} target Target DOM element to check.
	 * @param {String} className Name of the CSS class to check for.
	 * @return {Boolean} Returns true if class name is present, false otherwise.
	 */
	function hasClass(target, className) {
	  return target.className.indexOf(className) != -1;
	}
	
	/**
	 * Adds CSS class name to the target DOM element.
	 * @param {DOMElement} target Target DOM element.
	 * @param {String} className New CSS class to add.
	 */
	function addClass(target, className) {
	  if (!hasClass(target, className)) target.className += ' ' + className;
	}
	
	/**
	 * Removes CSS class name from the target DOM element.
	 * @param {DOMElement} target Target DOM element.
	 * @param {String} className CSS class to remove.
	 */
	function removeClass(target, className) {
	  target.className = target.className.replace(className, '');
	}
	
	/**
	 * Adds event handler to the target object.
	 * @param {Object} obj    Target object.
	 * @param {String} type   Name of the event.
	 * @param {Function} func Handling function.
	 */
	function attachEvent(obj, type, func, scope) {
	  function handler(e) {
	    e = e || window.event;
	
	    if (!e.target) {
	      e.target = e.srcElement;
	      e.preventDefault = function () {
	        this.returnValue = false;
	      };
	    }
	
	    func.call(scope || window, e);
	  };
	
	  if (obj.attachEvent) {
	    obj.attachEvent('on' + type, handler);
	  } else {
	    obj.addEventListener(type, handler, false);
	  }
	}
	
	/**
	 * Looks for a child or parent node which has specified classname.
	 * Equivalent to jQuery's $(container).find(".className")
	 * @param {Element} target Target element.
	 * @param {String} search Class name or node name to look for.
	 * @param {Boolean} reverse If set to true, will go up the node tree instead of down.
	 * @return {Element} Returns found child or parent element on null.
	 */
	function findElement(target, search, reverse /* optional */) {
	  if (target == null) return null;
	
	  var nodes = reverse != true ? target.childNodes : [target.parentNode],
	      propertyToFind = { '#': 'id', '.': 'className' }[search.substr(0, 1)] || 'nodeName',
	      expectedValue,
	      found;
	
	  expectedValue = propertyToFind != 'nodeName' ? search.substr(1) : search.toUpperCase();
	
	  // main return of the found node
	  if ((target[propertyToFind] || '').indexOf(expectedValue) != -1) return target;
	
	  for (var i = 0, l = nodes.length; nodes && i < l && found == null; i++) {
	    found = findElement(nodes[i], search, reverse);
	  }return found;
	}
	
	/**
	 * Looks for a parent node which has specified classname.
	 * This is an alias to <code>findElement(container, className, true)</code>.
	 * @param {Element} target Target element.
	 * @param {String} className Class name to look for.
	 * @return {Element} Returns found parent element on null.
	 */
	function findParentElement(target, className) {
	  return findElement(target, className, true);
	}
	
	/**
	 * Opens up a centered popup window.
	 * @param {String} url    URL to open in the window.
	 * @param {String} name   Popup name.
	 * @param {int} width   Popup width.
	 * @param {int} height    Popup height.
	 * @param {String} options  window.open() options.
	 * @return {Window}     Returns window instance.
	 */
	function popup(url, name, width, height, options) {
	  var x = (screen.width - width) / 2,
	      y = (screen.height - height) / 2;
	
	  options += ', left=' + x + ', top=' + y + ', width=' + width + ', height=' + height;
	  options = options.replace(/^,/, '');
	
	  var win = window.open(url, name, options);
	  win.focus();
	  return win;
	}
	
	function getElementsByTagName(name) {
	  return document.getElementsByTagName(name);
	}
	
	/**
	 * Finds all elements on the page which could be processes by SyntaxHighlighter.
	 */
	function findElementsToHighlight(opts) {
	  var elements = getElementsByTagName(opts['tagName']),
	      scripts,
	      i;
	
	  // support for <SCRIPT TYPE="syntaxhighlighter" /> feature
	  if (opts['useScriptTags']) {
	    scripts = getElementsByTagName('script');
	
	    for (i = 0; i < scripts.length; i++) {
	      if (scripts[i].type.match(/^(text\/)?syntaxhighlighter$/)) elements.push(scripts[i]);
	    }
	  }
	
	  return elements;
	}
	
	function create(name) {
	  return document.createElement(name);
	}
	
	/**
	 * Quick code mouse double click handler.
	 */
	function quickCodeHandler(e) {
	  var target = e.target,
	      highlighterDiv = findParentElement(target, '.syntaxhighlighter'),
	      container = findParentElement(target, '.container'),
	      textarea = document.createElement('textarea'),
	      highlighter;
	
	  if (!container || !highlighterDiv || findElement(container, 'textarea')) return;
	
	  //highlighter = highlighters.get(highlighterDiv.id);
	
	  // add source class name
	  addClass(highlighterDiv, 'source');
	
	  // Have to go over each line and grab it's text, can't just do it on the
	  // container because Firefox loses all \n where as Webkit doesn't.
	  var lines = container.childNodes,
	      code = [];
	
	  for (var i = 0, l = lines.length; i < l; i++) {
	    code.push(lines[i].innerText || lines[i].textContent);
	  } // using \r instead of \r or \r\n makes this work equally well on IE, FF and Webkit
	  code = code.join('\r');
	
	  // For Webkit browsers, replace nbsp with a breaking space
	  code = code.replace(/\u00a0/g, " ");
	
	  // inject <textarea/> tag
	  textarea.readOnly = true; // https://github.com/syntaxhighlighter/syntaxhighlighter/pull/329
	  textarea.appendChild(document.createTextNode(code));
	  container.appendChild(textarea);
	
	  // preselect all text
	  textarea.focus();
	  textarea.select();
	
	  // set up handler for lost focus
	  attachEvent(textarea, 'blur', function (e) {
	    textarea.parentNode.removeChild(textarea);
	    removeClass(highlighterDiv, 'source');
	  });
	};
	
	module.exports = {
	  quickCodeHandler: quickCodeHandler,
	  create: create,
	  popup: popup,
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass,
	  attachEvent: attachEvent,
	  findElement: findElement,
	  findParentElement: findParentElement,
	  getSyntaxHighlighterScriptTags: getSyntaxHighlighterScriptTags,
	  findElementsToHighlight: findElementsToHighlight
	};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = {
	  space: '&nbsp;',
	
	  /** Enables use of <SCRIPT type="syntaxhighlighter" /> tags. */
	  useScriptTags: true,
	
	  /** Blogger mode flag. */
	  bloggerMode: false,
	
	  stripBrs: false,
	
	  /** Name of the tag that SyntaxHighlighter will automatically look for. */
	  tagName: 'pre'
	};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = {
	  /** Additional CSS class names to be added to highlighter elements. */
	  'class-name': '',
	
	  /** First line number. */
	  'first-line': 1,
	
	  /**
	   * Pads line numbers. Possible values are:
	   *
	   *   false - don't pad line numbers.
	   *   true  - automaticaly pad numbers with minimum required number of leading zeroes.
	   *   [int] - length up to which pad line numbers.
	   */
	  'pad-line-numbers': false,
	
	  /** Lines to highlight. */
	  'highlight': null,
	
	  /** Title to be displayed above the code block. */
	  'title': null,
	
	  /** Enables or disables smart tabs. */
	  'smart-tabs': true,
	
	  /** Gets or sets tab size. */
	  'tab-size': 4,
	
	  /** Enables or disables gutter. */
	  'gutter': true,
	
	  /** Enables quick code copy and paste from double click. */
	  'quick-code': true,
	
	  /** Forces code view to be collapsed. */
	  'collapse': false,
	
	  /** Enables or disables automatic links. */
	  'auto-links': true,
	
	  'unindent': true,
	
	  'html-script': false
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var applyRegexList = __webpack_require__(5).applyRegexList;
	
	function HtmlScript(BrushXML, brushClass) {
	  var scriptBrush,
	      xmlBrush = new BrushXML();
	
	  if (brushClass == null) return;
	
	  scriptBrush = new brushClass();
	
	  if (scriptBrush.htmlScript == null) throw new Error('Brush wasn\'t configured for html-script option: ' + brushClass.brushName);
	
	  xmlBrush.regexList.push({ regex: scriptBrush.htmlScript.code, func: process });
	
	  this.regexList = xmlBrush.regexList;
	
	  function offsetMatches(matches, offset) {
	    for (var j = 0, l = matches.length; j < l; j++) {
	      matches[j].index += offset;
	    }
	  }
	
	  function process(match, info) {
	    var code = match.code,
	        results = [],
	        regexList = scriptBrush.regexList,
	        offset = match.index + match.left.length,
	        htmlScript = scriptBrush.htmlScript,
	        matches;
	
	    function add(matches) {
	      results = results.concat(matches);
	    }
	
	    matches = applyRegexList(code, regexList);
	    offsetMatches(matches, offset);
	    add(matches);
	
	    // add left script bracket
	    if (htmlScript.left != null && match.left != null) {
	      matches = applyRegexList(match.left, [htmlScript.left]);
	      offsetMatches(matches, match.index);
	      add(matches);
	    }
	
	    // add right script bracket
	    if (htmlScript.right != null && match.right != null) {
	      matches = applyRegexList(match.right, [htmlScript.right]);
	      offsetMatches(matches, match.index + match[0].lastIndexOf(match.right));
	      add(matches);
	    }
	
	    for (var j = 0, l = results.length; j < l; j++) {
	      results[j].brushName = brushClass.brushName;
	    }return results;
	  }
	};
	
	module.exports = HtmlScript;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	'use strict';
	
	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) {
	    return [];
	};
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _syntaxhighlighterHtmlRenderer = __webpack_require__(9);
	
	var _syntaxhighlighterHtmlRenderer2 = _interopRequireDefault(_syntaxhighlighterHtmlRenderer);
	
	var _syntaxhighlighterRegex = __webpack_require__(3);
	
	var _syntaxhighlighterMatch = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function () {
	  function BrushBase() {
	    _classCallCheck(this, BrushBase);
	  }
	
	  _createClass(BrushBase, [{
	    key: 'getKeywords',
	
	    /**
	     * Converts space separated list of keywords into a regular expression string.
	     * @param {String} str Space separated keywords.
	     * @return {String} Returns regular expression string.
	     */
	    value: function getKeywords(str) {
	      var results = str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '|');
	
	      return '\\b(?:' + results + ')\\b';
	    }
	
	    /**
	     * Makes a brush compatible with the `html-script` functionality.
	     * @param {Object} regexGroup Object containing `left` and `right` regular expressions.
	     */
	
	  }, {
	    key: 'forHtmlScript',
	    value: function forHtmlScript(regexGroup) {
	      var regex = { 'end': regexGroup.right.source };
	
	      if (regexGroup.eof) {
	        regex.end = '(?:(?:' + regex.end + ')|$)';
	      }
	
	      this.htmlScript = {
	        left: { regex: regexGroup.left, css: 'script' },
	        right: { regex: regexGroup.right, css: 'script' },
	        code: (0, _syntaxhighlighterRegex.XRegExp)("(?<left>" + regexGroup.left.source + ")" + "(?<code>.*?)" + "(?<right>" + regex.end + ")", "sgi")
	      };
	    }
	  }, {
	    key: 'getHtml',
	    value: function getHtml(code) {
	      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	      var matches = (0, _syntaxhighlighterMatch.applyRegexList)(code, this.regexList);
	      var renderer = new _syntaxhighlighterHtmlRenderer2.default(code, matches, params);
	      return renderer.getHtml();
	    }
	  }]);
	
	  return BrushBase;
	}();

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // AppleScript brush by David Chambers
	  // http://davidchambersdesign.com/
	  var keywords = 'after before beginning continue copy each end every from return get global in local named of set some that the then times to where whose with without';
	  var ordinals = 'first second third fourth fifth sixth seventh eighth ninth tenth last front back middle';
	  var specials = 'activate add alias ask attachment boolean class constant delete duplicate empty exists id integer list make message modal modified new no pi properties quit real record remove rest result reveal reverse run running save string word yes';
	
	  this.regexList = [{
	    regex: /(--|#).*$/gm,
	    css: 'comments'
	  }, {
	    regex: /\(\*(?:[\s\S]*?\(\*[\s\S]*?\*\))*[\s\S]*?\*\)/gm, // support nested comments
	    css: 'comments'
	  }, {
	    regex: /"[\s\S]*?"/gm,
	    css: 'string'
	  }, {
	    regex: /(?:,|:|¬|'s\b|\(|\)|\{|\}|«|\b\w*»)/g, // operators
	    css: 'color1'
	  }, {
	    regex: /(-)?(\d)+(\.(\d)?)?(E\+(\d)+)?/g, // numbers
	    css: 'color1'
	  }, {
	    regex: /(?:&(amp;|gt;|lt;)?|=|� |>|<|≥|>=|≤|<=|\*|\+|-|\/|÷|\^)/g,
	    css: 'color2'
	  }, {
	    regex: /\b(?:and|as|div|mod|not|or|return(?!\s&)(ing)?|equals|(is(n't| not)? )?equal( to)?|does(n't| not) equal|(is(n't| not)? )?(greater|less) than( or equal( to)?)?|(comes|does(n't| not) come) (after|before)|is(n't| not)?( in)? (back|front) of|is(n't| not)? behind|is(n't| not)?( (in|contained by))?|does(n't| not) contain|contain(s)?|(start|begin|end)(s)? with|((but|end) )?(consider|ignor)ing|prop(erty)?|(a )?ref(erence)?( to)?|repeat (until|while|with)|((end|exit) )?repeat|((else|end) )?if|else|(end )?(script|tell|try)|(on )?error|(put )?into|(of )?(it|me)|its|my|with (timeout( of)?|transaction)|end (timeout|transaction))\b/g,
	    css: 'keyword'
	  }, {
	    regex: /\b\d+(st|nd|rd|th)\b/g, // ordinals
	    css: 'keyword'
	  }, {
	    regex: /\b(?:about|above|against|around|at|below|beneath|beside|between|by|(apart|aside) from|(instead|out) of|into|on(to)?|over|since|thr(ough|u)|under)\b/g,
	    css: 'color3'
	  }, {
	    regex: /\b(?:adding folder items to|after receiving|clipboard info|set the clipboard to|(the )?clipboard|entire contents|document( (edited|file|nib name))?|file( (name|type))?|(info )?for|giving up after|(name )?extension|return(ed)?|second(?! item)(s)?|list (disks|folder)|(Unicode )?text|(disk )?item(s)?|((current|list) )?view|((container|key) )?window|case|diacriticals|hyphens|numeric strings|punctuation|white space|folder creation|application(s( folder)?| (processes|scripts position|support))?|((desktop )?(pictures )?|(documents|downloads|favorites|home|keychain|library|movies|music|public|scripts|sites|system|users|utilities|workflows) )folder|desktop|Folder Action scripts|font(s| panel)?|help|internet plugins|modem scripts|(system )?preferences|printer descriptions|scripting (additions|components)|shared (documents|libraries)|startup (disk|items)|temporary items|trash|on server|in AppleTalk zone|((as|long|short) )?user name|user (ID|locale)|(with )?password|in (bundle( with identifier)?|directory)|(close|open for) access|read|write( permission)?|(g|s)et eof|starting at|hidden( answer)?|open(ed| (location|untitled))?|error (handling|reporting)|administrator privileges|altering line endings|get volume settings|(alert|boot|input|mount|output|set) volume|output muted|(fax|random )?number|round(ing)?|up|down|toward zero|to nearest|as taught in school|system (attribute|info)|((AppleScript( Studio)?|system) )?version|(home )?directory|(IPv4|primary Ethernet) address|CPU (type|speed)|physical memory|time (stamp|to GMT)|replacing|ASCII (character|number)|localized string|from table|offset|summarize|beep|delay|say|(empty|multiple) selections allowed|(of|preferred) type|invisibles|showing( package contents)?|editable URL|(File|FTP|News|Media|Web) [Ss]ervers|Telnet hosts|Directory services|Remote applications|waiting until completion|saving( (in|to))?|path (for|to( (((current|frontmost) )?application|resource))?)|(background|RGB) color|(OK|cancel) button name|cancel button|button(s)?|cubic ((centi)?met(re|er)s|yards|feet|inches)|square ((kilo)?met(re|er)s|miles|yards|feet)|(centi|kilo)?met(re|er)s|miles|yards|feet|inches|lit(re|er)s|gallons|quarts|(kilo)?grams|ounces|pounds|degrees (Celsius|Fahrenheit|Kelvin)|print( (dialog|settings))?|clos(e(able)?|ing)|(de)?miniaturized|miniaturizable|zoom(ed|able)|attribute run|action (method|property|title)|phone|email|((start|end)ing|home) page|((birth|creation|current|custom|modification) )?date|((((phonetic )?(first|last|middle))|computer|host|maiden|related) |nick)?name|aim|icq|jabber|msn|yahoo|address(es)?|save addressbook|should enable action|city|country( code)?|formatte(r|d address)|(palette )?label|state|street|zip|AIM [Hh]andle(s)?|my card|select(ion| all)?|unsaved|(alpha )?value|entr(y|ies)|(ICQ|Jabber|MSN) handle|person|people|company|department|icon image|job title|note|organization|suffix|vcard|url|copies|collating|pages (across|down)|request print time|target( printer)?|((GUI Scripting|Script menu) )?enabled|show Computer scripts|(de)?activated|awake from nib|became (key|main)|call method|of (class|object)|center|clicked toolbar item|closed|for document|exposed|(can )?hide|idle|keyboard (down|up)|event( (number|type))?|launch(ed)?|load (image|movie|nib|sound)|owner|log|mouse (down|dragged|entered|exited|moved|up)|move|column|localization|resource|script|register|drag (info|types)|resigned (active|key|main)|resiz(e(d)?|able)|right mouse (down|dragged|up)|scroll wheel|(at )?index|should (close|open( untitled)?|quit( after last window closed)?|zoom)|((proposed|screen) )?bounds|show(n)?|behind|in front of|size (mode|to fit)|update(d| toolbar item)?|was (hidden|miniaturized)|will (become active|close|finish launching|hide|miniaturize|move|open|quit|(resign )?active|((maximum|minimum|proposed) )?size|show|zoom)|bundle|data source|movie|pasteboard|sound|tool(bar| tip)|(color|open|save) panel|coordinate system|frontmost|main( (bundle|menu|window))?|((services|(excluded from )?windows) )?menu|((executable|frameworks|resource|scripts|shared (frameworks|support)) )?path|(selected item )?identifier|data|content(s| view)?|character(s)?|click count|(command|control|option|shift) key down|context|delta (x|y|z)|key( code)?|location|pressure|unmodified characters|types|(first )?responder|playing|(allowed|selectable) identifiers|allows customization|(auto saves )?configuration|visible|image( name)?|menu form representation|tag|user(-| )defaults|associated file name|(auto|needs) display|current field editor|floating|has (resize indicator|shadow)|hides when deactivated|level|minimized (image|title)|opaque|position|release when closed|sheet|title(d)?)\b/g,
	    css: 'color4'
	  }, {
	    regex: /\b(?:tracks|paragraph|text item(s)?)\b/g,
	    css: 'classes'
	  }, {
	    regex: /\b(?:AppleScript|album|video kind|grouping|length|text item delimiters|quoted form|POSIX path(?= of))\b/g,
	    css: 'properties'
	  }, {
	    regex: /\b(?:run|exists|count)\b/g,
	    css: 'commandNames'
	  }, {
	    regex: /\b(?:POSIX (file|path))\b/g,
	    css: 'additionClasses'
	  }, {
	    regex: /\b(?:message|with (data|icon( (caution|note|stop))?|parameter(s)?|prompt|properties|seed|title)|regexp|string result|using( delimiters)?|default (answer|button|color|country code|entr(y|ies)|identifiers|items|name|location|script editor))\b/g,
	    css: 'additionParameterNames'
	  }, {
	    regex: /\b(?:display(ing| (alert|dialog|mode))?|choose( ((remote )?application|color|folder|from list|URL))?|(do( shell)?|load|run|store) script|re_compile|find text)\b/g,
	    css: 'additionCommandNames'
	  }, {
	    regex: /\b(?:xxx)\b/g,
	    css: 'parameterNames'
	  }, {
	    regex: /\b(?:true|false|none)\b/g,
	    css: 'enumeratedValues'
	  }, {
	    regex: new RegExp(this.getKeywords(specials), 'gm'),
	    css: 'color3'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp(this.getKeywords(ordinals), 'gm'),
	    css: 'keyword'
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['applescript'];
	module.exports = Brush;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Created by Peter Atoria @ http://iAtoria.com
	
	  var inits = 'class interface function package';
	
	  var keywords = '-Infinity ...rest Array as AS3 Boolean break case catch const continue Date decodeURI ' + 'decodeURIComponent default delete do dynamic each else encodeURI encodeURIComponent escape ' + 'extends false final finally flash_proxy for get if implements import in include Infinity ' + 'instanceof int internal is isFinite isNaN isXMLName label namespace NaN native new null ' + 'Null Number Object object_proxy override parseFloat parseInt private protected public ' + 'return set static String super switch this throw true try typeof uint undefined unescape ' + 'use void while with';
	
	  this.regexList = [{
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi,
	    css: 'value'
	  }, {
	    regex: new RegExp(this.getKeywords(inits), 'gm'),
	    css: 'color3'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp('var', 'gm'),
	    css: 'variable'
	  }, {
	    regex: new RegExp('trace', 'gm'),
	    css: 'color1'
	  }];
	
	  this.forHtmlScript(regexLib.scriptScriptTags);
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['actionscript3', 'as3'];
	module.exports = Brush;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	var XRegExp = __webpack_require__(3).XRegExp;
	var Match = __webpack_require__(5).Match;
	
	function Brush() {
	  function hereDocProcess(match, regexInfo) {
	    var result = [];
	
	    if (match.here_doc != null) result.push(new Match(match.here_doc, match.index + match[0].indexOf(match.here_doc), 'string'));
	
	    if (match.full_tag != null) result.push(new Match(match.full_tag, match.index, 'preprocessor'));
	
	    if (match.end_tag != null) result.push(new Match(match.end_tag, match.index + match[0].lastIndexOf(match.end_tag), 'preprocessor'));
	
	    return result;
	  }
	
	  var keywords = 'if fi then elif else for do done until while break continue case esac function return in eq ne ge le';
	  var commands = 'alias apropos awk basename base64 bash bc bg builtin bunzip2 bzcat bzip2 bzip2recover cal cat cd cfdisk chgrp chmod chown chroot' + 'cksum clear cmp comm command cp cron crontab crypt csplit cut date dc dd ddrescue declare df ' + 'diff diff3 dig dir dircolors dirname dirs du echo egrep eject enable env ethtool eval ' + 'exec exit expand export expr false fdformat fdisk fg fgrep file find fmt fold format ' + 'free fsck ftp gawk gcc gdb getconf getopts grep groups gunzip gzcat gzip hash head history hostname id ifconfig ' + 'import install join kill less let ln local locate logname logout look lpc lpr lprint ' + 'lprintd lprintq lprm ls lsof make man mkdir mkfifo mkisofs mknod more mount mtools ' + 'mv nasm nc ndisasm netstat nice nl nohup nslookup objdump od open op passwd paste pathchk ping popd pr printcap ' + 'printenv printf ps pushd pwd quota quotacheck quotactl ram rcp read readonly renice ' + 'remsync rm rmdir rsync screen scp sdiff sed select seq set sftp shift shopt shutdown ' + 'sleep sort source split ssh strace strings su sudo sum symlink sync tail tar tee test time ' + 'times touch top traceroute trap tr true tsort tty type ulimit umask umount unalias ' + 'uname unexpand uniq units unset unshar useradd usermod users uuencode uudecode v vdir ' + 'vi watch wc whereis which who whoami Wget xargs xxd yes chsh zcat';
	
	  this.regexList = [{
	    regex: /^#!.*$/gm,
	    css: 'preprocessor bold'
	  }, {
	    regex: /\/[\w-\/]+/gm,
	    css: 'plain'
	  }, {
	    regex: regexLib.singleLinePerlComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp(this.getKeywords(commands), 'gm'),
	    css: 'functions'
	  }, {
	    regex: new XRegExp("(?<full_tag>(&lt;|<){2}(?<tag>\\w+)) .*$(?<here_doc>[\\s\\S]*)(?<end_tag>^\\k<tag>$)", 'gm'),
	    func: hereDocProcess
	  }];
	}
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['bash', 'shell', 'sh'];
	module.exports = Brush;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Contributed by Jen
	  // http://www.jensbits.com/2009/05/14/coldfusion-brush-for-syntaxhighlighter-plus
	
	  var funcs = 'Abs ACos AddSOAPRequestHeader AddSOAPResponseHeader AjaxLink AjaxOnLoad ArrayAppend ArrayAvg ArrayClear ArrayDeleteAt ' + 'ArrayInsertAt ArrayIsDefined ArrayIsEmpty ArrayLen ArrayMax ArrayMin ArraySet ArraySort ArraySum ArraySwap ArrayToList ' + 'Asc ASin Atn BinaryDecode BinaryEncode BitAnd BitMaskClear BitMaskRead BitMaskSet BitNot BitOr BitSHLN BitSHRN BitXor ' + 'Ceiling CharsetDecode CharsetEncode Chr CJustify Compare CompareNoCase Cos CreateDate CreateDateTime CreateObject ' + 'CreateODBCDate CreateODBCDateTime CreateODBCTime CreateTime CreateTimeSpan CreateUUID DateAdd DateCompare DateConvert ' + 'DateDiff DateFormat DatePart Day DayOfWeek DayOfWeekAsString DayOfYear DaysInMonth DaysInYear DE DecimalFormat DecrementValue ' + 'Decrypt DecryptBinary DeleteClientVariable DeserializeJSON DirectoryExists DollarFormat DotNetToCFType Duplicate Encrypt ' + 'EncryptBinary Evaluate Exp ExpandPath FileClose FileCopy FileDelete FileExists FileIsEOF FileMove FileOpen FileRead ' + 'FileReadBinary FileReadLine FileSetAccessMode FileSetAttribute FileSetLastModified FileWrite Find FindNoCase FindOneOf ' + 'FirstDayOfMonth Fix FormatBaseN GenerateSecretKey GetAuthUser GetBaseTagData GetBaseTagList GetBaseTemplatePath ' + 'GetClientVariablesList GetComponentMetaData GetContextRoot GetCurrentTemplatePath GetDirectoryFromPath GetEncoding ' + 'GetException GetFileFromPath GetFileInfo GetFunctionList GetGatewayHelper GetHttpRequestData GetHttpTimeString ' + 'GetK2ServerDocCount GetK2ServerDocCountLimit GetLocale GetLocaleDisplayName GetLocalHostIP GetMetaData GetMetricData ' + 'GetPageContext GetPrinterInfo GetProfileSections GetProfileString GetReadableImageFormats GetSOAPRequest GetSOAPRequestHeader ' + 'GetSOAPResponse GetSOAPResponseHeader GetTempDirectory GetTempFile GetTemplatePath GetTickCount GetTimeZoneInfo GetToken ' + 'GetUserRoles GetWriteableImageFormats Hash Hour HTMLCodeFormat HTMLEditFormat IIf ImageAddBorder ImageBlur ImageClearRect ' + 'ImageCopy ImageCrop ImageDrawArc ImageDrawBeveledRect ImageDrawCubicCurve ImageDrawLine ImageDrawLines ImageDrawOval ' + 'ImageDrawPoint ImageDrawQuadraticCurve ImageDrawRect ImageDrawRoundRect ImageDrawText ImageFlip ImageGetBlob ImageGetBufferedImage ' + 'ImageGetEXIFTag ImageGetHeight ImageGetIPTCTag ImageGetWidth ImageGrayscale ImageInfo ImageNegative ImageNew ImageOverlay ImagePaste ' + 'ImageRead ImageReadBase64 ImageResize ImageRotate ImageRotateDrawingAxis ImageScaleToFit ImageSetAntialiasing ImageSetBackgroundColor ' + 'ImageSetDrawingColor ImageSetDrawingStroke ImageSetDrawingTransparency ImageSharpen ImageShear ImageShearDrawingAxis ImageTranslate ' + 'ImageTranslateDrawingAxis ImageWrite ImageWriteBase64 ImageXORDrawingMode IncrementValue InputBaseN Insert Int IsArray IsBinary ' + 'IsBoolean IsCustomFunction IsDate IsDDX IsDebugMode IsDefined IsImage IsImageFile IsInstanceOf IsJSON IsLeapYear IsLocalHost ' + 'IsNumeric IsNumericDate IsObject IsPDFFile IsPDFObject IsQuery IsSimpleValue IsSOAPRequest IsStruct IsUserInAnyRole IsUserInRole ' + 'IsUserLoggedIn IsValid IsWDDX IsXML IsXmlAttribute IsXmlDoc IsXmlElem IsXmlNode IsXmlRoot JavaCast JSStringFormat LCase Left Len ' + 'ListAppend ListChangeDelims ListContains ListContainsNoCase ListDeleteAt ListFind ListFindNoCase ListFirst ListGetAt ListInsertAt ' + 'ListLast ListLen ListPrepend ListQualify ListRest ListSetAt ListSort ListToArray ListValueCount ListValueCountNoCase LJustify Log ' + 'Log10 LSCurrencyFormat LSDateFormat LSEuroCurrencyFormat LSIsCurrency LSIsDate LSIsNumeric LSNumberFormat LSParseCurrency LSParseDateTime ' + 'LSParseEuroCurrency LSParseNumber LSTimeFormat LTrim Max Mid Min Minute Month MonthAsString Now NumberFormat ParagraphFormat ParseDateTime ' + 'Pi PrecisionEvaluate PreserveSingleQuotes Quarter QueryAddColumn QueryAddRow QueryConvertForGrid QueryNew QuerySetCell QuotedValueList Rand ' + 'Randomize RandRange REFind REFindNoCase ReleaseComObject REMatch REMatchNoCase RemoveChars RepeatString Replace ReplaceList ReplaceNoCase ' + 'REReplace REReplaceNoCase Reverse Right RJustify Round RTrim Second SendGatewayMessage SerializeJSON SetEncoding SetLocale SetProfileString ' + 'SetVariable Sgn Sin Sleep SpanExcluding SpanIncluding Sqr StripCR StructAppend StructClear StructCopy StructCount StructDelete StructFind ' + 'StructFindKey StructFindValue StructGet StructInsert StructIsEmpty StructKeyArray StructKeyExists StructKeyList StructKeyList StructNew ' + 'StructSort StructUpdate Tan TimeFormat ToBase64 ToBinary ToScript ToString Trim UCase URLDecode URLEncodedFormat URLSessionFormat Val ' + 'ValueList VerifyClient Week Wrap Wrap WriteOutput XmlChildPos XmlElemNew XmlFormat XmlGetNodeType XmlNew XmlParse XmlSearch XmlTransform ' + 'XmlValidate Year YesNoFormat';
	
	  var keywords = 'cfabort cfajaximport cfajaxproxy cfapplet cfapplication cfargument cfassociate cfbreak cfcache cfcalendar ' + 'cfcase cfcatch cfchart cfchartdata cfchartseries cfcol cfcollection cfcomponent cfcontent cfcookie cfdbinfo ' + 'cfdefaultcase cfdirectory cfdiv cfdocument cfdocumentitem cfdocumentsection cfdump cfelse cfelseif cferror ' + 'cfexchangecalendar cfexchangeconnection cfexchangecontact cfexchangefilter cfexchangemail cfexchangetask ' + 'cfexecute cfexit cffeed cffile cfflush cfform cfformgroup cfformitem cfftp cffunction cfgrid cfgridcolumn ' + 'cfgridrow cfgridupdate cfheader cfhtmlhead cfhttp cfhttpparam cfif cfimage cfimport cfinclude cfindex ' + 'cfinput cfinsert cfinterface cfinvoke cfinvokeargument cflayout cflayoutarea cfldap cflocation cflock cflog ' + 'cflogin cfloginuser cflogout cfloop cfmail cfmailparam cfmailpart cfmenu cfmenuitem cfmodule cfNTauthenticate ' + 'cfobject cfobjectcache cfoutput cfparam cfpdf cfpdfform cfpdfformparam cfpdfparam cfpdfsubform cfpod cfpop ' + 'cfpresentation cfpresentationslide cfpresenter cfprint cfprocessingdirective cfprocparam cfprocresult ' + 'cfproperty cfquery cfqueryparam cfregistry cfreport cfreportparam cfrethrow cfreturn cfsavecontent cfschedule ' + 'cfscript cfsearch cfselect cfset cfsetting cfsilent cfslider cfsprydataset cfstoredproc cfswitch cftable ' + 'cftextarea cfthread cfthrow cftimer cftooltip cftrace cftransaction cftree cftreeitem cftry cfupdate cfwddx ' + 'cfwindow cfxml cfzip cfzipparam';
	
	  var operators = 'all and any between cross in join like not null or outer some';
	
	  this.regexList = [{
	    regex: new RegExp('--(.*)$', 'gm'),
	    css: 'comments'
	  }, {
	    regex: regexLib.xmlComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: new RegExp(this.getKeywords(funcs), 'gmi'),
	    css: 'functions'
	  }, {
	    regex: new RegExp(this.getKeywords(operators), 'gmi'),
	    css: 'color1'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gmi'),
	    css: 'keyword'
	  }];
	}
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['coldfusion', 'cf'];
	module.exports = Brush;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Copyright 2006 Shin, YoungJin
	
	  var datatypes = 'ATOM BOOL BOOLEAN BYTE CHAR COLORREF DWORD DWORDLONG DWORD_PTR ' + 'DWORD32 DWORD64 FLOAT HACCEL HALF_PTR HANDLE HBITMAP HBRUSH ' + 'HCOLORSPACE HCONV HCONVLIST HCURSOR HDC HDDEDATA HDESK HDROP HDWP ' + 'HENHMETAFILE HFILE HFONT HGDIOBJ HGLOBAL HHOOK HICON HINSTANCE HKEY ' + 'HKL HLOCAL HMENU HMETAFILE HMODULE HMONITOR HPALETTE HPEN HRESULT ' + 'HRGN HRSRC HSZ HWINSTA HWND INT INT_PTR INT32 INT64 LANGID LCID LCTYPE ' + 'LGRPID LONG LONGLONG LONG_PTR LONG32 LONG64 LPARAM LPBOOL LPBYTE LPCOLORREF ' + 'LPCSTR LPCTSTR LPCVOID LPCWSTR LPDWORD LPHANDLE LPINT LPLONG LPSTR LPTSTR ' + 'LPVOID LPWORD LPWSTR LRESULT PBOOL PBOOLEAN PBYTE PCHAR PCSTR PCTSTR PCWSTR ' + 'PDWORDLONG PDWORD_PTR PDWORD32 PDWORD64 PFLOAT PHALF_PTR PHANDLE PHKEY PINT ' + 'PINT_PTR PINT32 PINT64 PLCID PLONG PLONGLONG PLONG_PTR PLONG32 PLONG64 POINTER_32 ' + 'POINTER_64 PSHORT PSIZE_T PSSIZE_T PSTR PTBYTE PTCHAR PTSTR PUCHAR PUHALF_PTR ' + 'PUINT PUINT_PTR PUINT32 PUINT64 PULONG PULONGLONG PULONG_PTR PULONG32 PULONG64 ' + 'PUSHORT PVOID PWCHAR PWORD PWSTR SC_HANDLE SC_LOCK SERVICE_STATUS_HANDLE SHORT ' + 'SIZE_T SSIZE_T TBYTE TCHAR UCHAR UHALF_PTR UINT UINT_PTR UINT32 UINT64 ULONG ' + 'ULONGLONG ULONG_PTR ULONG32 ULONG64 USHORT USN VOID WCHAR WORD WPARAM WPARAM WPARAM ' + 'char char16_t char32_t bool short int __int32 __int64 __int8 __int16 long float double __wchar_t ' + 'clock_t _complex _dev_t _diskfree_t div_t ldiv_t _exception _EXCEPTION_POINTERS ' + 'FILE _finddata_t _finddatai64_t _wfinddata_t _wfinddatai64_t __finddata64_t ' + '__wfinddata64_t _FPIEEE_RECORD fpos_t _HEAPINFO _HFILE lconv intptr_t ' + 'jmp_buf mbstate_t _off_t _onexit_t _PNH ptrdiff_t _purecall_handler ' + 'sig_atomic_t size_t _stat __stat64 _stati64 terminate_function ' + 'time_t __time64_t _timeb __timeb64 tm uintptr_t _utimbuf ' + 'va_list wchar_t wctrans_t wctype_t wint_t signed';
	
	  var keywords = 'alignas alignof auto break case catch class const constexpr decltype __finally __exception __try ' + 'const_cast continue private public protected __declspec ' + 'default delete deprecated dllexport dllimport do dynamic_cast ' + 'else enum explicit extern if for friend goto inline ' + 'mutable naked namespace new noinline noreturn nothrow noexcept nullptr ' + 'register reinterpret_cast return selectany ' + 'sizeof static static_cast static_assert struct switch template this ' + 'thread thread_local throw true false try typedef typeid typename union ' + 'using uuid virtual void volatile whcar_t while';
	
	  var functions = 'assert isalnum isalpha iscntrl isdigit isgraph islower isprint ' + 'ispunct isspace isupper isxdigit tolower toupper errno localeconv ' + 'setlocale acos asin atan atan2 ceil cos cosh exp fabs floor fmod ' + 'frexp ldexp log log10 modf pow sin sinh sqrt tan tanh jmp_buf ' + 'longjmp setjmp raise signal sig_atomic_t va_arg va_end va_start ' + 'clearerr fclose feof ferror fflush fgetc fgetpos fgets fopen ' + 'fprintf fputc fputs fread freopen fscanf fseek fsetpos ftell ' + 'fwrite getc getchar gets perror printf putc putchar puts remove ' + 'rename rewind scanf setbuf setvbuf sprintf sscanf tmpfile tmpnam ' + 'ungetc vfprintf vprintf vsprintf abort abs atexit atof atoi atol ' + 'bsearch calloc div exit free getenv labs ldiv malloc mblen mbstowcs ' + 'mbtowc qsort rand realloc srand strtod strtol strtoul system ' + 'wcstombs wctomb memchr memcmp memcpy memmove memset strcat strchr ' + 'strcmp strcoll strcpy strcspn strerror strlen strncat strncmp ' + 'strncpy strpbrk strrchr strspn strstr strtok strxfrm asctime ' + 'clock ctime difftime gmtime localtime mktime strftime time';
	
	  this.regexList = [{
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /^ *#.*/gm,
	    css: 'preprocessor'
	  }, {
	    regex: new RegExp(this.getKeywords(datatypes), 'gm'),
	    css: 'color1 bold'
	  }, {
	    regex: new RegExp(this.getKeywords(functions), 'gm'),
	    css: 'functions bold'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword bold'
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['cpp', 'cc', 'c++', 'c', 'h', 'hpp', 'h++'];
	module.exports = Brush;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	var Match = __webpack_require__(5).Match;
	
	function Brush() {
	  var keywords = 'abstract as base bool break byte case catch char checked class const ' + 'continue decimal default delegate do double else enum event explicit volatile ' + 'extern false finally fixed float for foreach get goto if implicit in int ' + 'interface internal is lock long namespace new null object operator out ' + 'override params private protected public readonly ref return sbyte sealed set ' + 'short sizeof stackalloc static string struct switch this throw true try ' + 'typeof uint ulong unchecked unsafe ushort using virtual void while var ' + 'from group by into select let where orderby join on equals ascending descending';
	
	  function fixComments(match, regexInfo) {
	    var css = match[0].indexOf("///") == 0 ? 'color1' : 'comments';
	    return [new Match(match[0], match.index, css)];
	  }
	
	  this.regexList = [{
	    regex: regexLib.singleLineCComments,
	    func: fixComments
	  }, {
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: /@"(?:[^"]|"")*"/g,
	    css: 'string'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /^\s*#.*/gm,
	    css: 'preprocessor'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: /\bpartial(?=\s+(?:class|interface|struct)\b)/g,
	    css: 'keyword'
	  }, {
	    regex: /\byield(?=\s+(?:return|break)\b)/g,
	    css: 'keyword'
	  }];
	
	  this.forHtmlScript(regexLib.aspScriptTags);
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['c#', 'c-sharp', 'csharp'];
	module.exports = Brush;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  function getKeywordsCSS(str) {
	    return '\\b([a-z_]|)' + str.replace(/ /g, '(?=:)\\b|\\b([a-z_\\*]|\\*|)') + '(?=:)\\b';
	  };
	
	  function getValuesCSS(str) {
	    return '\\b' + str.replace(/ /g, '(?!-)(?!:)\\b|\\b()') + '\:\\b';
	  };
	
	  var keywords = 'ascent azimuth background-attachment background-color background-image background-position ' + 'background-repeat background baseline bbox border-collapse border-color border-spacing border-style border-top ' + 'border-right border-bottom border-left border-top-color border-right-color border-bottom-color border-left-color ' + 'border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width ' + 'border-bottom-width border-left-width border-width border bottom cap-height caption-side centerline clear clip color ' + 'content counter-increment counter-reset cue-after cue-before cue cursor definition-src descent direction display ' + 'elevation empty-cells float font-size-adjust font-family font-size font-stretch font-style font-variant font-weight font ' + 'height left letter-spacing line-height list-style-image list-style-position list-style-type list-style margin-top ' + 'margin-right margin-bottom margin-left margin marker-offset marks mathline max-height max-width min-height min-width orphans ' + 'outline-color outline-style outline-width outline overflow padding-top padding-right padding-bottom padding-left padding page ' + 'page-break-after page-break-before page-break-inside pause pause-after pause-before pitch pitch-range play-during position ' + 'quotes right richness size slope src speak-header speak-numeral speak-punctuation speak speech-rate stemh stemv stress ' + 'table-layout text-align top text-decoration text-indent text-shadow text-transform unicode-bidi unicode-range units-per-em ' + 'vertical-align visibility voice-family volume white-space widows width widths word-spacing x-height z-index';
	
	  var values = 'above absolute all always aqua armenian attr aural auto avoid baseline behind below bidi-override black blink block blue bold bolder ' + 'both bottom braille capitalize caption center center-left center-right circle close-quote code collapse compact condensed ' + 'continuous counter counters crop cross crosshair cursive dashed decimal decimal-leading-zero default digits disc dotted double ' + 'embed embossed e-resize expanded extra-condensed extra-expanded fantasy far-left far-right fast faster fixed format fuchsia ' + 'gray green groove handheld hebrew help hidden hide high higher icon inline-table inline inset inside invert italic ' + 'justify landscape large larger left-side left leftwards level lighter lime line-through list-item local loud lower-alpha ' + 'lowercase lower-greek lower-latin lower-roman lower low ltr marker maroon medium message-box middle mix move narrower ' + 'navy ne-resize no-close-quote none no-open-quote no-repeat normal nowrap n-resize nw-resize oblique olive once open-quote outset ' + 'outside overline pointer portrait pre print projection purple red relative repeat repeat-x repeat-y rgb ridge right right-side ' + 'rightwards rtl run-in screen scroll semi-condensed semi-expanded separate se-resize show silent silver slower slow ' + 'small small-caps small-caption smaller soft solid speech spell-out square s-resize static status-bar sub super sw-resize ' + 'table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group teal ' + 'text-bottom text-top thick thin top transparent tty tv ultra-condensed ultra-expanded underline upper-alpha uppercase upper-latin ' + 'upper-roman url visible wait white wider w-resize x-fast x-high x-large x-loud x-low x-slow x-small x-soft xx-large xx-small yellow';
	
	  var fonts = '[mM]onospace [tT]ahoma [vV]erdana [aA]rial [hH]elvetica [sS]ans-serif [sS]erif [cC]ourier mono sans serif';
	
	  this.regexList = [{
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /\#[a-fA-F0-9]{3,6}/g,
	    css: 'value'
	  }, {
	    regex: /(-?\d+)(\.\d+)?(px|em|pt|\:|\%|)/g,
	    css: 'value'
	  }, {
	    regex: /!important/g,
	    css: 'color3'
	  }, {
	    regex: new RegExp(getKeywordsCSS(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp(getValuesCSS(values), 'g'),
	    css: 'value'
	  }, {
	    regex: new RegExp(this.getKeywords(fonts), 'g'),
	    css: 'color1'
	  }];
	
	  this.forHtmlScript({
	    left: /(&lt;|<)\s*style.*?(&gt;|>)/gi,
	    right: /(&lt;|<)\/\s*style\s*(&gt;|>)/gi
	  });
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['css'];
	module.exports = Brush;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  var keywords = 'abs addr and ansichar ansistring array as asm begin boolean byte cardinal ' + 'case char class comp const constructor currency destructor div do double ' + 'downto else end except exports extended false file finalization finally ' + 'for function goto if implementation in inherited int64 initialization ' + 'integer interface is label library longint longword mod nil not object ' + 'of on or packed pansichar pansistring pchar pcurrency pdatetime pextended ' + 'pint64 pointer private procedure program property pshortstring pstring ' + 'pvariant pwidechar pwidestring protected public published raise real real48 ' + 'record repeat set shl shortint shortstring shr single smallint string then ' + 'threadvar to true try type unit until uses val var varirnt while widechar ' + 'widestring with word write writeln xor';
	
	  this.regexList = [{
	    regex: /\(\*[\s\S]*?\*\)/gm,
	    css: 'comments'
	  }, {
	    regex: /{(?!\$)[\s\S]*?}/gm,
	    css: 'comments'
	  }, {
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /\{\$[a-zA-Z]+ .+\}/g,
	    css: 'color1'
	  }, {
	    regex: /\b[\d\.]+\b/g,
	    css: 'value'
	  }, {
	    regex: /\$[a-zA-Z0-9]+\b/g,
	    css: 'value'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gmi'),
	    css: 'keyword'
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['delphi', 'pascal', 'pas'];
	module.exports = Brush;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  this.regexList = [{
	    regex: /^\+\+\+ .*$/gm,
	    css: 'color2'
	  }, {
	    regex: /^\-\-\- .*$/gm,
	    css: 'color2'
	  }, {
	    regex: /^\s.*$/gm,
	    css: 'color1'
	  }, {
	    regex: /^@@.*@@.*$/gm,
	    css: 'variable'
	  }, {
	    regex: /^\+.*$/gm,
	    css: 'string'
	  }, {
	    regex: /^\-.*$/gm,
	    css: 'color3'
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['diff', 'patch'];
	module.exports = Brush;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Contributed by Jean-Lou Dupont
	  // http://jldupont.blogspot.com/2009/06/erlang-syntax-highlighter.html
	
	  // According to: http://erlang.org/doc/reference_manual/introduction.html#1.5
	  var keywords = 'after and andalso band begin bnot bor bsl bsr bxor ' + 'case catch cond div end fun if let not of or orelse ' + 'query receive rem try when xor' +
	  // additional
	  ' module export import define';
	
	  this.regexList = [{
	    regex: new RegExp("[A-Z][A-Za-z0-9_]+", 'g'),
	    css: 'constants'
	  }, {
	    regex: new RegExp("\\%.+", 'gm'),
	    css: 'comments'
	  }, {
	    regex: new RegExp("\\?[A-Za-z0-9_]+", 'g'),
	    css: 'preprocessor'
	  }, {
	    regex: new RegExp("[a-z0-9_]+:[a-z0-9_]+", 'g'),
	    css: 'functions'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['erl', 'erlang'];
	module.exports = Brush;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Contributed by Andres Almiray
	  // http://jroller.com/aalmiray/entry/nice_source_code_syntax_highlighter
	
	  var keywords = 'as assert break case catch class continue def default do else extends finally ' + 'if in implements import instanceof interface new package property return switch ' + 'throw throws try while public protected private static';
	  var types = 'void boolean byte char short int long float double';
	  var constants = 'null';
	  var methods = 'allProperties count get size ' + 'collect each eachProperty eachPropertyName eachWithIndex find findAll ' + 'findIndexOf grep inject max min reverseEach sort ' + 'asImmutable asSynchronized flatten intersect join pop reverse subMap toList ' + 'padRight padLeft contains eachMatch toCharacter toLong toUrl tokenize ' + 'eachFile eachFileRecurse eachB yte eachLine readBytes readLine getText ' + 'splitEachLine withReader append encodeBase64 decodeBase64 filterLine ' + 'transformChar transformLine withOutputStream withPrintWriter withStream ' + 'withStreams withWriter withWriterAppend write writeLine ' + 'dump inspect invokeMethod print println step times upto use waitForOrKill ' + 'getText';
	
	  this.regexList = [{
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /""".*"""/g,
	    css: 'string'
	  }, {
	    regex: new RegExp('\\b([\\d]+(\\.[\\d]+)?|0x[a-f0-9]+)\\b', 'gi'),
	    css: 'value'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp(this.getKeywords(types), 'gm'),
	    css: 'color1'
	  }, {
	    regex: new RegExp(this.getKeywords(constants), 'gm'),
	    css: 'constants'
	  }, {
	    regex: new RegExp(this.getKeywords(methods), 'gm'),
	    css: 'functions'
	  }];
	
	  this.forHtmlScript(regexLib.aspScriptTags);
	}
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['groovy'];
	module.exports = Brush;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	
	  var inits = 'class interface package macro enum typedef extends implements dynamic in for if while else do try switch case catch';
	
	  var keywords = 'return break continue new throw cast using import function public private inline static untyped callback true false null Int Float String Void Std Bool Dynamic Array Vector';
	
	  this.regexList = [{
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi,
	    css: 'value'
	  }, {
	    regex: new RegExp(this.getKeywords(inits), 'gm'),
	    css: 'color3'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp('var', 'gm'),
	    css: 'variable'
	  }, {
	    regex: new RegExp('trace', 'gm'),
	    css: 'color1'
	  }, {
	    regex: new RegExp('#if', 'gm'),
	    css: 'comments'
	  }, {
	    regex: new RegExp('#elseif', 'gm'),
	    css: 'comments'
	  }, {
	    regex: new RegExp('#end', 'gm'),
	    css: 'comments'
	  }, {
	    regex: new RegExp('#error', 'gm'),
	    css: 'comments'
	  }];
	
	  //standard compiler conditionals flags
	  var flags = ["debug", "error", "cpp", "js", "neko", "php", "flash", "flash8", "flash9", "flash10", "flash10", "mobile", "desktop", "web", "ios", "android", "iphone"];
	
	  //append the flags to the array with a ! operator
	  var i;
	  var length = flags.length;
	  for (i = 0; i <= length - 1; i++) {
	    this.regexList.push({
	      regex: new RegExp(flags[i], 'gm'),
	      css: 'comments'
	    });
	    this.regexList.push({
	      regex: new RegExp('!' + flags[i], 'gm'),
	      css: 'comments'
	    });
	  }
	
	  this.forHtmlScript(regexLib.scriptScriptTags);
	}
	
	;
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['haxe', 'hx'];
	module.exports = Brush;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  var keywords = 'abstract assert boolean break byte case catch char class const ' + 'continue default do double else enum extends ' + 'false final finally float for goto if implements import ' + 'instanceof int interface long native new null ' + 'package private protected public return ' + 'short static strictfp super switch synchronized this throw throws true ' + 'transient try void volatile while';
	
	  this.regexList = [{
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: /\/\*([^\*][\s\S]*?)?\*\//gm,
	    css: 'comments'
	  }, {
	    regex: /\/\*(?!\*\/)\*[\s\S]*?\*\//gm,
	    css: 'preprocessor'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /\b([\d]+(\.[\d]+)?f?|[\d]+l?|0x[a-f0-9]+)\b/gi,
	    css: 'value'
	  }, {
	    regex: /(?!\@interface\b)\@[\$\w]+\b/g,
	    css: 'color1'
	  }, {
	    regex: /\@interface\b/g,
	    css: 'color2'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }];
	
	  this.forHtmlScript({
	    left: /(&lt;|<)%[@!=]?/g,
	    right: /%(&gt;|>)/g
	  });
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['java'];
	module.exports = Brush;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Contributed by Patrick Webster
	  // http://patrickwebster.blogspot.com/2009/04/javafx-brush-for-syntaxhighlighter.html
	  var datatypes = 'Boolean Byte Character Double Duration ' + 'Float Integer Long Number Short String Void';
	
	  var keywords = 'abstract after and as assert at before bind bound break catch class ' + 'continue def delete else exclusive extends false finally first for from ' + 'function if import in indexof init insert instanceof into inverse last ' + 'lazy mixin mod nativearray new not null on or override package postinit ' + 'protected public public-init public-read replace return reverse sizeof ' + 'step super then this throw true try tween typeof var where while with ' + 'attribute let private readonly static trigger';
	
	  this.regexList = [{
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: /(-?\.?)(\b(\d*\.?\d+|\d+\.?\d*)(e[+-]?\d+)?|0x[a-f\d]+)\b\.?/gi,
	    css: 'color2'
	  }, {
	    regex: new RegExp(this.getKeywords(datatypes), 'gm'),
	    css: 'variable'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }];
	  this.forHtmlScript(regexLib.aspScriptTags);
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['jfx', 'javafx'];
	module.exports = Brush;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  var keywords = 'break case catch class continue ' + 'default delete do else enum export extends false  ' + 'for from as function if implements import in instanceof ' + 'interface let new null package private protected ' + 'static return super switch ' + 'this throw true try typeof var while with yield';
	
	  this.regexList = [{
	    regex: regexLib.multiLineDoubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.multiLineSingleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: /\s*#.*/gm,
	    css: 'preprocessor'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }];
	
	  this.forHtmlScript(regexLib.scriptScriptTags);
	}
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['js', 'jscript', 'javascript', 'json'];
	module.exports = Brush;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Contributed by David Simmons-Duffin and Marty Kube
	
	  var funcs = 'abs accept alarm atan2 bind binmode chdir chmod chomp chop chown chr ' + 'chroot close closedir connect cos crypt defined delete each endgrent ' + 'endhostent endnetent endprotoent endpwent endservent eof exec exists ' + 'exp fcntl fileno flock fork format formline getc getgrent getgrgid ' + 'getgrnam gethostbyaddr gethostbyname gethostent getlogin getnetbyaddr ' + 'getnetbyname getnetent getpeername getpgrp getppid getpriority ' + 'getprotobyname getprotobynumber getprotoent getpwent getpwnam getpwuid ' + 'getservbyname getservbyport getservent getsockname getsockopt glob ' + 'gmtime grep hex index int ioctl join keys kill lc lcfirst length link ' + 'listen localtime lock log lstat map mkdir msgctl msgget msgrcv msgsnd ' + 'oct open opendir ord pack pipe pop pos print printf prototype push ' + 'quotemeta rand read readdir readline readlink readpipe recv rename ' + 'reset reverse rewinddir rindex rmdir scalar seek seekdir select semctl ' + 'semget semop send setgrent sethostent setnetent setpgrp setpriority ' + 'setprotoent setpwent setservent setsockopt shift shmctl shmget shmread ' + 'shmwrite shutdown sin sleep socket socketpair sort splice split sprintf ' + 'sqrt srand stat study substr symlink syscall sysopen sysread sysseek ' + 'system syswrite tell telldir time times tr truncate uc ucfirst umask ' + 'undef unlink unpack unshift utime values vec wait waitpid warn write ' +
	  // feature
	  'say';
	
	  var keywords = 'bless caller continue dbmclose dbmopen die do dump else elsif eval exit ' + 'for foreach goto if import last local my next no our package redo ref ' + 'require return sub tie tied unless untie until use wantarray while ' +
	  // feature
	  'given when default ' +
	  // Try::Tiny
	  'try catch finally ' +
	  // Moose
	  'has extends with before after around override augment';
	
	  this.regexList = [{
	    regex: /(<<|&lt;&lt;)((\w+)|(['"])(.+?)\4)[\s\S]+?\n\3\5\n/g,
	    css: 'string'
	  }, {
	    regex: /#.*$/gm,
	    css: 'comments'
	  }, {
	    regex: /^#!.*\n/g,
	    css: 'preprocessor'
	  }, {
	    regex: /-?\w+(?=\s*=(>|&gt;))/g,
	    css: 'string'
	  },
	
	  // is this too much?
	  {
	    regex: /\bq[qwxr]?\([\s\S]*?\)/g,
	    css: 'string'
	  }, {
	    regex: /\bq[qwxr]?\{[\s\S]*?\}/g,
	    css: 'string'
	  }, {
	    regex: /\bq[qwxr]?\[[\s\S]*?\]/g,
	    css: 'string'
	  }, {
	    regex: /\bq[qwxr]?(<|&lt;)[\s\S]*?(>|&gt;)/g,
	    css: 'string'
	  }, {
	    regex: /\bq[qwxr]?([^\w({<[])[\s\S]*?\1/g,
	    css: 'string'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /(?:&amp;|[$@%*]|\$#)\$?[a-zA-Z_](\w+|::)*/g,
	    css: 'variable'
	  }, {
	    regex: /\b__(?:END|DATA)__\b[\s\S]*$/g,
	    css: 'comments'
	  }, {
	    regex: /(^|\n)=\w[\s\S]*?(\n=cut\s*(?=\n)|$)/g,
	    css: 'comments'
	  }, {
	    regex: new RegExp(this.getKeywords(funcs), 'gm'),
	    css: 'functions'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }];
	
	  this.forHtmlScript(regexLib.phpScriptTags);
	}
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['perl', 'Perl', 'pl'];
	module.exports = Brush;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _brushBase = __webpack_require__(22);
	
	var _brushBase2 = _interopRequireDefault(_brushBase);
	
	var _syntaxhighlighterRegex = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var functions = 'abs acos acosh addcslashes addslashes ' + 'array_change_key_case array_chunk array_combine array_count_values array_diff ' + 'array_diff_assoc array_diff_key array_diff_uassoc array_diff_ukey array_fill ' + 'array_filter array_flip array_intersect array_intersect_assoc array_intersect_key ' + 'array_intersect_uassoc array_intersect_ukey array_key_exists array_keys array_map ' + 'array_merge array_merge_recursive array_multisort array_pad array_pop array_product ' + 'array_push array_rand array_reduce array_reverse array_search array_shift ' + 'array_slice array_splice array_sum array_udiff array_udiff_assoc ' + 'array_udiff_uassoc array_uintersect array_uintersect_assoc ' + 'array_uintersect_uassoc array_unique array_unshift array_values array_walk ' + 'array_walk_recursive atan atan2 atanh base64_decode base64_encode base_convert ' + 'basename bcadd bccomp bcdiv bcmod bcmul bindec bindtextdomain bzclose bzcompress ' + 'bzdecompress bzerrno bzerror bzerrstr bzflush bzopen bzread bzwrite ceil chdir ' + 'checkdate checkdnsrr chgrp chmod chop chown chr chroot chunk_split class_exists ' + 'closedir closelog copy cos cosh count count_chars date decbin dechex decoct ' + 'deg2rad delete ebcdic2ascii echo empty end ereg ereg_replace eregi eregi_replace error_log ' + 'error_reporting escapeshellarg escapeshellcmd eval exec exit exp explode extension_loaded ' + 'feof fflush fgetc fgetcsv fgets fgetss file_exists file_get_contents file_put_contents ' + 'fileatime filectime filegroup fileinode filemtime fileowner fileperms filesize filetype ' + 'floatval flock floor flush fmod fnmatch fopen fpassthru fprintf fputcsv fputs fread fscanf ' + 'fseek fsockopen fstat ftell ftok getallheaders getcwd getdate getenv gethostbyaddr gethostbyname ' + 'gethostbynamel getimagesize getlastmod getmxrr getmygid getmyinode getmypid getmyuid getopt ' + 'getprotobyname getprotobynumber getrandmax getrusage getservbyname getservbyport gettext ' + 'gettimeofday gettype glob gmdate gmmktime ini_alter ini_get ini_get_all ini_restore ini_set ' + 'interface_exists intval ip2long is_a is_array is_bool is_callable is_dir is_double ' + 'is_executable is_file is_finite is_float is_infinite is_int is_integer is_link is_long ' + 'is_nan is_null is_numeric is_object is_readable is_real is_resource is_scalar is_soap_fault ' + 'is_string is_subclass_of is_uploaded_file is_writable is_writeable mkdir mktime nl2br ' + 'parse_ini_file parse_str parse_url passthru pathinfo print readlink realpath rewind rewinddir rmdir ' + 'round str_ireplace str_pad str_repeat str_replace str_rot13 str_shuffle str_split ' + 'str_word_count strcasecmp strchr strcmp strcoll strcspn strftime strip_tags stripcslashes ' + 'stripos stripslashes stristr strlen strnatcasecmp strnatcmp strncasecmp strncmp strpbrk ' + 'strpos strptime strrchr strrev strripos strrpos strspn strstr strtok strtolower strtotime ' + 'strtoupper strtr strval substr substr_compare';
	
	var keywords = 'abstract and array as break case catch cfunction class clone const continue declare default die do ' + 'else elseif enddeclare endfor endforeach endif endswitch endwhile extends final finally for foreach ' + 'function global goto if implements include include_once interface instanceof insteadof namespace new ' + 'old_function or private protected public return require require_once static switch ' + 'trait throw try use const while xor yield ';
	
	var constants = '__FILE__ __LINE__ __METHOD__ __FUNCTION__ __CLASS__';
	
	var Brush = function (_BrushBase) {
	  _inherits(Brush, _BrushBase);
	
	  _createClass(Brush, null, [{
	    key: 'aliases',
	    get: function get() {
	      return ['php'];
	    }
	  }]);
	
	  function Brush() {
	    _classCallCheck(this, Brush);
	
	    var _this = _possibleConstructorReturn(this, (Brush.__proto__ || Object.getPrototypeOf(Brush)).call(this));
	
	    _this.regexList = [{ regex: _syntaxhighlighterRegex.commonRegExp.singleLineCComments, css: 'comments' }, { regex: _syntaxhighlighterRegex.commonRegExp.multiLineCComments, css: 'comments' }, { regex: _syntaxhighlighterRegex.commonRegExp.doubleQuotedString, css: 'string' }, { regex: _syntaxhighlighterRegex.commonRegExp.singleQuotedString, css: 'string' }, { regex: /\$\w+/g, css: 'variable' }, { regex: new RegExp(_this.getKeywords(functions), 'gmi'), css: 'functions' }, { regex: new RegExp(_this.getKeywords(constants), 'gmi'), css: 'constants' }, { regex: new RegExp(_this.getKeywords(keywords), 'gm'), css: 'keyword' }];
	
	    _this.forHtmlScript(_syntaxhighlighterRegex.commonRegExp.phpScriptTags);
	    return _this;
	  }
	
	  return Brush;
	}(_brushBase2.default);
	
	exports.default = Brush;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  this.regexList = [];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['text', 'plain'];
	module.exports = Brush;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Contributed by Joel 'Jaykul' Bennett, http://PoshCode.org | http://HuddledMasses.org
	  var keywords = 'while validateset validaterange validatepattern validatelength validatecount ' + 'until trap switch return ref process param parameter in if global: ' + 'function foreach for finally filter end elseif else dynamicparam do default ' + 'continue cmdletbinding break begin alias \\? % #script #private #local #global ' + 'mandatory parametersetname position valuefrompipeline ' + 'valuefrompipelinebypropertyname valuefromremainingarguments helpmessage ';
	
	  var operators = ' and as band bnot bor bxor casesensitive ccontains ceq cge cgt cle ' + 'clike clt cmatch cne cnotcontains cnotlike cnotmatch contains ' + 'creplace eq exact f file ge gt icontains ieq ige igt ile ilike ilt ' + 'imatch ine inotcontains inotlike inotmatch ireplace is isnot le like ' + 'lt match ne not notcontains notlike notmatch or regex replace wildcard';
	
	  var verbs = 'write where wait use update unregister undo trace test tee take suspend ' + 'stop start split sort skip show set send select scroll resume restore ' + 'restart resolve resize reset rename remove register receive read push ' + 'pop ping out new move measure limit join invoke import group get format ' + 'foreach export expand exit enter enable disconnect disable debug cxnew ' + 'copy convertto convertfrom convert connect complete compare clear ' + 'checkpoint aggregate add';
	
	  // I can't find a way to match the comment based help in multi-line comments, because SH won't highlight in highlights, and javascript doesn't support lookbehind
	  var commenthelp = ' component description example externalhelp forwardhelpcategory forwardhelptargetname forwardhelptargetname functionality inputs link notes outputs parameter remotehelprunspace role synopsis';
	
	  this.regexList = [{
	    regex: new RegExp('^\\s*#[#\\s]*\\.(' + this.getKeywords(commenthelp) + ').*$', 'gim'),
	    css: 'preprocessor help bold'
	  }, {
	    regex: regexLib.singleLinePerlComments,
	    css: 'comments'
	  }, {
	    regex: /(&lt;|<)#[\s\S]*?#(&gt;|>)/gm,
	    css: 'comments here'
	  }, {
	    regex: new RegExp('@"\\n[\\s\\S]*?\\n"@', 'gm'),
	    css: 'script string here'
	  }, {
	    regex: new RegExp("@'\\n[\\s\\S]*?\\n'@", 'gm'),
	    css: 'script string single here'
	  }, {
	    regex: new RegExp('"(?:\\$\\([^\\)]*\\)|[^"]|`"|"")*[^`]"', 'g'),
	    css: 'string'
	  }, {
	    regex: new RegExp("'(?:[^']|'')*'", 'g'),
	    css: 'string single'
	  }, {
	    regex: new RegExp('[\\$|@|@@](?:(?:global|script|private|env):)?[A-Z0-9_]+', 'gi'),
	    css: 'variable'
	  }, {
	    regex: new RegExp('(?:\\b' + verbs.replace(/ /g, '\\b|\\b') + ')-[a-zA-Z_][a-zA-Z0-9_]*', 'gmi'),
	    css: 'functions'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gmi'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp('-' + this.getKeywords(operators), 'gmi'),
	    css: 'operator value'
	  }, {
	    regex: new RegExp('\\[[A-Z_\\[][A-Z0-9_. `,\\[\\]]*\\]', 'gi'),
	    css: 'constants'
	  }, {
	    regex: new RegExp('\\s+-(?!' + this.getKeywords(operators) + ')[a-zA-Z_][a-zA-Z0-9_]*', 'gmi'),
	    css: 'color1'
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['powershell', 'ps', 'posh'];
	module.exports = Brush;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Contributed by Gheorghe Milas and Ahmad Sherif
	
	  var keywords = 'and assert break class continue def del elif else ' + 'except exec finally for from global if import in is ' + 'lambda not or pass raise return try yield while';
	
	  var funcs = '__import__ abs all any apply basestring bin bool buffer callable ' + 'chr classmethod cmp coerce compile complex delattr dict dir ' + 'divmod enumerate eval execfile file filter float format frozenset ' + 'getattr globals hasattr hash help hex id input int intern ' + 'isinstance issubclass iter len list locals long map max min next ' + 'object oct open ord pow print property range raw_input reduce ' + 'reload repr reversed round set setattr slice sorted staticmethod ' + 'str sum super tuple type type unichr unicode vars xrange zip';
	
	  var special = 'None True False self cls class_';
	
	  this.regexList = [{
	    regex: regexLib.singleLinePerlComments,
	    css: 'comments'
	  }, {
	    regex: /^\s*@\w+/gm,
	    css: 'decorator'
	  }, {
	    regex: /(['\"]{3})([^\1])*?\1/gm,
	    css: 'comments'
	  }, {
	    regex: /"(?!")(?:\.|\\\"|[^\""\n])*"/gm,
	    css: 'string'
	  }, {
	    regex: /'(?!')(?:\.|(\\\')|[^\''\n])*'/gm,
	    css: 'string'
	  }, {
	    regex: /\+|\-|\*|\/|\%|=|==/gm,
	    css: 'keyword'
	  }, {
	    regex: /\b\d+\.?\w*/g,
	    css: 'value'
	  }, {
	    regex: new RegExp(this.getKeywords(funcs), 'gmi'),
	    css: 'functions'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp(this.getKeywords(special), 'gm'),
	    css: 'color1'
	  }];
	
	  this.forHtmlScript(regexLib.aspScriptTags);
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['py', 'python'];
	module.exports = Brush;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Contributed by Erik Peterson.
	
	  var keywords = 'alias and BEGIN begin break case class def define_method defined do each else elsif ' + 'END end ensure false for if in module new next nil not or raise redo rescue retry return ' + 'self super then throw true undef unless until when while yield';
	
	  var builtins = 'Array Bignum Binding Class Continuation Dir Exception FalseClass File::Stat File Fixnum Fload ' + 'Hash Integer IO MatchData Method Module NilClass Numeric Object Proc Range Regexp String Struct::TMS Symbol ' + 'ThreadGroup Thread Time TrueClass';
	
	  this.regexList = [{
	    regex: regexLib.singleLinePerlComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /\b[A-Z0-9_]+\b/g,
	    css: 'constants'
	  }, {
	    regex: /:[a-z][A-Za-z0-9_]*/g,
	    css: 'color2'
	  }, {
	    regex: /(\$|@@|@)\w+/g,
	    css: 'variable bold'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp(this.getKeywords(builtins), 'gm'),
	    css: 'color1'
	  }];
	
	  this.forHtmlScript(regexLib.aspScriptTags);
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['ruby', 'rails', 'ror', 'rb'];
	module.exports = Brush;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  function getKeywordsCSS(str) {
	    return '\\b([a-z_]|)' + str.replace(/ /g, '(?=:)\\b|\\b([a-z_\\*]|\\*|)') + '(?=:)\\b';
	  };
	
	  function getValuesCSS(str) {
	    return '\\b' + str.replace(/ /g, '(?!-)(?!:)\\b|\\b()') + '\:\\b';
	  };
	
	  function getKeywordsPrependedBy(keywords, by) {
	    return '(?:' + keywords.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '|' + by + '\\b').replace(/^/, by + '\\b') + ')\\b';
	  }
	
	  var keywords = 'ascent azimuth background-attachment background-color background-image background-position ' + 'background-repeat background baseline bbox border-collapse border-color border-spacing border-style border-top ' + 'border-right border-bottom border-left border-top-color border-right-color border-bottom-color border-left-color ' + 'border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width ' + 'border-bottom-width border-left-width border-width border bottom cap-height caption-side centerline clear clip color ' + 'content counter-increment counter-reset cue-after cue-before cue cursor definition-src descent direction display ' + 'elevation empty-cells float font-size-adjust font-family font-size font-stretch font-style font-variant font-weight font ' + 'height left letter-spacing line-height list-style-image list-style-position list-style-type list-style margin-top ' + 'margin-right margin-bottom margin-left margin marker-offset marks mathline max-height max-width min-height min-width orphans ' + 'outline-color outline-style outline-width outline overflow padding-top padding-right padding-bottom padding-left padding page ' + 'page-break-after page-break-before page-break-inside pause pause-after pause-before pitch pitch-range play-during position ' + 'quotes right richness size slope src speak-header speak-numeral speak-punctuation speak speech-rate stemh stemv stress ' + 'table-layout text-align top text-decoration text-indent text-shadow text-transform unicode-bidi unicode-range units-per-em ' + 'vertical-align visibility voice-family volume white-space widows width widths word-spacing x-height z-index zoom';
	
	  var values = 'above absolute all always aqua armenian attr aural auto avoid baseline behind below bidi-override black blink block blue bold bolder ' + 'both bottom braille capitalize caption center center-left center-right circle close-quote code collapse compact condensed ' + 'continuous counter counters crop cross crosshair cursive dashed decimal decimal-leading-zero digits disc dotted double ' + 'embed embossed e-resize expanded extra-condensed extra-expanded fantasy far-left far-right fast faster fixed format fuchsia ' + 'gray green groove handheld hebrew help hidden hide high higher icon inline-table inline inset inside invert italic ' + 'justify landscape large larger left-side left leftwards level lighter lime line-through list-item local loud lower-alpha ' + 'lowercase lower-greek lower-latin lower-roman lower low ltr marker maroon medium message-box middle mix move narrower ' + 'navy ne-resize no-close-quote none no-open-quote no-repeat normal nowrap n-resize nw-resize oblique olive once open-quote outset ' + 'outside overline pointer portrait pre print projection purple red relative repeat repeat-x repeat-y rgb ridge right right-side ' + 'rightwards rtl run-in screen scroll semi-condensed semi-expanded separate se-resize show silent silver slower slow ' + 'small small-caps small-caption smaller soft solid speech spell-out square s-resize static status-bar sub super sw-resize ' + 'table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group teal ' + 'text-bottom text-top thick thin top transparent tty tv ultra-condensed ultra-expanded underline upper-alpha uppercase upper-latin ' + 'upper-roman url visible wait white wider w-resize x-fast x-high x-large x-loud x-low x-slow x-small x-soft xx-large xx-small yellow';
	
	  var fonts = '[mM]onospace [tT]ahoma [vV]erdana [aA]rial [hH]elvetica [sS]ans-serif [sS]erif [cC]ourier mono sans serif';
	
	  var statements = 'important default';
	  var preprocessor = 'import extend debug warn if else for while mixin function include content media';
	
	  var r = regexLib;
	
	  this.regexList = [{
	    regex: r.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: r.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: r.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: r.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /\#[a-fA-F0-9]{3,6}/g,
	    css: 'value'
	  }, {
	    regex: /\b(-?\d+)(\.\d+)?(px|em|rem|pt|\:|\%|)\b/g,
	    css: 'value'
	  }, {
	    regex: /\$[\w-]+/g,
	    css: 'variable'
	  }, {
	    regex: new RegExp(getKeywordsPrependedBy(statements, '!'), 'g'),
	    css: 'color3'
	  }, {
	    regex: new RegExp(getKeywordsPrependedBy(preprocessor, '@'), 'g'),
	    css: 'preprocessor'
	  }, {
	    regex: new RegExp(getKeywordsCSS(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp(getValuesCSS(values), 'g'),
	    css: 'value'
	  }, {
	    regex: new RegExp(this.getKeywords(fonts), 'g'),
	    css: 'color1'
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['sass', 'scss'];
	module.exports = Brush;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Contributed by Yegor Jbanov and David Bernard.
	
	  var keywords = 'val sealed case def true trait implicit forSome import match object null finally super ' + 'override try lazy for var catch throw type extends class while with new final yield abstract ' + 'else do if return protected private this package false';
	
	  var keyops = '[_:=><%#@]+';
	
	  this.regexList = [{
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineSingleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.multiLineDoubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: /0x[a-f0-9]+|\d+(\.\d+)?/gi,
	    css: 'value'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp(keyops, 'gm'),
	    css: 'keyword'
	  }];
	}
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['scala'];
	module.exports = Brush;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  var funcs = 'abs avg case cast coalesce convert count current_timestamp ' + 'current_user day isnull left lower month nullif replace right ' + 'session_user space substring sum system_user upper user year';
	
	  var keywords = 'absolute action add after alter as asc at authorization begin bigint ' + 'binary bit by cascade char character check checkpoint close collate ' + 'column commit committed connect connection constraint contains continue ' + 'create cube current current_date current_time cursor database date ' + 'deallocate dec decimal declare default delete desc distinct double drop ' + 'dynamic else end end-exec escape except exec execute false fetch first ' + 'float for force foreign forward free from full function global goto grant ' + 'group grouping having hour ignore index inner insensitive insert instead ' + 'int integer intersect into is isolation key last level load local max min ' + 'minute modify move name national nchar next no numeric of off on only ' + 'open option order out output partial password precision prepare primary ' + 'prior privileges procedure public read real references relative repeatable ' + 'restrict return returns revoke rollback rollup rows rule schema scroll ' + 'second section select sequence serializable set size smallint static ' + 'statistics table temp temporary then time timestamp to top transaction ' + 'translation trigger true truncate uncommitted union unique update values ' + 'varchar varying view when where with work';
	
	  var operators = 'all and any between cross in join like not null or outer some';
	
	  this.regexList = [{
	    regex: /--(.*)$/gm,
	    css: 'comments'
	  }, {
	    regex: /\/\*([^\*][\s\S]*?)?\*\//gm,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineDoubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.multiLineSingleQuotedString,
	    css: 'string'
	  }, {
	    regex: new RegExp(this.getKeywords(funcs), 'gmi'),
	    css: 'color2'
	  }, {
	    regex: new RegExp(this.getKeywords(operators), 'gmi'),
	    css: 'color1'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gmi'),
	    css: 'keyword'
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['sql'];
	module.exports = Brush;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	var Match = __webpack_require__(5).Match;
	
	function Brush() {
	  // Swift brush contributed by Nate Cook
	  // http://natecook.com/code/swift-syntax-highlighting
	
	  function getKeywordsPrependedBy(keywords, by) {
	    return '(?:' + keywords.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '|' + by + '\\b').replace(/^/, by + '\\b') + ')\\b';
	  }
	
	  function multiLineCCommentsAdd(match, regexInfo) {
	    var str = match[0],
	        result = [],
	        pos = 0,
	        matchStart = 0,
	        level = 0;
	
	    while (pos < str.length - 1) {
	      var chunk = str.substr(pos, 2);
	      if (level == 0) {
	        if (chunk == "/*") {
	          matchStart = pos;
	          level++;
	          pos += 2;
	        } else {
	          pos++;
	        }
	      } else {
	        if (chunk == "/*") {
	          level++;
	          pos += 2;
	        } else if (chunk == "*/") {
	          level--;
	          if (level == 0) {
	            result.push(new Match(str.substring(matchStart, pos + 2), matchStart + match.index, regexInfo.css));
	          }
	          pos += 2;
	        } else {
	          pos++;
	        }
	      }
	    }
	
	    return result;
	  }
	
	  function stringAdd(match, regexInfo) {
	    var str = match[0],
	        result = [],
	        pos = 0,
	        matchStart = 0,
	        level = 0;
	
	    while (pos < str.length - 1) {
	      if (level == 0) {
	        if (str.substr(pos, 2) == "\\(") {
	          result.push(new Match(str.substring(matchStart, pos + 2), matchStart + match.index, regexInfo.css));
	          level++;
	          pos += 2;
	        } else {
	          pos++;
	        }
	      } else {
	        if (str[pos] == "(") {
	          level++;
	        }
	        if (str[pos] == ")") {
	          level--;
	          if (level == 0) {
	            matchStart = pos;
	          }
	        }
	        pos++;
	      }
	    }
	    if (level == 0) {
	      result.push(new Match(str.substring(matchStart, str.length), matchStart + match.index, regexInfo.css));
	    }
	
	    return result;
	  };
	
	  // "Swift-native types" are all the protocols, classes, structs, enums, funcs, vars, and typealiases built into the language
	  var swiftTypes = 'AbsoluteValuable Any AnyClass Array ArrayBound ArrayBuffer ArrayBufferType ArrayLiteralConvertible ArrayType AutoreleasingUnsafePointer BidirectionalIndex Bit BitwiseOperations Bool C CBool CChar CChar16 CChar32 CConstPointer CConstVoidPointer CDouble CFloat CInt CLong CLongLong CMutablePointer CMutableVoidPointer COpaquePointer CShort CSignedChar CString CUnsignedChar CUnsignedInt CUnsignedLong CUnsignedLongLong CUnsignedShort CVaListPointer CVarArg CWideChar Character CharacterLiteralConvertible Collection CollectionOfOne Comparable ContiguousArray ContiguousArrayBuffer DebugPrintable Dictionary DictionaryGenerator DictionaryIndex DictionaryLiteralConvertible Double EmptyCollection EmptyGenerator EnumerateGenerator Equatable ExtendedGraphemeClusterLiteralConvertible ExtendedGraphemeClusterType ExtensibleCollection FilterCollectionView FilterCollectionViewIndex FilterGenerator FilterSequenceView Float Float32 Float64 Float80 FloatLiteralConvertible FloatLiteralType FloatingPointClassification FloatingPointNumber ForwardIndex Generator GeneratorOf GeneratorOfOne GeneratorSequence Hashable HeapBuffer HeapBufferStorage HeapBufferStorageBase ImplicitlyUnwrappedOptional IndexingGenerator Int Int16 Int32 Int64 Int8 IntEncoder IntMax Integer IntegerArithmetic IntegerLiteralConvertible IntegerLiteralType Less LifetimeManager LogicValue MapCollectionView MapSequenceGenerator MapSequenceView MaxBuiltinFloatType MaxBuiltinIntegerType Mirror MirrorDisposition MutableCollection MutableSliceable ObjectIdentifier OnHeap Optional OutputStream PermutationGenerator Printable QuickLookObject RandomAccessIndex Range RangeGenerator RawByte RawOptionSet RawRepresentable Reflectable Repeat ReverseIndex ReverseRange ReverseRangeGenerator ReverseView Sequence SequenceOf SignedInteger SignedNumber Sink SinkOf Slice SliceBuffer Sliceable StaticString Streamable StridedRangeGenerator String StringElement StringInterpolationConvertible StringLiteralConvertible StringLiteralType UInt UInt16 UInt32 UInt64 UInt8 UIntMax UTF16 UTF32 UTF8 UWord UnicodeCodec UnicodeScalar Unmanaged UnsafeArray UnsafePointer UnsignedInteger Void Word Zip2 ZipGenerator2 abs advance alignof alignofValue assert bridgeFromObjectiveC bridgeFromObjectiveCUnconditional bridgeToObjectiveC bridgeToObjectiveCUnconditional c contains count countElements countLeadingZeros debugPrint debugPrintln distance dropFirst dropLast dump encodeBitsAsWords enumerate equal false filter find getBridgedObjectiveCType getVaList indices insertionSort isBridgedToObjectiveC isBridgedVerbatimToObjectiveC isUniquelyReferenced join lexicographicalCompare map max maxElement min minElement nil numericCast partition posix print println quickSort reduce reflect reinterpretCast reverse roundUpToAlignment sizeof sizeofValue sort split startsWith strideof strideofValue swap swift toString transcode true underestimateCount unsafeReflect withExtendedLifetime withObjectAtPlusZero withUnsafePointer withUnsafePointerToObject withUnsafePointers withVaList';
	
	  var keywords = 'as break case class continue default deinit do dynamicType else enum ' + 'extension fallthrough for func if import in init is let new protocol ' + 'return self Self static struct subscript super switch Type typealias ' + 'var where while __COLUMN__ __FILE__ __FUNCTION__ __LINE__ associativity ' + 'didSet get infix inout left mutating none nonmutating operator override ' + 'postfix precedence prefix right set unowned unowned(safe) unowned(unsafe) weak willSet';
	
	  var attributes = 'assignment class_protocol exported final lazy noreturn NSCopying NSManaged objc optional required auto_closure noreturn IBAction IBDesignable IBInspectable IBOutlet infix prefix postfix';
	
	  this.regexList = [
	  // html entities
	  {
	    regex: new RegExp('\&[a-z]+;', 'gi'),
	    css: 'plain'
	  }, {
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: new RegExp('\\/\\*[\\s\\S]*\\*\\/', 'g'),
	    css: 'comments',
	    func: multiLineCCommentsAdd
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string',
	    func: stringAdd
	  }, {
	    regex: new RegExp('\\b([\\d_]+(\\.[\\de_]+)?|0x[a-f0-9_]+(\\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\\b', 'gi'),
	    css: 'value'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp(getKeywordsPrependedBy(attributes, '@'), 'gm'),
	    css: 'color1'
	  }, {
	    regex: new RegExp(this.getKeywords(swiftTypes), 'gm'),
	    css: 'color2'
	  }, {
	    regex: new RegExp('\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b', 'gi'),
	    css: 'variable'
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['swift'];
	module.exports = Brush;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  // Contributed by Chad Granum
	  this.regexList = [{
	    regex: new RegExp('^1..\\d+', 'gm'),
	    css: 'plain bold italic'
	  }, {
	    regex: new RegExp('^ok( \\d+)?', 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp('^not ok( \\d+)?', 'gm'),
	    css: 'color3 bold'
	  }, {
	    regex: new RegExp('(?!^\\s*)#.*$', 'gm'),
	    css: 'variable bold'
	  }, {
	    regex: new RegExp('^#.*$', 'gm'),
	    css: 'comments bold'
	  }, {
	    regex: new RegExp('^(?!(not )?ok)[^1].*$', 'gm'),
	    css: 'comments'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }];
	}
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['tap', 'Tap', 'TAP'];
	module.exports = Brush;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  var keywords = 'break case catch class continue ' + 'default delete do else enum export extends false  ' + 'for function if implements import in instanceof ' + 'interface let new null package private protected ' + 'static return super switch ' + 'this throw true try typeof var while with yield' + ' any bool declare get module never number public readonly set string'; // TypeScript-specific, everything above is common with JavaScript
	
	  this.regexList = [{
	    regex: regexLib.multiLineDoubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.multiLineSingleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }];
	
	  this.forHtmlScript(regexLib.scriptScriptTags);
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['ts', 'typescript'];
	module.exports = Brush;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  var keywords = 'AddHandler AddressOf AndAlso Alias And Ansi As Assembly Auto ' + 'Boolean ByRef Byte ByVal Call Case Catch CBool CByte CChar CDate ' + 'CDec CDbl Char CInt Class CLng CObj Const CShort CSng CStr CType ' + 'Date Decimal Declare Default Delegate Dim DirectCast Do Double Each ' + 'Else ElseIf End Enum Erase Error Event Exit False Finally For Friend ' + 'Function Get GetType GoSub GoTo Handles If Implements Imports In ' + 'Inherits Integer Interface Is Let Lib Like Long Loop Me Mod Module ' + 'MustInherit MustOverride MyBase MyClass Namespace New Next Not Nothing ' + 'NotInheritable NotOverridable Object On Option Optional Or OrElse ' + 'Overloads Overridable Overrides ParamArray Preserve Private Property ' + 'Protected Public RaiseEvent ReadOnly ReDim REM RemoveHandler Resume ' + 'Return Select Set Shadows Shared Short Single Static Step Stop String ' + 'Structure Sub SyncLock Then Throw To True Try TypeOf Unicode Until ' + 'Variant When While With WithEvents WriteOnly Xor';
	
	  this.regexList = [{
	    regex: /'.*$/gm,
	    css: 'comments'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: /^\s*#.*$/gm,
	    css: 'preprocessor'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }];
	
	  this.forHtmlScript(regexLib.aspScriptTags);
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['vb', 'vbnet'];
	module.exports = Brush;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	var XRegExp = __webpack_require__(3).XRegExp;
	var Match = __webpack_require__(5).Match;
	
	function Brush() {
	  function process(match, regexInfo) {
	    var code = match[0],
	        tag = XRegExp.exec(code, XRegExp('(&lt;|<)[\\s\\/\\?!]*(?<name>[:\\w-\\.]+)', 'xg')),
	        result = [];
	
	    if (match.attributes != null) {
	      var attributes,
	          pos = 0,
	          regex = XRegExp('(?<name> [\\w:.-]+)' + '\\s*=\\s*' + '(?<value> ".*?"|\'.*?\'|\\w+)', 'xg');
	
	      while ((attributes = XRegExp.exec(code, regex, pos)) != null) {
	        result.push(new Match(attributes.name, match.index + attributes.index, 'color1'));
	        result.push(new Match(attributes.value, match.index + attributes.index + attributes[0].indexOf(attributes.value), 'string'));
	        pos = attributes.index + attributes[0].length;
	      }
	    }
	
	    if (tag != null) result.push(new Match(tag.name, match.index + tag[0].indexOf(tag.name), 'keyword'));
	
	    return result;
	  }
	
	  this.regexList = [{
	    regex: XRegExp('(\\&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](\\&gt;|>)', 'gm'),
	    css: 'color2'
	  }, {
	    regex: regexLib.xmlComments,
	    css: 'comments'
	  }, {
	    regex: XRegExp('(&lt;|<)[\\s\\/\\?!]*(\\w+)(?<attributes>.*?)[\\s\\/\\?]*(&gt;|>)', 'sg'),
	    func: process
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['xml', 'xhtml', 'xslt', 'html', 'plist'];
	module.exports = Brush;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  var ops = 'abs_diff_image abs_funct_1d abs_image abs_matrix abs_matrix_mod access_channel acos_image activate_compute_device adapt_template add_channels add_class_train_data_gmm add_class_train_data_knn add_class_train_data_mlp add_class_train_data_svm add_deformable_surface_model_reference_point add_deformable_surface_model_sample add_image add_matrix add_matrix_mod add_metrology_object_circle_measure add_metrology_object_ellipse_measure add_metrology_object_generic add_metrology_object_line_measure add_metrology_object_rectangle2_measure add_noise_distribution add_noise_white add_noise_white_contour_xld add_sample_class_gmm add_sample_class_knn add_sample_class_mlp add_sample_class_svm add_sample_class_train_data add_sample_identifier_preparation_data add_sample_identifier_training_data add_samples_image_class_gmm add_samples_image_class_knn add_samples_image_class_mlp add_samples_image_class_svm add_scene_3d_camera add_scene_3d_instance add_scene_3d_label add_scene_3d_light add_texture_inspection_model_image adjust_mosaic_images affine_trans_contour_xld affine_trans_image affine_trans_image_size affine_trans_object_model_3d affine_trans_pixel affine_trans_point_2d affine_trans_point_3d affine_trans_polygon_xld affine_trans_region align_metrology_model angle_ll angle_lx anisotropic_diffusion append_channel append_ocr_trainf apply_bead_inspection_model apply_color_trans_lut apply_distance_transform_xld apply_metrology_model apply_sample_identifier apply_sheet_of_light_calibration apply_texture_inspection_model approx_chain approx_chain_simple area_center area_center_gray area_center_points_xld area_center_xld area_holes area_object_model_3d asin_image atan2_image atan_image attach_background_to_window attach_drawing_object_to_window auto_threshold axis_angle_to_quat background_seg bandpass_image best_match best_match_mg best_match_pre_mg best_match_rot best_match_rot_mg bilateral_filter bin_threshold binary_threshold binocular_calibration binocular_disparity binocular_disparity_mg binocular_disparity_ms binocular_distance binocular_distance_mg binocular_distance_ms binomial_filter bit_and bit_lshift bit_mask bit_not bit_or bit_rshift bit_slice bit_xor bottom_hat boundary broadcast_condition bundle_adjust_mosaic calibrate_cameras calibrate_hand_eye calibrate_sheet_of_light caltab_points cam_mat_to_cam_par cam_par_pose_to_hom_mat3d cam_par_to_cam_mat camera_calibration cfa_to_rgb change_domain change_format change_radial_distortion_cam_par change_radial_distortion_contours_xld change_radial_distortion_image change_radial_distortion_points channels_to_image char_threshold check_difference circularity circularity_xld class_2dim_sup class_2dim_unsup class_ndim_box class_ndim_norm classify_class_gmm classify_class_knn classify_class_mlp classify_class_svm classify_image_class_gmm classify_image_class_knn classify_image_class_lut classify_image_class_mlp classify_image_class_svm clear_all_bar_code_models clear_all_barriers clear_all_calib_data clear_all_camera_setup_models clear_all_class_gmm clear_all_class_knn clear_all_class_lut clear_all_class_mlp clear_all_class_svm clear_all_class_train_data clear_all_color_trans_luts clear_all_component_models clear_all_conditions clear_all_data_code_2d_models clear_all_deformable_models clear_all_descriptor_models clear_all_events clear_all_lexica clear_all_matrices clear_all_metrology_models clear_all_mutexes clear_all_ncc_models clear_all_object_model_3d clear_all_ocr_class_knn clear_all_ocr_class_mlp clear_all_ocr_class_svm clear_all_sample_identifiers clear_all_scattered_data_interpolators clear_all_serialized_items clear_all_shape_model_3d clear_all_shape_models clear_all_sheet_of_light_models clear_all_stereo_models clear_all_surface_matching_results clear_all_surface_models clear_all_templates clear_all_text_models clear_all_text_results clear_all_training_components clear_all_variation_models clear_bar_code_model clear_barrier clear_bead_inspection_model clear_calib_data clear_camera_setup_model clear_class_gmm clear_class_knn clear_class_lut clear_class_mlp clear_class_svm clear_class_train_data clear_color_trans_lut clear_component_model clear_condition clear_data_code_2d_model clear_deformable_model clear_deformable_surface_matching_result clear_deformable_surface_model clear_descriptor_model clear_distance_transform_xld clear_drawing_object clear_event clear_lexicon clear_matrix clear_message clear_message_queue clear_metrology_model clear_metrology_object clear_mutex clear_ncc_model clear_obj clear_object_model_3d clear_ocr_class_cnn clear_ocr_class_knn clear_ocr_class_mlp clear_ocr_class_svm clear_rectangle clear_sample_identifier clear_samples_class_gmm clear_samples_class_mlp clear_samples_class_svm clear_sampset clear_scattered_data_interpolator clear_scene_3d clear_serial clear_serialized_item clear_shape_model clear_shape_model_3d clear_sheet_of_light_model clear_stereo_model clear_surface_matching_result clear_surface_model clear_template clear_text_model clear_text_result clear_texture_inspection_model clear_texture_inspection_result clear_train_data_variation_model clear_training_components clear_variation_model clear_window clip_contours_xld clip_end_points_contours_xld clip_region clip_region_rel close_all_bg_esti close_all_class_box close_all_files close_all_framegrabbers close_all_measures close_all_ocrs close_all_ocvs close_all_serials close_all_sockets close_bg_esti close_class_box close_contours_xld close_edges close_edges_length close_file close_framegrabber close_io_channel close_io_device close_measure close_ocr close_ocv close_serial close_socket close_window closest_point_transform closing closing_circle closing_golay closing_rectangle1 cluster_model_components coherence_enhancing_diff combine_roads_xld compactness compactness_xld compare_ext_variation_model compare_obj compare_variation_model complement complex_to_real compose2 compose3 compose4 compose5 compose6 compose7 compose_funct_1d concat_obj concat_ocr_trainf connect_and_holes connect_grid_points connection connection_object_model_3d contlength contour_point_num_xld contour_to_world_plane_xld control_io_channel control_io_device control_io_interface convert_coordinates_image_to_window convert_coordinates_window_to_image convert_image_type convert_map_type convert_point_3d_cart_to_spher convert_point_3d_spher_to_cart convert_pose_type convert_tuple_to_vector_1d convert_vector_to_tuple convex_hull_object_model_3d convexity convexity_xld convol_fft convol_gabor convol_image cooc_feature_image cooc_feature_matrix copy_file copy_image copy_matrix copy_metrology_model copy_metrology_object copy_obj copy_object_model_3d copy_rectangle corner_response correlation_fft cos_image count_channels count_obj count_relation count_seconds create_aniso_shape_model create_aniso_shape_model_xld create_bar_code_model create_barrier create_bead_inspection_model create_bg_esti create_calib_data create_calib_descriptor_model create_caltab create_cam_pose_look_at_point create_camera_setup_model create_class_box create_class_gmm create_class_knn create_class_lut_gmm create_class_lut_knn create_class_lut_mlp create_class_lut_svm create_class_mlp create_class_svm create_class_train_data create_color_trans_lut create_component_model create_condition create_data_code_2d_model create_deformable_surface_model create_distance_transform_xld create_drawing_object_circle create_drawing_object_circle_sector create_drawing_object_ellipse create_drawing_object_ellipse_sector create_drawing_object_line create_drawing_object_rectangle1 create_drawing_object_rectangle2 create_drawing_object_text create_drawing_object_xld create_event create_funct_1d_array create_funct_1d_pairs create_lexicon create_local_deformable_model create_local_deformable_model_xld create_matrix create_message create_message_queue create_metrology_model create_mutex create_ncc_model create_ocr_class_box create_ocr_class_knn create_ocr_class_mlp create_ocr_class_svm create_ocv_proj create_planar_calib_deformable_model create_planar_calib_deformable_model_xld create_planar_uncalib_deformable_model create_planar_uncalib_deformable_model_xld create_pose create_rectification_grid create_sample_identifier create_scaled_shape_model create_scaled_shape_model_xld create_scattered_data_interpolator create_scene_3d create_serialized_item_ptr create_shape_model create_shape_model_3d create_shape_model_xld create_sheet_of_light_calib_object create_sheet_of_light_model create_stereo_model create_surface_model create_template create_template_rot create_text_model create_text_model_reader create_texture_inspection_model create_trained_component_model create_uncalib_descriptor_model create_variation_model critical_points_sub_pix crop_contours_xld crop_domain crop_domain_rel crop_part crop_rectangle1 deactivate_all_compute_devices deactivate_compute_device decode_bar_code_rectangle2 decompose2 decompose3 decompose4 decompose5 decompose6 decompose7 decompose_matrix delete_file depth_from_focus dequeue_message derivate_funct_1d derivate_gauss derivate_vector_field descript_class_box deserialize_bar_code_model deserialize_calib_data deserialize_cam_par deserialize_camera_setup_model deserialize_class_box deserialize_class_gmm deserialize_class_knn deserialize_class_mlp deserialize_class_svm deserialize_class_train_data deserialize_component_model deserialize_data_code_2d_model deserialize_deformable_model deserialize_deformable_surface_model deserialize_descriptor_model deserialize_distance_transform_xld deserialize_dual_quat deserialize_fft_optimization_data deserialize_hom_mat2d deserialize_hom_mat3d deserialize_image deserialize_matrix deserialize_measure deserialize_metrology_model deserialize_ncc_model deserialize_object deserialize_object_model_3d deserialize_ocr deserialize_ocr_class_cnn deserialize_ocr_class_knn deserialize_ocr_class_mlp deserialize_ocr_class_svm deserialize_ocv deserialize_pose deserialize_quat deserialize_region deserialize_sample_identifier deserialize_shape_model deserialize_shape_model_3d deserialize_sheet_of_light_model deserialize_surface_model deserialize_template deserialize_texture_inspection_model deserialize_training_components deserialize_tuple deserialize_variation_model deserialize_xld detach_background_from_window detach_drawing_object_from_window detect_edge_segments determinant_matrix determine_deformable_model_params determine_ncc_model_params determine_shape_model_params dev_clear_obj dev_clear_window dev_close_inspect_ctrl dev_close_tool dev_close_window dev_disp_text dev_display dev_error_var dev_get_exception_data dev_get_preferences dev_get_system dev_get_window dev_inspect_ctrl dev_map_par dev_map_prog dev_map_var dev_open_dialog dev_open_file_dialog dev_open_tool dev_open_window dev_set_check dev_set_color dev_set_colored dev_set_draw dev_set_line_width dev_set_lut dev_set_paint dev_set_part dev_set_preferences dev_set_shape dev_set_tool_geometry dev_set_window dev_set_window_extents dev_show_tool dev_unmap_par dev_unmap_prog dev_unmap_var dev_update_pc dev_update_time dev_update_var dev_update_window deviation_image deviation_n diameter_region diameter_xld diff_of_gauss difference difference_closed_contours_xld difference_closed_polygons_xld dilation1 dilation2 dilation_circle dilation_golay dilation_rectangle1 dilation_seq disp_arc disp_arrow disp_caltab disp_channel disp_circle disp_color disp_cross disp_distribution disp_ellipse disp_image disp_line disp_lut disp_obj disp_object_model_3d disp_polygon disp_rectangle1 disp_rectangle2 disp_region disp_text disp_xld disparity_image_to_xyz disparity_to_distance disparity_to_point_3d display_scene_3d dist_ellipse_contour_points_xld dist_ellipse_contour_xld dist_rectangle2_contour_points_xld distance_cc distance_cc_min distance_contours_xld distance_funct_1d distance_lc distance_lr distance_object_model_3d distance_pc distance_pl distance_pp distance_pr distance_ps distance_rr_min distance_rr_min_dil distance_sc distance_sl distance_sr distance_ss distance_to_disparity distance_transform div_element_matrix div_element_matrix_mod div_image do_ocr_multi do_ocr_multi_class_cnn do_ocr_multi_class_knn do_ocr_multi_class_mlp do_ocr_multi_class_svm do_ocr_single do_ocr_single_class_cnn do_ocr_single_class_knn do_ocr_single_class_mlp do_ocr_single_class_svm do_ocr_word_cnn do_ocr_word_knn do_ocr_word_mlp do_ocr_word_svm do_ocv_simple dots_image drag_region1 drag_region2 drag_region3 draw_circle draw_circle_mod draw_ellipse draw_ellipse_mod draw_line draw_line_mod draw_nurbs draw_nurbs_interp draw_nurbs_interp_mod draw_nurbs_mod draw_point draw_point_mod draw_polygon draw_rectangle1 draw_rectangle1_mod draw_rectangle2 draw_rectangle2_mod draw_region draw_xld draw_xld_mod dual_quat_compose dual_quat_conjugate dual_quat_interpolate dual_quat_normalize dual_quat_to_hom_mat3d dual_quat_to_pose dual_quat_to_screw dual_quat_trans_line_3d dual_rank dual_threshold dump_window dump_window_image dyn_threshold eccentricity eccentricity_points_xld eccentricity_xld edges_color edges_color_sub_pix edges_image edges_object_model_3d edges_sub_pix eigenvalues_general_matrix eigenvalues_symmetric_matrix eliminate_min_max eliminate_runs eliminate_sp elliptic_axis elliptic_axis_gray elliptic_axis_points_xld elliptic_axis_xld emphasize energy_gabor enqueue_message enquire_class_box enquire_reject_class_box entropy_gray entropy_image equ_histo_image erosion1 erosion2 erosion_circle erosion_golay erosion_rectangle1 erosion_seq essential_to_fundamental_matrix estimate_al_am estimate_noise estimate_sl_al_lr estimate_sl_al_zc estimate_tilt_lr estimate_tilt_zc euler_number evaluate_class_gmm evaluate_class_mlp evaluate_class_svm executable_expression exhaustive_match exhaustive_match_mg exp_image expand_domain_gray expand_gray expand_gray_ref expand_line expand_region fast_match fast_match_mg fast_threshold fft_generic fft_image fft_image_inv file_exists fill_interlace fill_up fill_up_shape filter_kalman find_aniso_shape_model find_aniso_shape_models find_bar_code find_calib_descriptor_model find_calib_object find_caltab find_component_model find_data_code_2d find_deformable_surface_model find_local_deformable_model find_marks_and_pose find_ncc_model find_ncc_models find_neighbors find_planar_calib_deformable_model find_planar_uncalib_deformable_model find_rectification_grid find_scaled_shape_model find_scaled_shape_models find_shape_model find_shape_model_3d find_shape_models find_surface_model find_surface_model_image find_text find_uncalib_descriptor_model fit_circle_contour_xld fit_ellipse_contour_xld fit_line_contour_xld fit_primitives_object_model_3d fit_rectangle2_contour_xld fit_surface_first_order fit_surface_second_order fitting flush_buffer fnew_line fread_char fread_line fread_serialized_item fread_string frei_amp frei_dir full_domain funct_1d_to_pairs fuzzy_entropy fuzzy_measure_pairing fuzzy_measure_pairs fuzzy_measure_pos fuzzy_perimeter fwrite_serialized_item fwrite_string gamma_image gauss_distribution gauss_filter gauss_image gen_arbitrary_distortion_map gen_bandfilter gen_bandpass gen_binocular_proj_rectification gen_binocular_rectification_map gen_box_object_model_3d gen_bundle_adjusted_mosaic gen_caltab gen_checker_region gen_circle gen_circle_contour_xld gen_circle_sector gen_contour_nurbs_xld gen_contour_polygon_rounded_xld gen_contour_polygon_xld gen_contour_region_xld gen_contours_skeleton_xld gen_cooc_matrix gen_cross_contour_xld gen_cube_map_mosaic gen_cylinder_object_model_3d gen_derivative_filter gen_disc_se gen_ellipse gen_ellipse_contour_xld gen_ellipse_sector gen_empty_obj gen_empty_object_model_3d gen_empty_region gen_filter_mask gen_gabor gen_gauss_filter gen_gauss_pyramid gen_grid_rectification_map gen_grid_region gen_highpass gen_image1 gen_image1_extern gen_image1_rect gen_image3 gen_image3_extern gen_image_const gen_image_gray_ramp gen_image_interleaved gen_image_proto gen_image_surface_first_order gen_image_surface_second_order gen_image_to_world_plane_map gen_initial_components gen_lowpass gen_mean_filter gen_measure_arc gen_measure_rectangle2 gen_nurbs_interp gen_object_model_3d_from_points gen_parallel_contour_xld gen_parallels_xld gen_plane_object_model_3d gen_polygons_xld gen_principal_comp_trans gen_projective_mosaic gen_psf_defocus gen_psf_motion gen_radial_distortion_map gen_random_region gen_random_regions gen_rectangle1 gen_rectangle2 gen_rectangle2_contour_xld gen_region_contour_xld gen_region_histo gen_region_hline gen_region_line gen_region_points gen_region_polygon gen_region_polygon_filled gen_region_polygon_xld gen_region_runs gen_sin_bandpass gen_sphere_object_model_3d gen_sphere_object_model_3d_center gen_spherical_mosaic gen_std_bandpass gen_struct_elements generalized_eigenvalues_general_matrix generalized_eigenvalues_symmetric_matrix get_aop_info get_bar_code_object get_bar_code_param get_bar_code_param_specific get_bar_code_result get_bead_inspection_param get_bg_esti_params get_calib_data get_calib_data_observ_contours get_calib_data_observ_points get_calib_data_observ_pose get_camera_setup_param get_channel_info get_chapter_info get_check get_circle_pose get_class_box_param get_class_train_data_gmm get_class_train_data_knn get_class_train_data_mlp get_class_train_data_svm get_component_model_params get_component_model_tree get_component_relations get_comprise get_compute_device_info get_compute_device_param get_contour_angle_xld get_contour_attrib_xld get_contour_global_attrib_xld get_contour_xld get_current_dir get_data_code_2d_objects get_data_code_2d_param get_data_code_2d_results get_deformable_model_contours get_deformable_model_origin get_deformable_model_params get_deformable_surface_matching_result get_deformable_surface_model_param get_descriptor_model_origin get_descriptor_model_params get_descriptor_model_points get_descriptor_model_results get_diagonal_matrix get_disp_object_model_3d_info get_display_scene_3d_info get_distance_transform_xld_contour get_distance_transform_xld_param get_domain get_draw get_drawing_object_iconic get_drawing_object_params get_error_text get_extended_error_info get_features_ocr_class_knn get_features_ocr_class_mlp get_features_ocr_class_svm get_fix get_fixed_lut get_font get_font_extents get_found_component_model get_framegrabber_callback get_framegrabber_lut get_framegrabber_param get_full_matrix get_grayval get_grayval_contour_xld get_grayval_interpolated get_hsi get_icon get_image_pointer1 get_image_pointer1_rect get_image_pointer3 get_image_size get_image_time get_image_type get_insert get_io_channel_param get_io_device_param get_keywords get_line_approx get_line_of_sight get_line_style get_line_width get_lines_xld get_lut get_lut_style get_mbutton get_mbutton_sub_pix get_message_obj get_message_param get_message_queue_param get_message_tuple get_metrology_model_param get_metrology_object_fuzzy_param get_metrology_object_indices get_metrology_object_measures get_metrology_object_model_contour get_metrology_object_num_instances get_metrology_object_param get_metrology_object_result get_metrology_object_result_contour get_modules get_mposition get_mposition_sub_pix get_mshape get_ncc_model_origin get_ncc_model_params get_ncc_model_region get_next_socket_data_type get_obj_class get_object_model_3d_params get_operator_info get_operator_name get_os_window_handle get_paint get_pair_funct_1d get_parallels_xld get_param_info get_param_names get_param_num get_param_types get_params_class_gmm get_params_class_knn get_params_class_mlp get_params_class_svm get_params_ocr_class_cnn get_params_ocr_class_knn get_params_ocr_class_mlp get_params_ocr_class_svm get_part get_part_style get_pixel get_points_ellipse get_polygon_xld get_pose_type get_prep_info_class_gmm get_prep_info_class_mlp get_prep_info_class_svm get_prep_info_ocr_class_mlp get_prep_info_ocr_class_svm get_rectangle_pose get_region_chain get_region_contour get_region_convex get_region_index get_region_points get_region_polygon get_region_runs get_region_thickness get_regress_params_xld get_regularization_params_class_mlp get_regularization_params_ocr_class_mlp get_rejection_params_class_mlp get_rejection_params_ocr_class_mlp get_rgb get_rgba get_sample_class_gmm get_sample_class_knn get_sample_class_mlp get_sample_class_svm get_sample_class_train_data get_sample_identifier_object_info get_sample_identifier_param get_sample_num_class_gmm get_sample_num_class_knn get_sample_num_class_mlp get_sample_num_class_svm get_sample_num_class_train_data get_serial_param get_serialized_item_ptr get_shape get_shape_model_3d_contours get_shape_model_3d_params get_shape_model_contours get_shape_model_origin get_shape_model_params get_sheet_of_light_param get_sheet_of_light_result get_sheet_of_light_result_object_model_3d get_size_matrix get_socket_descriptor get_socket_param get_spy get_stereo_model_image_pairs get_stereo_model_object get_stereo_model_object_model_3d get_stereo_model_param get_string_extents get_sub_matrix get_support_vector_class_svm get_support_vector_num_class_svm get_support_vector_num_ocr_class_svm get_support_vector_ocr_class_svm get_surface_matching_result get_surface_model_param get_system get_system_time get_text_model_param get_text_object get_text_result get_texture_inspection_model_image get_texture_inspection_model_param get_texture_inspection_result_object get_threading_attrib get_thresh_images_variation_model get_tposition get_training_components get_tshape get_value_matrix get_variation_model get_window_attr get_window_background_image get_window_extents get_window_param get_window_pointer3 get_window_type get_y_value_funct_1d give_bg_esti gnuplot_close gnuplot_open_file gnuplot_open_pipe gnuplot_plot_ctrl gnuplot_plot_funct_1d gnuplot_plot_image golay_elements grab_data grab_data_async grab_image grab_image_async grab_image_start gray_bothat gray_closing gray_closing_rect gray_closing_shape gray_dilation gray_dilation_rect gray_dilation_shape gray_erosion gray_erosion_rect gray_erosion_shape gray_features gray_histo gray_histo_abs gray_histo_range gray_inside gray_opening gray_opening_rect gray_opening_shape gray_projections gray_range_rect gray_skeleton gray_tophat guided_filter hamming_change_region hamming_distance hamming_distance_norm hand_eye_calibration harmonic_interpolation highpass_image histo_2dim histo_to_thresh hit_or_miss hit_or_miss_golay hit_or_miss_seq hom_mat2d_compose hom_mat2d_determinant hom_mat2d_identity hom_mat2d_invert hom_mat2d_reflect hom_mat2d_reflect_local hom_mat2d_rotate hom_mat2d_rotate_local hom_mat2d_scale hom_mat2d_scale_local hom_mat2d_slant hom_mat2d_slant_local hom_mat2d_to_affine_par hom_mat2d_translate hom_mat2d_translate_local hom_mat2d_transpose hom_mat3d_compose hom_mat3d_determinant hom_mat3d_identity hom_mat3d_invert hom_mat3d_project hom_mat3d_rotate hom_mat3d_rotate_local hom_mat3d_scale hom_mat3d_scale_local hom_mat3d_to_pose hom_mat3d_translate hom_mat3d_translate_local hom_mat3d_transpose hom_vector_to_proj_hom_mat2d hough_circle_trans hough_circles hough_line_trans hough_line_trans_dir hough_lines hough_lines_dir hysteresis_threshold illuminate image_points_to_world_plane image_to_channels image_to_world_plane import import_lexicon info_edges info_framegrabber info_ocr_class_box info_parallels_xld info_smooth init_compute_device inner_circle inner_rectangle1 inpainting_aniso inpainting_ced inpainting_ct inpainting_mcf inpainting_texture inspect_clustered_components inspect_lexicon inspect_shape_model integer_to_obj integrate_funct_1d intensity interjacent interleave_channels interpolate_scattered_data interpolate_scattered_data_image interpolate_scattered_data_points_to_image intersect_lines_of_sight intersect_plane_object_model_3d intersection intersection_circle_contour_xld intersection_circles intersection_closed_contours_xld intersection_closed_polygons_xld intersection_contours_xld intersection_line_circle intersection_line_contour_xld intersection_lines intersection_ll intersection_segment_circle intersection_segment_contour_xld intersection_segment_line intersection_segments invert_funct_1d invert_image invert_matrix invert_matrix_mod isotropic_diffusion junctions_skeleton kirsch_amp kirsch_dir label_to_region laplace laplace_of_gauss learn_class_box learn_ndim_box learn_ndim_norm learn_sampset_box length_xld line_orientation line_position linear_trans_color lines_color lines_facet lines_gauss list_files local_max local_max_contours_xld local_max_sub_pix local_min local_min_max_funct_1d local_min_sub_pix local_threshold lock_mutex log_image lookup_lexicon lowlands lowlands_center lut_trans make_dir map_image match_essential_matrix_ransac match_funct_1d_trans match_fundamental_matrix_distortion_ransac match_fundamental_matrix_ransac match_rel_pose_ransac max_diameter_object_model_3d max_image max_matrix max_parallels_xld mean_curvature_flow mean_image mean_matrix mean_n mean_sp measure_pairs measure_pos measure_profile_sheet_of_light measure_projection measure_thresh median_image median_rect median_separate median_weighted merge_cont_line_scan_xld merge_regions_line_scan midrange_image min_image min_matrix min_max_gray minkowski_add1 minkowski_add2 minkowski_sub1 minkowski_sub2 mirror_image mirror_region mod_parallels_xld modify_component_relations moments_any_points_xld moments_any_xld moments_gray_plane moments_object_model_3d moments_points_xld moments_region_2nd moments_region_2nd_invar moments_region_2nd_rel_invar moments_region_3rd moments_region_3rd_invar moments_region_central moments_region_central_invar moments_xld monotony morph_hat morph_skeleton morph_skiz move_rectangle move_region mult_element_matrix mult_element_matrix_mod mult_image mult_matrix mult_matrix_mod negate_funct_1d new_extern_window new_line noise_distribution_mean nonmax_suppression_amp nonmax_suppression_dir norm_matrix num_points_funct_1d obj_diff obj_to_integer object_model_3d_to_xyz ocr_change_char ocr_get_features open_compute_device open_file open_framegrabber open_io_channel open_io_device open_serial open_socket_accept open_socket_connect open_textwindow open_window opening opening_circle opening_golay opening_rectangle1 opening_seg optical_flow_mg optimize_aop optimize_fft_speed optimize_rft_speed orientation_points_xld orientation_region orientation_xld orthogonal_decompose_matrix overpaint_gray overpaint_region paint_gray paint_region paint_xld partition_dynamic partition_lines partition_rectangle phase_correlation_fft phase_deg phase_rad photometric_stereo plane_deviation plateaus plateaus_center point_line_to_hom_mat2d points_foerstner points_harris points_harris_binomial points_lepetit points_sojka polar_trans_contour_xld polar_trans_contour_xld_inv polar_trans_image polar_trans_image_ext polar_trans_image_inv polar_trans_region polar_trans_region_inv pose_average pose_compose pose_invert pose_to_dual_quat pose_to_hom_mat3d pose_to_quat pouring pow_element_matrix pow_element_matrix_mod pow_image pow_matrix pow_matrix_mod pow_scalar_element_matrix pow_scalar_element_matrix_mod power_byte power_ln power_real prepare_direct_variation_model prepare_object_model_3d prepare_sample_identifier prepare_variation_model prewitt_amp prewitt_dir principal_comp proj_hom_mat2d_to_pose proj_match_points_distortion_ransac proj_match_points_distortion_ransac_guided proj_match_points_ransac proj_match_points_ransac_guided project_3d_point project_hom_point_hom_mat3d project_object_model_3d project_point_hom_mat3d project_shape_model_3d projection_pl projective_trans_contour_xld projective_trans_hom_point_3d projective_trans_image projective_trans_image_size projective_trans_object_model_3d projective_trans_pixel projective_trans_point_2d projective_trans_point_3d projective_trans_region protect_ocr_trainf pruning quat_compose quat_conjugate quat_interpolate quat_normalize quat_rotate_point_3d quat_to_hom_mat3d quat_to_pose query_all_colors query_aop_info query_available_compute_devices query_bar_code_params query_calib_data_observ_indices query_color query_colored query_contour_attribs_xld query_contour_global_attribs_xld query_data_code_2d_params query_font query_gray query_insert query_io_device query_io_interface query_line_width query_lut query_mshape query_operator_info query_paint query_param_info query_params_ocr_class_cnn query_shape query_sheet_of_light_params query_spy query_tshape query_window_type radial_distortion_self_calibration radiometric_self_calibration rank_image rank_n rank_rect rank_region read_aop_knowledge read_bar_code_model read_calib_data read_cam_par read_camera_setup_model read_char read_class_box read_class_gmm read_class_knn read_class_mlp read_class_svm read_class_train_data read_component_model read_contour_xld_arc_info read_contour_xld_dxf read_data_code_2d_model read_deformable_model read_deformable_surface_model read_descriptor_model read_distance_transform_xld read_fft_optimization_data read_funct_1d read_gray_se read_image read_io_channel read_kalman read_matrix read_measure read_metrology_model read_ncc_model read_object read_object_model_3d read_ocr read_ocr_class_cnn read_ocr_class_knn read_ocr_class_mlp read_ocr_class_svm read_ocr_trainf read_ocr_trainf_names read_ocr_trainf_names_protected read_ocr_trainf_select read_ocv read_polygon_xld_arc_info read_polygon_xld_dxf read_pose read_region read_sample_identifier read_samples_class_gmm read_samples_class_mlp read_samples_class_svm read_sampset read_sequence read_serial read_shape_model read_shape_model_3d read_sheet_of_light_model read_string read_surface_model read_template read_texture_inspection_model read_training_components read_tuple read_variation_model read_world_file real_to_complex real_to_vector_field receive_data receive_image receive_region receive_serialized_item receive_tuple receive_xld reconst3d_from_fundamental_matrix reconstruct_height_field_from_gradient reconstruct_points_stereo reconstruct_surface_stereo rectangle1_domain rectangularity reduce_class_svm reduce_domain reduce_object_model_3d_by_view reduce_ocr_class_svm refine_deformable_surface_model refine_surface_model_pose refine_surface_model_pose_image region_features region_to_bin region_to_label region_to_mean regiongrowing regiongrowing_mean regiongrowing_n register_object_model_3d_global register_object_model_3d_pair regress_contours_xld rel_pose_to_fundamental_matrix release_all_compute_devices release_compute_device remove_calib_data remove_calib_data_observ remove_dir remove_noise_region remove_sample_identifier_preparation_data remove_sample_identifier_training_data remove_scene_3d_camera remove_scene_3d_instance remove_scene_3d_label remove_scene_3d_light remove_texture_inspection_model_image render_object_model_3d render_scene_3d repeat_matrix reset_fuzzy_measure reset_metrology_object_fuzzy_param reset_metrology_object_param reset_obj_db reset_sheet_of_light_model rft_generic rgb1_to_gray rgb3_to_gray rigid_trans_object_model_3d roberts robinson_amp robinson_dir rotate_image roundness run_bg_esti runlength_distribution runlength_features saddle_points_sub_pix sample_funct_1d sample_object_model_3d scale_image scale_image_max scale_matrix scale_matrix_mod scale_y_funct_1d scene_flow_calib scene_flow_uncalib screw_to_dual_quat search_operator segment_characters segment_contour_attrib_xld segment_contours_xld segment_image_mser segment_object_model_3d select_characters select_contours_xld select_feature_set_gmm select_feature_set_knn select_feature_set_mlp select_feature_set_svm select_feature_set_trainf_knn select_feature_set_trainf_mlp select_feature_set_trainf_mlp_protected select_feature_set_trainf_svm select_feature_set_trainf_svm_protected select_gray select_grayvalues_from_channels select_lines select_lines_longest select_matching_lines select_obj select_object_model_3d select_points_object_model_3d select_region_point select_region_spatial select_shape select_shape_proto select_shape_std select_shape_xld select_sub_feature_class_train_data select_xld_point send_data send_image send_mouse_double_click_event send_mouse_down_event send_mouse_drag_event send_mouse_up_event send_region send_serialized_item send_tuple send_xld serialize_bar_code_model serialize_calib_data serialize_cam_par serialize_camera_setup_model serialize_class_box serialize_class_gmm serialize_class_knn serialize_class_mlp serialize_class_svm serialize_class_train_data serialize_component_model serialize_data_code_2d_model serialize_deformable_model serialize_deformable_surface_model serialize_descriptor_model serialize_distance_transform_xld serialize_dual_quat serialize_fft_optimization_data serialize_hom_mat2d serialize_hom_mat3d serialize_image serialize_matrix serialize_measure serialize_metrology_model serialize_ncc_model serialize_object serialize_object_model_3d serialize_ocr serialize_ocr_class_cnn serialize_ocr_class_knn serialize_ocr_class_mlp serialize_ocr_class_svm serialize_ocv serialize_pose serialize_quat serialize_region serialize_sample_identifier serialize_shape_model serialize_shape_model_3d serialize_sheet_of_light_model serialize_surface_model serialize_template serialize_texture_inspection_model serialize_training_components serialize_tuple serialize_variation_model serialize_xld set_aop_info set_bar_code_param set_bar_code_param_specific set_bead_inspection_param set_bg_esti_params set_calib_data set_calib_data_calib_object set_calib_data_cam_param set_calib_data_observ_points set_calib_data_observ_pose set_camera_setup_cam_param set_camera_setup_param set_check set_class_box_param set_color set_colored set_comprise set_compute_device_param set_content_update_callback set_current_dir set_data_code_2d_param set_deformable_model_origin set_deformable_model_param set_descriptor_model_origin set_diagonal_matrix set_distance_transform_xld_param set_draw set_drawing_object_callback set_drawing_object_params set_drawing_object_xld set_feature_lengths_class_train_data set_fix set_fixed_lut set_font set_framegrabber_callback set_framegrabber_lut set_framegrabber_param set_full_matrix set_fuzzy_measure set_fuzzy_measure_norm_pair set_gray set_grayval set_hsi set_icon set_insert set_io_channel_param set_io_device_param set_line_approx set_line_style set_line_width set_local_deformable_model_metric set_lut set_lut_style set_message_obj set_message_param set_message_queue_param set_message_tuple set_metrology_model_image_size set_metrology_model_param set_metrology_object_fuzzy_param set_metrology_object_param set_mshape set_ncc_model_origin set_ncc_model_param set_object_model_3d_attrib set_object_model_3d_attrib_mod set_offset_template set_origin_pose set_paint set_params_class_knn set_part set_part_style set_pixel set_planar_calib_deformable_model_metric set_planar_uncalib_deformable_model_metric set_profile_sheet_of_light set_reference_template set_regularization_params_class_mlp set_regularization_params_ocr_class_mlp set_rejection_params_class_mlp set_rejection_params_ocr_class_mlp set_rgb set_rgba set_sample_identifier_object_info set_sample_identifier_param set_scene_3d_camera_pose set_scene_3d_instance_param set_scene_3d_instance_pose set_scene_3d_label_param set_scene_3d_light_param set_scene_3d_param set_scene_3d_to_world_pose set_serial_param set_shape set_shape_model_metric set_shape_model_origin set_shape_model_param set_sheet_of_light_param set_socket_param set_spy set_stereo_model_image_pairs set_stereo_model_param set_sub_matrix set_surface_model_param set_system set_text_model_param set_texture_inspection_model_param set_tposition set_tshape set_value_matrix set_window_attr set_window_dc set_window_extents set_window_param set_window_type sfs_mod_lr sfs_orig_lr sfs_pentland shade_height_field shape_histo_all shape_histo_point shape_trans shape_trans_xld shock_filter sigma_image signal_condition signal_event sim_caltab simplify_object_model_3d simulate_defocus simulate_motion sin_image skeleton slide_image smallest_bounding_box_object_model_3d smallest_circle smallest_circle_xld smallest_rectangle1 smallest_rectangle1_xld smallest_rectangle2 smallest_rectangle2_xld smallest_sphere_object_model_3d smooth_contours_xld smooth_funct_1d_gauss smooth_funct_1d_mean smooth_image smooth_object_model_3d sobel_amp sobel_dir socket_accept_connect solve_matrix sort_contours_xld sort_region sp_distribution spatial_relation split_contours_xld split_skeleton_lines split_skeleton_region sqrt_image sqrt_matrix sqrt_matrix_mod stationary_camera_self_calibration sub_image sub_matrix sub_matrix_mod suggest_lexicon sum_matrix surface_normals_object_model_3d svd_matrix symm_difference symm_difference_closed_contours_xld symm_difference_closed_polygons_xld symmetry system_call tan_image test_closed_xld test_equal_obj test_equal_region test_region_point test_sampset_box test_self_intersection_xld test_subset_region test_xld_point testd_ocr_class_box text_line_orientation text_line_slant texture_laws thickening thickening_golay thickening_seq thinning thinning_golay thinning_seq threshold threshold_sub_pix tile_channels tile_images tile_images_offset timed_wait_condition top_hat topographic_sketch train_class_gmm train_class_knn train_class_mlp train_class_svm train_model_components train_sample_identifier train_texture_inspection_model train_variation_model traind_ocr_class_box traind_ocv_proj trainf_ocr_class_box trainf_ocr_class_knn trainf_ocr_class_mlp trainf_ocr_class_mlp_protected trainf_ocr_class_svm trainf_ocr_class_svm_protected trans_from_rgb trans_pose_shape_model_3d trans_to_rgb transform_funct_1d transform_metrology_object translate_measure transpose_matrix transpose_matrix_mod transpose_region triangulate_object_model_3d trimmed_mean try_lock_mutex try_wait_event tuple_abs tuple_acos tuple_add tuple_and tuple_asin tuple_atan tuple_atan2 tuple_band tuple_bnot tuple_bor tuple_bxor tuple_ceil tuple_chr tuple_chrt tuple_concat tuple_cos tuple_cosh tuple_cumul tuple_deg tuple_deviation tuple_difference tuple_div tuple_environment tuple_equal tuple_equal_elem tuple_exp tuple_fabs tuple_find tuple_find_first tuple_find_last tuple_first_n tuple_floor tuple_fmod tuple_gen_const tuple_gen_sequence tuple_greater tuple_greater_elem tuple_greater_equal tuple_greater_equal_elem tuple_histo_range tuple_insert tuple_int tuple_intersection tuple_inverse tuple_is_int tuple_is_int_elem tuple_is_mixed tuple_is_number tuple_is_real tuple_is_real_elem tuple_is_string tuple_is_string_elem tuple_last_n tuple_ldexp tuple_length tuple_less tuple_less_elem tuple_less_equal tuple_less_equal_elem tuple_log tuple_log10 tuple_lsh tuple_max tuple_max2 tuple_mean tuple_median tuple_min tuple_min2 tuple_mod tuple_mult tuple_neg tuple_not tuple_not_equal tuple_not_equal_elem tuple_number tuple_or tuple_ord tuple_ords tuple_pow tuple_rad tuple_rand tuple_real tuple_regexp_match tuple_regexp_replace tuple_regexp_select tuple_regexp_test tuple_remove tuple_replace tuple_round tuple_rsh tuple_select tuple_select_mask tuple_select_range tuple_select_rank tuple_sgn tuple_sin tuple_sinh tuple_sort tuple_sort_index tuple_split tuple_sqrt tuple_str_bit_select tuple_str_first_n tuple_str_last_n tuple_strchr tuple_string tuple_strlen tuple_strrchr tuple_strrstr tuple_strstr tuple_sub tuple_substr tuple_sum tuple_symmdiff tuple_tan tuple_tanh tuple_type tuple_type_elem tuple_union tuple_uniq tuple_xor union1 union2 union2_closed_contours_xld union2_closed_polygons_xld union_adjacent_contours_xld union_cocircular_contours_xld union_collinear_contours_ext_xld union_collinear_contours_xld union_cotangential_contours_xld union_object_model_3d union_straight_contours_histo_xld union_straight_contours_xld unlock_mutex unproject_coordinates unwarp_image_vector_field update_bg_esti update_kalman update_window_pose var_threshold vector_angle_to_rigid vector_field_length vector_field_to_hom_mat2d vector_field_to_real vector_to_aniso vector_to_essential_matrix vector_to_fundamental_matrix vector_to_fundamental_matrix_distortion vector_to_hom_mat2d vector_to_hom_mat3d vector_to_pose vector_to_proj_hom_mat2d vector_to_proj_hom_mat2d_distortion vector_to_rel_pose vector_to_rigid vector_to_similarity volume_object_model_3d_relative_to_plane wait_barrier wait_condition wait_event wait_seconds watersheds watersheds_threshold wiener_filter wiener_filter_ni write_aop_knowledge write_bar_code_model write_calib_data write_cam_par write_camera_setup_model write_class_box write_class_gmm write_class_knn write_class_mlp write_class_svm write_class_train_data write_component_model write_contour_xld_arc_info write_contour_xld_dxf write_data_code_2d_model write_deformable_model write_deformable_surface_model write_descriptor_model write_distance_transform_xld write_fft_optimization_data write_funct_1d write_image write_io_channel write_lut write_matrix write_measure write_metrology_model write_ncc_model write_object write_object_model_3d write_ocr write_ocr_class_knn write_ocr_class_mlp write_ocr_class_svm write_ocr_trainf write_ocr_trainf_image write_ocv write_polygon_xld_arc_info write_polygon_xld_dxf write_pose write_region write_sample_identifier write_samples_class_gmm write_samples_class_mlp write_samples_class_svm write_serial write_shape_model write_shape_model_3d write_sheet_of_light_model write_string write_surface_model write_template write_texture_inspection_model write_training_components write_tuple write_variation_model x_range_funct_1d xyz_to_object_model_3d y_range_funct_1d zero_crossing zero_crossing_sub_pix zero_crossings_funct_1d zoom_image_factor zoom_image_size zoom_region';
	
	  var reservedFunctions = 'H_MSG_FAIL H_MSG_FALSE H_MSG_TRUE H_MSG_VOID H_TYPE_ANY H_TYPE_INT H_TYPE_MIXED H_TYPE_REAL H_TYPE_STRING abs acos and asin atan atan2 band bnot bor bxor ceil chr chrt cos cosh cumul deg deviation environment exp fabs false find floor fmod gen_tuple_const int inverse is_int is_int_elem is_mixed is_number is_real is_real_elem is_string is_string_elem ldexp log log10 lsh max max2 mean median min min2 not or ord ords par_start pow rad rand real regexp_match regexp_replace regexp_select regexp_test remove replace round rsh select_mask select_rank sgn sin sinh sort sort_index split sqrt strchr strlen strrchr strrstr strstr subset sum tan tanh true type type_elem uniq xor';
	
	  var reservedControl = 'assign assign_at break case catch comment continue convert_tuple_to_vector_1d convert_vector_to_tuple default else elseif endfor endif endswitch endtry endwhile executable_expression exit export_def for global if ifelse import insert par_join repeat return stop switch throw try until while';
	
	  this.regexList = [{
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    regex: new RegExp(this.getKeywords(ops), 'gm'),
	    css: 'color1'
	  }, {
	    regex: new RegExp(this.getKeywords(reservedFunctions), 'gm'),
	    css: 'functions'
	  }, {
	    regex: new RegExp(this.getKeywords(reservedControl) + '|:=', 'gm'),
	    css: 'keyword'
	  }, {
	    regex: new RegExp(/\*.*/, 'gm'),
	    css: 'comments'
	  }];
	}
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['halcon', 'hdevelop', 'hdev'];
	module.exports = Brush;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  var keywords = 'ABS ACOS ACTION ADD AND ANDN ANY ANY_BIT ANY_DATE ANY_INT ANY_NUM ANY_REAL ARRAY ASIN AT ATAN ' + 'BOOL BY BYTE ' + 'CAL CALC CALCN CASE CD CDT CLK CONCAT CONFIGURATION CONSTANT COS CTD CTU CTUD CU CV ' + 'D DATE DATE_AND_TIME DELETE DINT DIV DO DS DT DWORD ' + 'ELSE ELSIF END_ACTION END_CASE END_CONFIGURATION END_FOR END_FUNCTION END_FUNCTION_BLOCK END_IF END_PROGRAM END_REPEAT END_RESOURCE END_STEP END_STRUCT END_TRANSITION END_TYPE END_VAR END_WHILE EN ENO EQ ET EXIT EXP EXPT ' + 'FALSE F_EDGE F_TRIG FIND FOR FROM FUNCTION FUNCTION_BLOCK ' + 'GE GT' + 'IF IN INITIAL_STEP INSERT INT INTERVAL ' + 'JMP JMPC JMPCN ' + 'L LD LDN LE LEFT LEN LIMIT LINT LN LOG LREAL LT LWORD ' + 'MAX MID MIN MOD MOVE MUL MUX ' + 'N NE NEG NOT ' + 'OF ON OR OEN ' + 'P PRIORITY PROGRAM PT PV ' + 'Q Q1 QU QD ' + 'R R1 R_TRIG READ_ONLY READ_WRITE REAL RELEASE REPEAT REPLACE RESOURCE RET RETAIN RETC RTCN RETURN RIGHT ROL ROR RS RTC R_EDGE ' + 'S S1 SD SEL SEMA SHL SHR SIN SINGLE SINT SL SQRT SR ST STEP STN STRING STRUCT SUB ' + 'TAN TASK THEN TIME TIME_OF_DAY TO TOD TOF TON TP TRANSITION TRUE TYPE ' + 'UDINT UINT ULINT UNTIL USINT ' + 'VAR VAR_ACCESS VAR_EXTERNAL VAR_GLOBAL VAR_INPUT VAR_IN_OUT VAR_OUTPUT ' + 'WHILE WITH WORD ' + 'XOR XORN';
	
	  this.regexList = [{
	    //time literal
	    regex: /(T|t|TIME|time)(?=.*([hms]|[HMS]))#(\d+(h|H))?(\d+(m|M))?(\d+(s|s))?(\d+(ms|MS))?/g,
	    css: 'color2'
	  }, {
	    // date and time literal
	    regex: /(DT|dt|date_and_time|DATE_AND_TIME)#\d{4}-\d{2}-\d{2}-\d{2}:\d{2}:\d{2}\.\d{2}/g,
	    css: 'color2'
	  }, {
	    // time of day literal
	    regex: /(TOD|tod|time_of_day|TIME_OF_DAY)#\d+:\d+(:\d+)?((\.\d+)|(\.?))/g,
	    css: 'color2'
	  }, {
	    //date literal
	    regex: /(D|d|DATE|date)#\d{4}-\d{2}-\d{2}/g,
	    css: 'color2'
	  }, {
	    //direct adressing
	    regex: /%[A-Z]{1,2}\d+(\.\d+)*/g,
	    css: 'color2'
	  }, {
	    //multiline comment (* *)
	    regex: /\(\*[\s\S]*?\*\)/gm,
	    css: 'comments'
	  }, {
	    //string literal 'myvalue'
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    //number integers, floating point with dot or exponential
	    regex: /\b\d+([\.eE]\d+)?\b/g,
	    css: 'value'
	  }, {
	    //keywords
	    regex: new RegExp(this.getKeywords(keywords), 'gmi'),
	    css: 'keyword'
	  }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['structuredtext', 'ST', 'IEC61131', 'st', 'iec61131'];
	module.exports = Brush;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
	  var keywords = 'abstract annotation as break by catch class companion const constructor continue' + ' crossinline data do dynamic else enum external false final finally for fun get if' + ' import in infix init inline inner interface internal is lateinit noinline null object' + ' open operator out override package private protected public reified return sealed' + ' set super tailrec this throw trait true try type val var vararg when where while' + ' String Array Unit Int';
	
	  this.regexList = [{
	    // line comment
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    // block comment
	    regex: /\/\*([^\*][\s\S]*?)?\*\//gm,
	    css: 'comments'
	  }, {
	    // javadoc
	    regex: /\/\*(?!\*\/)\*[\s\S]*?\*\//gm,
	    css: 'preprocessor'
	  }, {
	    regex: regexLib.doubleQuotedString,
	    css: 'string'
	  }, {
	    regex: regexLib.singleQuotedString,
	    css: 'string'
	  }, {
	    // numbers
	    regex: /\b([\d]+(\.[\d]+)?f?|[\d]+l?|0x[a-f0-9]+)\b/gi,
	    css: 'value'
	  }, {
	    // annotations
	    regex: /\@(Target|Retention|Repeatable|MustBeDocumented|Test|Deprecated)/g,
	    css: 'color2'
	  }, {
	    // User-site targets
	    regex: /\@(file|property|field|get|set|receiver|param|setparam|delegate):/g,
	    css: 'color2'
	  }, {
	    // @Inject annotation
	    regex: /\@(Inject)\b/g,
	    css: 'color3'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }];
	
	  this.forHtmlScript({
	    left: /(&lt;|<)%[@!=]?/g,
	    right: /%(&gt;|>)/g
	  });
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['kotlin'];
	module.exports = Brush;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * SyntaxHighlighter LaTeX Brush by DiGMi
	 * http://digmi.org
	 *
	 * Used for SyntaxHighlighter which can be found at:
	 * http://alexgorbatchev.com/SyntaxHighlighter
	 *
	 * @version
	 * 1.0.0 (July 21 2012)
	 * 
	 * @copyright
	 * Copyright (C) 2012 Or Dagmi.
	 *               2016 Erik Wegner
	 */
	var BrushBase = __webpack_require__(22);
	
	function Brush() {
	  var keywords = 'if fi then elif else for do done until while break continue case function return in eq ne gt lt ge le';
	  var specials = 'include usepackage begin end ref label includegraphics';
	
	  this.regexList = [{ regex: /%.*$/gm,
	    css: 'comments' }, { regex: /\$[\s\S]*?\$/gm,
	    css: 'string' }, { regex: /\\\w+/gm, // Command
	    css: 'keyword' }, { regex: /\{.*}/gm, // Parameter
	    css: 'color2' }, { regex: /\[.*]/gm, // Optional Parameter
	    css: 'color3' }, { regex: new RegExp(this.getKeywords(specials), 'gm'), css: 'color3' }, { regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword' }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['latex'];
	module.exports = Brush;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	function Brush() {
	    var functions = 'subst patsubst strip findstring filter filter-out sort dir notdir suffix basename addsuffix addprefix join word wordlist words firstword wildcard foreach origin shell';
	    var constants = 'PHONY SUFFIXES DEFAULT PRECIOUS INTERMEDIATE SECONDARY IGNORE SILENT EXPORT_ALL_VARIABLES';
	    this.regexList = [{ regex: regexLib.singleLinePerlComments, css: 'comments' }, // one line comments
	    { regex: regexLib.doubleQuotedString, css: 'string' }, // double quoted strings
	    { regex: regexLib.singleQuotedString, css: 'string' }, // single quoted strings
	    { regex: /\$\([^\@%<\?\^\+\*]\w+\)/gm, css: 'variable' }, // 変数
	    { regex: /((\$\(?[\@%<\?\^\+\*](D\)|F\))*)|%|\$&lt;)/gm, css: 'keyword' }, // 自動変数
	    { regex: new RegExp(this.getKeywords(functions), 'gm'), css: 'functions' }, // テキスト変形関数
	    { regex: new RegExp(this.getKeywords(constants), 'gm'), css: 'constants' // ビルトインターゲット名  
	    }];
	}
	Brush.prototype = new BrushBase();
	Brush.aliases = ['Makefile'];
	module.exports = Brush;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
		var keywords = 'alias break case catch catchQuiet continue default do else false float for global if in int matrix proc return source string switch true vector while';
		var functions = 'aaf2fcp about abs addAttr addDynamic addExtension addMetadata addPP affectedNet affects aimConstraint air aliasAttr align alignCtx alignCurve alignSurface allNodeTypes ambientLight angle angleBetween animCurveEditor animDisplay animLayer animView annotate applyAttrPattern applyMetadata applyTake arclen arcLenDimContext arcLengthDimension arrayMapper art3dPaintCtx artAttrCtx artAttrPaintVertexCtx artAttrSkinPaintCtx artAttrTool artBuildPaintMenu artFluidAttrCtx artPuttyCtx artSelectCtx artSetPaintCtx artUserPaintCtx assembly assignCommand assignInputDevice assignViewportFactories attachCurve attachDeviceAttr attachSurface attrColorSliderGrp attrCompatibility attrControlGrp attrEnumOptionMenu attrEnumOptionMenuGrp attrFieldGrp attrFieldSliderGrp attributeInfo attributeMenu attributeName attributeQuery attrNavigationControlGrp audioTrack autoKeyframe autoPlace autoSave bakeClip bakePartialHistory bakeResults bakeSimulation baseTemplate baseView batchRender bevel bevelPlus bezierAnchorPreset bezierAnchorState bezierCurveToNurbs bezierInfo bindSkin binMembership blend2 blendShape blendShapeEditor blendShapePanel blendTwoAttr blindDataType boneLattice boundary boxDollyCtx boxZoomCtx bufferCurve buildBookmarkMenu buildKeyframeMenu button buttonManip cacheFile cacheFileCombine cacheFileMerge cacheFileTrack callbacks camera cameraSet cameraView canCreateCaddyManip canCreateManip canvas ceil changeSubdivComponentDisplayLevel changeSubdivRegion channelBox character characterize characterMap chdir checkBox checkBoxGrp checkDefaultRenderGlobals choice circle circularFillet clamp clear clearCache clip clipEditor clipEditorCurrentTimeCtx clipMatching clipSchedule clipSchedulerOutliner closeCurve closeSurface cluster cmdFileOutput cmdScrollFieldExecuter cmdScrollFieldReporter cmdShell coarsenSubdivSelectionList collision color colorAtPoint colorEditor colorIndex colorIndexSliderGrp colorInputWidgetGrp colorManagementCatalog colorManagementFileRules colorManagementPrefs colorSliderButtonGrp colorSliderGrp columnLayout commandEcho commandLine commandLogging commandPort componentBox componentEditor condition cone confirmDialog connectAttr connectControl connectDynamic connectionInfo connectJoint constrain constrainValue constructionHistory container containerBind containerProxy containerPublish containerTemplate containerView contextInfo control convertIffToPsd convertSolidTx convertTessellation convertUnit copyAttr copyDeformerWeights copyFlexor copyKey copySkinWeights cos createAttrPatterns createDisplayLayer createEditor createLayeredPsdFile createNode createRenderLayer createSubdivRegion cross ctxAbort ctxCompletion ctxEditMode ctxTraverse currentCtx currentTime currentTimeCtx currentUnit curve curveAddPtCtx curveCVCtx curveEditorCtx curveEPCtx curveIntersect curveMoveEPCtx curveOnSurface curveRGBColor curveSketchCtx cutKey cycleCheck cylinder dagObjectCompare dagPose dataStructure date dbcount dbmessage dbpeek dbtrace defaultLightListCheckBox defaultNavigation defineDataServer defineVirtualDevice deformer deformerWeights deg_to_rad delete deleteAttr deleteAttrPattern deleteExtension deleteUI delrandstr deltaMush detachCurve detachDeviceAttr detachSurface deviceEditor deviceManager devicePanel dgdirty dgeval dgfilter dgInfo dgmodified dgtimer dimWhen directionalLight directKeyCtx dirmap disable disableIncorrectNameWarning disconnectAttr disconnectJoint diskCache displacementToPoly displayAffected displayColor displayCull displayLevelOfDetail displayPref displayRGBColor displaySmoothness displayStats displayString displaySurface distanceDimContext distanceDimension doBlur dockControl dolly dollyCtx dopeSheetEditor dot doubleProfileBirailSurface drag dragAttrContext draggerContext dropoffLocator duplicate duplicateCurve duplicateSurface dynamicLoad dynCache dynControl dynExport dynExpression dynGlobals dynPaintEditor dynParticleCtx dynPref editDisplayLayerGlobals editDisplayLayerMembers editMetadata editor editorTemplate editRenderLayerAdjustment editRenderLayerGlobals editRenderLayerMembers effector emit emitter enableDevice encodeString env erf error eval evalDeferred evalEcho evalNoSelectNotify evaluationManager evaluator event exactWorldBoundingBox exclusiveLightCheckBox exec exists exp exportEdits expression expressionEditorListen extendCurve extendSurface extrude falloffCurve fcheck fclose feof fflush fgetline fgetword file fileBrowserDialog fileDialog fileDialog2 fileInfo filePathEditor filetest filletCurve filter filterCurve filterExpand filterStudioImport findKeyframe findType fitBspline flexor floatField floatFieldGrp floatScrollBar floatSlider floatSlider2 floatSliderButtonGrp floatSliderGrp floor flow flowLayout fluidCacheInfo fluidEmitter fluidVoxelInfo flushUndo fmod fontDialog fopen format formLayout fprint frameBufferName frameLayout fread freadAllLines freadAllText freeFormFillet frewind fwrite fwriteAllLines fwriteAllText gamma gauss geomBind geometryConstraint geomToBBox getAttr getClassification getDefaultBrush getenv getFileList getFluidAttr getInputDeviceRange getLastError getMetadata getModifiers getModulePath getPanel getParticleAttr getpid getProcArguments getRenderDependencies getRenderTasks globalStitch glRender glRenderEditor gmatch goal grabColor gradientControl gradientControlNoAttr graphDollyCtx graphSelectContext graphTrackCtx gravity greasePencilCtx grid gridLayout group hardenPointCurve hardware hardwareRenderPanel hasMetadata headsUpDisplay headsUpMessage help helpLine hermite hide hikGlobals hilite hitTest hotBox hotkey hotkeyCheck hotkeyCtx hotkeyEditorPanel hotkeySet hsv_to_rgb hudButton hudSlider hudSliderButton hwReflectionMap hwRender hwRenderLoad hyperGraph hyperPanel hyperShade hypot iconTextButton iconTextCheckBox iconTextRadioButton iconTextRadioCollection iconTextScrollList iconTextStaticLabel ikfkDisplayMethod ikHandle ikHandleCtx ikHandleDisplayScale ikSolver ikSplineHandleCtx ikSystem ikSystemInfo illustratorCurves image imagePlane imfPlugins inheritTransform insertJoint insertJointCtx insertKeyCtx insertKnotCurve insertKnotSurface instance instanceable instancer internalVar intersect intField intFieldGrp intScrollBar intSlider intSliderGrp inViewEditor inViewMessage iprEngine isConnected isDirty isolateSelect isTrue itemFilter itemFilterAttr itemFilterType joint jointCluster jointCtx jointDisplayScale jointLattice keyframe keyframeOutliner keyframeRegionCurrentTimeCtx keyframeRegionDirectKeyCtx keyframeRegionDollyCtx keyframeRegionInsertKeyCtx keyframeRegionMoveKeyCtx keyframeRegionScaleKeyCtx keyframeRegionSelectKeyCtx keyframeRegionSetKeyCtx keyframeRegionTrackCtx keyframeStats keyingGroup keyTangent lassoContext lattice latticeDeformKeyCtx launch launchImageEditor layerButton layeredShaderPort layeredTexturePort layout layoutDialog license lightlink lightList linearPrecision linstep listAnimatable listAttr listAttrPatterns listCameras listConnections listDeviceAttachments listHistory listInputDeviceAxes listInputDeviceButtons listInputDevices listNodesWithIncorrectNames listNodeTypes listRelatives listSets loadFluid loadModule loadPlugin loadPrefObjects loadUI lockNode loft log lookThru ls lsThroughFilter lsUI mag makebot makeIdentity makeLive makePaintable makeSingleSurface manipMoveContext manipMoveLimitsCtx manipOptions manipPivot manipRotateContext manipRotateLimitsCtx manipScaleContext manipScaleLimitsCtx marker match max maxfloat maxint mayaDpiSetting melInfo melOptions memory menu menuBarLayout menuEditor menuItem menuSet menuSetPref messageLine min minfloat minimizeApp minint mirrorJoint modelCurrentTimeCtx modelEditor modelPanel moduleInfo mouse move moveKeyCtx moveVertexAlongDirection movieInfo movIn movOut multiProfileBirailSurface multiTouch mute nameCommand nameField namespace namespaceInfo nBase newton nodeCast nodeEditor nodeIconButton nodeOutliner nodePreset nodeTreeLister nodeType noise nonLinear normalConstraint nParticle nSoft nurbsBoolean nurbsCopyUVSet nurbsCube nurbsCurveToBezier nurbsEditUV nurbsPlane nurbsSelect nurbsSquare nurbsToPoly nurbsToPolygonsPref nurbsToSubdiv nurbsToSubdivPref nurbsUVSet objectCenter objectType objectTypeUI objExists offsetCurve offsetCurveOnSurface offsetSurface ogs ogsRender openGLExtension openMayaPref optionMenu optionMenuGrp optionVar orbit orbitCtx orientConstraint outlinerEditor outlinerPanel overrideModifier paintEffectsDisplay pairBlend palettePort panel paneLayout panelConfiguration panelHistory panZoom panZoomCtx paramDimContext paramDimension paramLocator parent parentConstraint particle particleExists particleFill particleInstancer particleRenderInfo partition pasteKey pathAnimation pause pclose perCameraVisibility percent performanceOptions pfxstrokes pickWalk picture pixelMove planarSrf plane play playbackOptions playblast pluginDisplayFilter pluginInfo pointConstraint pointCurveConstraint pointLight pointOnCurve pointOnPolyConstraint pointOnSurface pointPosition poleVectorConstraint polyAppend polyAppendFacetCtx polyAppendVertex polyAutoProjection polyAverageNormal polyAverageVertex polyBevel polyBevel3 polyBlendColor polyBlindData polyBoolOp polyBridgeEdge polyCacheMonitor polyCBoolOp polyCheck polyChipOff polyClipboard polyCloseBorder polyCollapseEdge polyCollapseFacet polyColorBlindData polyColorDel polyColorMod polyColorPerVertex polyColorSet polyCompare polyCone polyConnectComponents polyContourProjection polyCopyUV polyCrease polyCreaseCtx polyCreateFacet polyCreateFacetCtx polyCube polyCut polyCutCtx polyCylinder polyCylindricalProjection polyDelEdge polyDelFacet polyDelVertex polyDuplicateAndConnect polyDuplicateEdge polyEditEdgeFlow polyEditUV polyEditUVShell polyEvaluate polyExtrudeEdge polyExtrudeFacet polyExtrudeVertex polyFlipEdge polyFlipUV polyForceUV polyGeoSampler polyHelix polyHole polyInfo polyInstallAction polyLayoutUV polyListComponentConversion polyMapCut polyMapDel polyMapSew polyMapSewMove polyMergeEdge polyMergeEdgeCtx polyMergeFacet polyMergeFacetCtx polyMergeUV polyMergeVertex polyMirrorFace polyMoveEdge polyMoveFacet polyMoveFacetUV polyMoveUV polyMoveVertex polyMultiLayoutUV polyNormal polyNormalizeUV polyNormalPerVertex polyOptions polyOptUvs polyOutput polyPinUV polyPipe polyPlanarProjection polyPlane polyPlatonicSolid polyPoke polyPrimitive polyPrism polyProjectCurve polyProjection polyPyramid polyQuad polyQueryBlindData polyReduce polyRemesh polySelect polySelectConstraint polySelectConstraintMonitor polySelectCtx polySelectEditCtx polySeparate polySetToFaceNormal polySewEdge polyShortestPathCtx polySlideEdge polySmooth polySoftEdge polySphere polySphericalProjection polySplit polySplitCtx polySplitCtx2 polySplitEdge polySplitRing polySplitVertex polyStraightenUVBorder polySubdivideEdge polySubdivideFacet polyTorus polyToSubdiv polyTransfer polyTriangulate polyUnite polyUniteSkinned polyUVRectangle polyUVSet polyWedgeFace popen popupMenu pose pow preloadRefEd prepareRender print profiler profilerTool progressBar progressWindow projectCurve projectionContext projectionManip projectTangent promptDialog propModCtx propMove psdChannelOutliner psdEditTextureFile psdExport psdTextureFile putenv pwd python querySubdiv quit rad_to_deg radial radioButton radioButtonGrp radioCollection radioMenuItemCollection rampColorPort rand randstate rangeControl readTake rebuildCurve rebuildSurface recordAttr recordDevice redo reference referenceEdit referenceQuery refineSubdivSelectionList refresh refreshEditorTemplates regionSelectKeyCtx rehash relationship reloadImage removeJoint removeMultiInstance rename renameAttr renameUI render renderer renderGlobalsNode renderInfo renderLayerPostProcess renderManip renderPartition renderPassRegistry renderQualityNode renderSettings renderThumbnailUpdate renderWindowEditor renderWindowSelectContext reorder reorderContainer reorderDeformers requires reroot resampleFluid resetTool resolutionNode resourceManager retimeKeyCtx reverseCurve reverseSurface revolve rgb_to_hsv rigidBody rigidSolver roll rollCtx rot rotate rotationInterpolation roundConstantRadius rowColumnLayout rowLayout runTimeCommand runup sampleImage saveAllShelves saveFluid saveImage saveInitialState saveMenu savePrefObjects savePrefs saveShelf saveToolSettings saveViewportSettings scale scaleComponents scaleConstraint scaleKey scaleKeyCtx sceneEditor sceneUIReplacement scmh scriptCtx scriptEditorInfo scriptedPanel scriptedPanelType scriptJob scriptNode scriptTable scrollField scrollLayout sculpt sculptMeshCacheCtx sculptTarget seed select selectContext selectedNodes selectionConnection selectKey selectKeyCtx selectKeyframeRegionCtx selectMode selectPref selectPriority selectType selLoadSettings separator sequenceManager setAttr setAttrMapping setDefaultShadingGroup setDrivenKeyframe setDynamic setEditCtx setFluidAttr setFocus setInfinity setInputDeviceMapping setKeyCtx setKeyframe setKeyframeBlendshapeTargetWts setKeyPath setMenuMode setNodeTypeFlag setParent setParticleAttr setRenderPassType sets setStartupMessage setToolTo setUITemplate setXformManip shadingConnection shadingGeometryRelCtx shadingLightRelCtx shadingNetworkCompare shadingNode shapeCompare shelfButton shelfLayout shelfTabLayout shot shotRipple shotTrack showHelp showHidden showManipCtx showMetadata showSelectionInTitle showShadingGroupAttrEditor showWindow sign simplify sin singleProfileBirailSurface size sizeBytes skinBindCtx skinCluster skinPercent smoothCurve smoothstep smoothTangentSurface snapKey snapMode snapshot snapshotBeadCtx snapshotModifyKeyCtx snapTogetherCtx soft softMod softModCtx softSelect soloMaterial sort sortCaseInsensitive sound soundControl spaceLocator sphere sphrand spotLight spotLightPreviewPort spreadSheetEditor spring sqrt squareSurface srtContext stackTrace stereoCameraView stereoRigManager stitchSurface stitchSurfacePoints strcmp stringArrayIntersector stringArrayRemove stroke subdAutoProjection subdCleanTopology subdCollapse subdDuplicateAndConnect subdEditUV subdiv subdivCrease subdivDisplaySmoothness subdLayoutUV subdListComponentConversion subdMapCut subdMapSewMove subdMatchTopology subdMirror subdPlanarProjection subdToBlind subdToPoly subdTransferUVsToCache substitute substituteGeometry substring suitePrefs surface surfaceSampler surfaceShaderList swatchDisplayPort swatchRefresh switchTable symbolButton symbolCheckBox symmetricModelling sysFile system tabLayout tan tangentConstraint targetWeldCtx texCutContext texLatticeDeformContext texManipContext texMoveContext texMoveUVShellContext texRotateContext texScaleContext texSculptCacheContext texSelectContext texSelectShortestPathCtx texSmudgeUVContext text textCurves textField textFieldButtonGrp textFieldGrp textManip textScrollList textureDeformer texturePlacementContext textureWindow texTweakUVContext texWinToolCtx threadCount threePointArcCtx timeCode timeControl timePort timer timerX timeWarp toggle toggleAxis toggleWindowVisibility tokenize tolerance tolower toolBar toolButton toolCollection toolDropped toolHasOptions toolPropertyWindow torus toupper trace track trackCtx transferAttributes transferShadingSets transformCompare transformLimits translator treeLister treeView trim trunc truncateFluidCache truncateHairCache tumble tumbleCtx turbulence twoPointArcCtx ubercam uiTemplate unassignInputDevice undo undoInfo unfold ungroup uniform unit unknownNode unknownPlugin unloadPlugin untangleUV untrim upAxis userCtx uvLink uvSnapshot vectorize view2dToolCtx viewCamera viewClipPlane viewFit viewHeadOn viewLookAt viewManip viewPlace viewSet visor vnn vnnCompound vnnConnect volumeAxis volumeBind vortex waitCursor walkCtx warning webBrowser webBrowserPrefs webView whatIs whatsNewHighlight window windowPref wire wireContext workspace wrinkle wrinkleContext writeTake xform xformConstraint xpmPicker';
		this.regexList = [{ regex: regexLib.singleLineCComments, css: 'comments' }, { regex: regexLib.multiLineCComments, css: 'color1' }, { regex: regexLib.doubleQuotedString, css: 'string' }, { regex: new RegExp(this.getKeywords(functions), 'gm'), css: 'functions italic' }, { regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword' }];
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['mel'];
	module.exports = Brush;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	
	function Brush() {
		var datatypes = 'ATOM BOOL BOOLEAN BYTE CHAR COLORREF DWORD DWORDLONG DWORD_PTR ' + 'DWORD32 DWORD64 FLOAT HACCEL HALF_PTR HANDLE HBITMAP HBRUSH ' + 'HCOLORSPACE HCONV HCONVLIST HCURSOR HDC HDDEDATA HDESK HDROP HDWP ' + 'HENHMETAFILE HFILE HFONT HGDIOBJ HGLOBAL HHOOK HICON HINSTANCE HKEY ' + 'HKL HLOCAL HMENU HMETAFILE HMODULE HMONITOR HPALETTE HPEN HRESULT ' + 'HRGN HRSRC HSZ HWINSTA HWND INT INT_PTR INT32 INT64 LANGID LCID LCTYPE ' + 'LGRPID LONG LONGLONG LONG_PTR LONG32 LONG64 LPARAM LPBOOL LPBYTE LPCOLORREF ' + 'LPCSTR LPCTSTR LPCVOID LPCWSTR LPDWORD LPHANDLE LPINT LPLONG LPSTR LPTSTR ' + 'LPVOID LPWORD LPWSTR LRESULT PBOOL PBOOLEAN PBYTE PCHAR PCSTR PCTSTR PCWSTR ' + 'PDWORDLONG PDWORD_PTR PDWORD32 PDWORD64 PFLOAT PHALF_PTR PHANDLE PHKEY PINT ' + 'PINT_PTR PINT32 PINT64 PLCID PLONG PLONGLONG PLONG_PTR PLONG32 PLONG64 POINTER_32 ' + 'POINTER_64 PSHORT PSIZE_T PSSIZE_T PSTR PTBYTE PTCHAR PTSTR PUCHAR PUHALF_PTR ' + 'PUINT PUINT_PTR PUINT32 PUINT64 PULONG PULONGLONG PULONG_PTR PULONG32 PULONG64 ' + 'PUSHORT PVOID PWCHAR PWORD PWSTR SC_HANDLE SC_LOCK SERVICE_STATUS_HANDLE SHORT ' + 'SIZE_T SSIZE_T TBYTE TCHAR UCHAR UHALF_PTR UINT UINT_PTR UINT32 UINT64 ULONG ' + 'ULONGLONG ULONG_PTR ULONG32 ULONG64 USHORT USN VOID WCHAR WORD WPARAM WPARAM WPARAM ' + 'char bool short int __int32 __int64 __int8 __int16 long float double __wchar_t ' + 'clock_t _complex _dev_t _diskfree_t div_t ldiv_t _exception _EXCEPTION_POINTERS ' + 'FILE _finddata_t _finddatai64_t _wfinddata_t _wfinddatai64_t __finddata64_t ' + '__wfinddata64_t _FPIEEE_RECORD fpos_t _HEAPINFO _HFILE lconv intptr_t id ' + 'jmp_buf mbstate_t _off_t _onexit_t _PNH ptrdiff_t _purecall_handler ' + 'sig_atomic_t size_t _stat __stat64 _stati64 terminate_function ' + 'time_t __time64_t _timeb __timeb64 tm uintptr_t _utimbuf ' + 'va_list wchar_t wctrans_t wctype_t wint_t signed';
	
		var keywords = 'break case catch class copy const __finally __exception __try ' + 'const_cast continue private public protected __declspec ' + 'default delete deprecated dllexport dllimport do dynamic_cast ' + 'else enum explicit extern if for friend getter goto inline ' + 'mutable naked namespace new nil NO noinline nonatomic noreturn nothrow NULL ' + 'readonly readwrite register reinterpret_cast retain return SEL selectany self ' + 'setter sizeof static static_cast struct super switch template this ' + 'thread throw true false try typedef typeid typename union ' + 'using uuid virtual void volatile whcar_t while YES';
	
		var functions = 'assert isalnum isalpha iscntrl isdigit isgraph islower isprint' + 'ispunct isspace isupper isxdigit tolower toupper errno localeconv ' + 'setlocale acos asin atan atan2 ceil cos cosh exp fabs floor fmod ' + 'frexp ldexp log log10 modf pow sin sinh sqrt tan tanh jmp_buf ' + 'longjmp setjmp raise signal sig_atomic_t va_arg va_end va_start ' + 'clearerr fclose feof ferror fflush fgetc fgetpos fgets fopen ' + 'fprintf fputc fputs fread freopen fscanf fseek fsetpos ftell ' + 'fwrite getc getchar gets perror printf putc putchar puts remove ' + 'rename rewind scanf setbuf setvbuf sprintf sscanf tmpfile tmpnam ' + 'ungetc vfprintf vprintf vsprintf abort abs atexit atof atoi atol ' + 'bsearch calloc div exit free getenv labs ldiv malloc mblen mbstowcs ' + 'mbtowc qsort rand realloc srand strtod strtol strtoul system ' + 'wcstombs wctomb memchr memcmp memcpy memmove memset strcat strchr ' + 'strcmp strcoll strcpy strcspn strerror strlen strncat strncmp ' + 'strncpy strpbrk strrchr strspn strstr strtok strxfrm asctime ' + 'clock ctime difftime gmtime localtime mktime strftime time';
	
		this.regexList = [{
			regex: regexLib.singleLineCComments,
			css: 'comments'
		}, {
			regex: regexLib.multiLineCComments,
			css: 'comments'
		}, {
			regex: regexLib.doubleQuotedString,
			css: 'string'
		}, {
			regex: regexLib.singleQuotedString,
			css: 'string'
		}, {
			regex: /^ *#.*/gm,
			css: 'preprocessor'
		}, {
			regex: /^#!.*$/gm,
			css: 'preprocessor'
		}, {
			regex: new RegExp(this.getKeywords(datatypes), 'gm'),
			css: 'keyword bold'
		}, {
			regex: new RegExp(this.getKeywords(functions), 'gm'),
			css: 'functions bold'
		}, {
			regex: new RegExp(this.getKeywords(keywords), 'gm'),
			css: 'keyword bold'
		}, {
			regex: new RegExp('\\bNS\\w+\\b', 'gm'),
			css: 'keyword bold'
		}, {
			regex: new RegExp('\\bUI\\w+\\b', 'gm'),
			css: 'keyword bold'
		}, {
			regex: new RegExp('\\bIB\\w+\\b', 'gm'),
			css: 'keyword bold'
		}, {
			regex: new RegExp('@\\w+\\b', 'gm'),
			css: 'keyword bold'
		}];
	}
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['objective-c', 'obj-c', 'objc', 'oc'];
	module.exports = Brush;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Yaml Brush for SyntaxHighlighter
	 *
	 * ppepin@rentpath.com
	 * erik.wegner@ewus.de
	 *
	 */
	var BrushBase = __webpack_require__(22);
	
	function Brush() {
	  // Yaml Brush
	
	  var constants = '~ true false on off';
	
	  var regexLib = __webpack_require__(3).commonRegExp;
	
	  this.regexList = [{ regex: regexLib.singleLinePerlComments, css: 'comments' }, // comment
	  { regex: regexLib.doubleQuotedString, css: 'string' }, // double quoted string
	  { regex: regexLib.singleQuotedString, css: 'string' }, // single quoted string
	  { regex: /^\s*([a-z0-9\._-])+\s*:/gmi, css: 'variable' }, // key
	  { regex: /\s?(\.)([a-z0-9\._-])+\s?:/gmi, css: 'comments' }, // section
	  { regex: /\s(@|:)([a-z0-9\._-])+\s*$/gmi, css: 'variable bold' }, // variable, reference
	  { regex: /\s+\d+\s?$/gm, css: 'color2 bold' }, // integers
	  { regex: /(\{|\}|\[|\]|,|~|:)/gm, css: 'constants' }, // inline hash and array, comma, null
	  { regex: /^\s+(-)+/gm, css: 'string bold' }, // array list entry
	  { regex: /^---/gm, css: 'string bold' }, // category
	  { regex: new RegExp(this.getKeywords(constants), 'gmi'), css: 'constants' // constants
	  }];
	
	  this.forHtmlScript(regexLib.phpScriptTags);
	}
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['yaml', 'yml'];
	module.exports = Brush;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/*!
	  * domready (c) Dustin Diaz 2014 - License MIT
	  */
	!function (name, definition) {
	
	  if (true) module.exports = definition();else if (typeof define == 'function' && _typeof(define.amd) == 'object') define(definition);else this[name] = definition();
	}('domready', function () {
	
	  var fns = [],
	      _listener,
	      doc = document,
	      hack = doc.documentElement.doScroll,
	      domContentLoaded = 'DOMContentLoaded',
	      loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);
	
	  if (!loaded) doc.addEventListener(domContentLoaded, _listener = function listener() {
	    doc.removeEventListener(domContentLoaded, _listener);
	    loaded = 1;
	    while (_listener = fns.shift()) {
	      _listener();
	    }
	  });
	
	  return function (fn) {
	    loaded ? setTimeout(fn, 0) : fns.push(fn);
	  };
	});

/***/ }),
/* 61 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var string = exports.string = function string(value) {
	  return value.replace(/^([A-Z])/g, function (_, character) {
	    return character.toLowerCase();
	  }).replace(/([A-Z])/g, function (_, character) {
	    return '-' + character.toLowerCase();
	  });
	};
	
	var object = exports.object = function object(value) {
	  var result = {};
	  Object.keys(value).forEach(function (key) {
	    return result[string(key)] = value[key];
	  });
	  return result;
	};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	window.SyntaxHighlighter = _core2.default; // Compatability layer to support V3 brushes. This file is only included when `--compat`
	// flag is passed to the `gulp build` command.
	
	if (typeof window.XRegExp === 'undefined') {
	  window.XRegExp = __webpack_require__(3).XRegExp;
	}

/***/ }),

/* 63 */
/***/ (function(module, exports, __webpack_require__) {
	// This is an extension function to support the rust brush:
	'use strict';
	
	var BrushBase = __webpack_require__(22);
	var regexLib = __webpack_require__(3).commonRegExp;
	var Match = __webpack_require__(5).Match;

	function Brush() {
	  var keywords = 'as break const continue crate else enum extern false fn for if impl in let loop';
	  keywords += ' match mod move mut pub ref return self Self static struct super trait true type';
	  keywords += ' unsafe use where while async await dyn';
	
	  var reserved = 'abstract become box do final macro override priv typeof unsized virtual yield try';
	  var types = 'i8 i16 i32 i62 u8 u16 u32 u64 bool String Vec HashMap Set';

	  var weak = 'macro_rules union';

	  function fixMacros(match, regexInfo) {
	    var css = 'color3';
	    return [new Match(match[0].substring(0, match[0].length-1), match.index, css)];
	  }

	  function fixFunctions(match, regexInfo) {
	    var css = 'functions';
		var mstr = match[0].trim().substring(2).trim();
		mstr = mstr.substring(0, mstr.length-1);
		var offset = match[0].indexOf(mstr);
	    return [new Match(mstr, match.index+offset, css)];
	  }

	  this.regexList = [{
	    regex: regexLib.multiLineDoubleQuotedString,
	    css: 'string'
	  }, {
	    // regex: regexLib.multiLineSingleQuotedString,
		// Only one symbol in single quotes:
	    regex: /'[^']'/g,
	    css: 'string'
	  }, {
	    regex: regexLib.singleLineCComments,
	    css: 'comments'
	  }, {
	    regex: regexLib.multiLineCComments,
	    css: 'comments'
	  }, {
	    regex: /^ *#.*/gm,
	    css: 'preprocessor'
	  }, {
	    regex: /^#.*"/gm,
	    css: 'preprocessor'
	  }, {
	    regex: /\s*fn\s+[\w<>']+\s*\(/g,  // functions matching
	    func: fixFunctions
	  }, {
	    regex: /\s*(\w+!)(\(|\[)/g,  // macros matching
	    func: fixMacros
	  }, {
	    regex: new RegExp(this.getKeywords(types), 'gm'),
	    css: 'constants'
	  }, {
	    regex: new RegExp(this.getKeywords(reserved), 'gm'),
	    css: 'color2'
	  }, {
	    regex: new RegExp(this.getKeywords(weak), 'gm'),
	    css: 'color3'
	  }, {
	    regex: new RegExp(this.getKeywords(keywords), 'gm'),
	    css: 'keyword'
	  }];
	
	  this.forHtmlScript(regexLib.scriptScriptTags);
	};
	
	Brush.prototype = new BrushBase();
	Brush.aliases = ['rust'];
	module.exports = Brush;

/***/ })

/******/ ]);
//# sourceMappingURL=syntaxhighlighter.js.map