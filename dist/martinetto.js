(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["martinetto"] = factory();
	else
		root["martinetto"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _parser = __webpack_require__(1);

	var _parser2 = _interopRequireDefault(_parser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	console.log((0, _parser2.default)('/foo/:bar')('/foo/123'));

	exports.default = {
	  'Parser': _parser2.default
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(2);

	var _escapeStringRegexp = __webpack_require__(3);

	var _escapeStringRegexp2 = _interopRequireDefault(_escapeStringRegexp);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var tokenSeparator = '/';
	var namedParamPattern = /^:\w+$/;
	var defaultNamedParamValidationPattern = /^\w+$/;

	function parseRoute(path) {
	  var prefix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	  var pathToParse = pathWithoutPrefix(path, prefix);
	  var routeTokens = asTokens(pathToParse);
	  var routeRegExp = new RegExp(toPattern(routeTokens));
	  console.log(routeRegExp);
	  var expectedParamTokens = routeTokens.filter(function (token) {
	    return token.type === 'pathParam';
	  }).map(function (token) {
	    return token.value;
	  });

	  return function (locationStr) {
	    var paramMatches = locationStr.match(routeRegExp);
	    var isMatch = !!paramMatches;

	    if (!isMatch) {
	      return null;
	    } else {
	      var paramValues = paramMatches.splice(1);
	      var params = toPathParamsObject(expectedParamTokens, paramValues);
	      return {
	        path: locationStr,
	        params: params
	      };
	    }
	  };
	}

	function pathWithoutPrefix(path, prefix) {
	  var pathHasPrefix = path.startsWith(prefix);
	  return pathHasPrefix ? path.substring(prefix.length) : path;
	}

	function asTokens(path) {
	  return path.split(tokenSeparator).filter(function (token) {
	    return token.length > 0;
	  }).map(stringToToken);
	}

	function toPattern(routeTokens) {
	  return routeTokens.map(function (token) {
	    return token.pattern;
	  }).join((0, _escapeStringRegexp2.default)(tokenSeparator));
	}

	function stringToToken(part) {
	  if (part.match(namedParamPattern)) {
	    return {
	      type: 'pathParam',
	      value: part.substring(1),
	      pattern: '(\\w+)'
	    };
	  } else {
	    return {
	      type: 'literal',
	      value: part,
	      pattern: (0, _escapeStringRegexp2.default)(part)
	    };
	  }
	}

	function toPathParamsObject(expectedParams, paramValues) {
	  return (0, _utils.zip)(expectedParams, paramValues).reduce(function (params, _ref) {
	    var _ref2 = _slicedToArray(_ref, 2);

	    var key = _ref2[0];
	    var value = _ref2[1];

	    params[key] = value;
	    return params;
	  }, {});
	}

	exports.default = parseRoute;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.and = and;
	exports.zip = zip;

	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

	function and(arr) {
	  return arr.reduce(function (r, x) {
	    return r && x;
	  }, true);
	}

	function zip(a1, a2) {
	  var acc = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

	  var _a = _toArray(a1);

	  var a1Head = _a[0];

	  var a1Tail = _a.slice(1);

	  var _a2 = _toArray(a2);

	  var a2Head = _a2[0];

	  var a2Tail = _a2.slice(1);

	  if (typeof a1Head === 'undefined' && typeof a2Head === 'undefined') {
	    return acc;
	  } else {
	    return zip(a1Tail, a2Tail, acc.concat([[a1Head, a2Head]]));
	  }
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}

		return str.replace(matchOperatorsRe, '\\$&');
	};

/***/ }
/******/ ])
});
;