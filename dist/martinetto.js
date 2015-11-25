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

	var tokenSeparator = '/';
	var namedParamPattern = /^:\w+$/;
	var defaultNamedParamValidationPattern = /^\w+$/;

	function parseRoute(path) {
	  var prefix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	  var pathToParse = pathWithoutPrefix(path, prefix);
	  var routeTokens = asTokens(pathToParse);

	  return function (locationStr) {
	    var strTokens = asTokens(locationStr);
	    var strMatchTokens = strTokens.filter(function (token) {
	      return token.type === 'literal';
	    });

	    if (!compareTokens(routeTokens, strMatchTokens)) {
	      return { isMatch: false };
	    } else {
	      return {
	        isMatch: true,
	        params: getParams(routeTokens, strTokens)
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

	function stringToToken(part) {
	  if (part.match(namedParamPattern)) {
	    return {
	      type: 'pathParam',
	      value: part.substring(1)
	    };
	  } else {
	    return {
	      type: 'literal',
	      value: part
	    };
	  }
	}

	function compareTokens(routeTokens, locationTokens) {
	  var namedParamValidationPattern = arguments.length <= 2 || arguments[2] === undefined ? defaultNamedParamValidationPattern : arguments[2];

	  if (routeTokens.length !== locationTokens.length) {
	    return false;
	  }

	  var zippedTokens = (0, _utils.zip)(routeTokens, locationTokens);
	  console.log(zippedTokens);
	  var tokenMatches = zippedTokens.map(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2);

	    var routeToken = _ref2[0];
	    var locationToken = _ref2[1];
	    return tokenMatch(routeToken, locationToken, namedParamValidationPattern);
	  });
	  console.log(tokenMatches);
	  return (0, _utils.and)(tokenMatches);
	}

	function tokenMatch(routeToken, locationToken, validPathParamPattern) {
	  if (routeToken.type === 'pathParam') {
	    return !!locationToken.value.match(validPathParamPattern);
	  } else {
	    return locationToken.value === routeToken.value;
	  }
	}

	function getParams(routeTokens, locationTokens) {
	  return routeTokens.reduce(function (params, routeToken, index) {
	    if (routeToken.type === 'pathParam') {
	      params[routeToken.value] = locationTokens[index].value;
	    }

	    return params;
	  }, {});
	}

	function pathParamName(pathParam) {
	  return pathParam.substring(1);
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
	  }

	  return zip(a1Tail, a2Tail, acc.concat([[a1Head, a2Head]]));
	}

/***/ }
/******/ ])
});
;