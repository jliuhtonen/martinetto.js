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

	console.log((0, _parser2.default)('/foo/:bar/*')('/foo/123/abba/cabba'));

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

	var wildcardTokenSeparator = '*';
	var wildcardTokenSeparatorRegExp = (0, _escapeStringRegexp2.default)(wildcardTokenSeparator);

	var pathTokenSeparator = '/';
	var pathTokenSeparatorRegExp = (0, _escapeStringRegexp2.default)(pathTokenSeparator);

	var namedParamPattern = /^:\w+$/;
	var defaultNamedParamValidationPattern = /^\w+$/;

	function parseRoute(route) {
	  var prefix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	  var routeToParse = pathWithoutPrefix(route, prefix);
	  var routeTokens = asTokens(routeToParse);
	  var routeRegExp = new RegExp(toPattern(routeTokens));
	  var expectedParamTokens = routeTokens.filter(function (token) {
	    return token.type !== 'literal';
	  });

	  return function (currentPath) {
	    var pathToMatch = pathWithoutPrefix(currentPath, prefix);
	    var paramMatches = pathToMatch.match(routeRegExp);
	    var isMatch = !!paramMatches;

	    if (!isMatch) {
	      return null;
	    } else {
	      var paramValues = paramMatches.splice(1);
	      var paramValuePairs = (0, _utils.zip)(expectedParamTokens, paramValues);

	      var pathParams = toPathParamsObject(paramValuePairs.filter(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2);

	        var param = _ref2[0];
	        var value = _ref2[1];
	        return param.type === 'pathParam';
	      }));

	      var wildcards = paramValuePairs.filter(function (_ref3) {
	        var _ref4 = _slicedToArray(_ref3, 2);

	        var param = _ref4[0];
	        var value = _ref4[1];
	        return param.type === 'wildcard';
	      }).map(function (_ref5) {
	        var _ref6 = _slicedToArray(_ref5, 2);

	        var param = _ref6[0];
	        var value = _ref6[1];
	        return value;
	      });

	      return {
	        path: currentPath,
	        pathParams: pathParams,
	        wildcards: wildcards
	      };
	    }
	  };
	}

	function pathWithoutPrefix(path, prefix) {
	  var pathHasPrefix = path.startsWith(prefix);
	  return pathHasPrefix ? path.substring(prefix.length) : path;
	}

	function asTokens(path) {
	  var wildcardTokens = path.split('*');
	  var tokenizedPaths = wildcardTokens.map(function (path) {
	    return path.split(pathTokenSeparator).filter(notEmpty).map(stringToToken);
	  });

	  var tokenizedWithWildcards = (0, _utils.intersperse)(tokenizedPaths, { type: 'wildcard', value: 'wildcard', pattern: '([\\w\/]*)' });

	  return (0, _utils.flatten)(tokenizedWithWildcards);
	}

	function toPattern(routeTokens) {
	  console.log("routeTokens", routeTokens);
	  return routeTokens.map(function (token) {
	    return token.pattern;
	  }).join(pathTokenSeparatorRegExp);
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

	function toPathParamsObject(paramValues) {
	  return paramValues.reduce(function (params, _ref7) {
	    var _ref8 = _slicedToArray(_ref7, 2);

	    var param = _ref8[0];
	    var value = _ref8[1];

	    params[param.value] = value;
	    return params;
	  }, {});
	}

	function notEmpty(enumerable) {
	  return enumerable.length > 0;
	}

	exports.default = parseRoute;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.flatten = flatten;
	exports.zip = zip;
	exports.intersperse = intersperse;
	function flatten(arr) {
	  return arr.reduce(function (flattened, item) {
	    return flattened.concat(item);
	  }, []);
	}

	function zip(a1, a2) {
	  var times = a1.length >= a2.length ? a1.length : a2.length;
	  var zipped = [];

	  for (var i = 0; i < times; ++i) {
	    zipped.push([a1[i], a2[i]]);
	  }

	  return zipped;
	}

	function intersperse(arr, elem) {
	  return arr.reduce(function (interspersed, item, index) {
	    var newItems = index === arr.length - 1 ? [item] : [item, elem];
	    return interspersed.concat(newItems);
	  }, []);
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