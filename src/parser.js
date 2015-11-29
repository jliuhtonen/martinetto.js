import {zip, and} from './utils'
import escapeStringRegexp from 'escape-string-regexp'

const tokenSeparator = '/'
const namedParamPattern = /^:\w+$/
const defaultNamedParamValidationPattern = /^\w+$/

function parseRoute(path, prefix = '') {
  const pathToParse = pathWithoutPrefix(path, prefix)
  const routeTokens = asTokens(pathToParse)
  const routeRegExp = new RegExp(toPattern(routeTokens))
  console.log(routeRegExp)
  const expectedParamTokens = routeTokens
    .filter(token => token.type === 'pathParam')
    .map(token => token.value)

  return function(locationStr) {
    const paramMatches = locationStr.match(routeRegExp)
    const isMatch = !!paramMatches

    if(!isMatch) {
      return null
    } else {
      const paramValues = paramMatches.splice(1)
      const params = toPathParamsObject(expectedParamTokens, paramValues)
      return {
        path: locationStr,
        params
      }
    }
  }
}

function pathWithoutPrefix(path, prefix) {
  const pathHasPrefix = path.startsWith(prefix)
  return pathHasPrefix ? path.substring(prefix.length) : path
}

function asTokens(path) {
  return path
    .split(tokenSeparator)
    .filter(token => token.length > 0)
    .map(stringToToken)
}

function toPattern(routeTokens) {
  return routeTokens.map(token => token.pattern).join(escapeStringRegexp(tokenSeparator))
}

function stringToToken(part) {
  if(part.match(namedParamPattern)) {
    return {
      type: 'pathParam',
      value: part.substring(1),
      pattern: '(\\w+)'
    }
  } else {
    return {
      type: 'literal',
      value: part,
      pattern: escapeStringRegexp(part)
    }
  }
}

function toPathParamsObject(expectedParams, paramValues) {
  return zip(expectedParams, paramValues).reduce((params, [key, value]) => {
    params[key] = value
    return params
  }, {})
}

export default parseRoute
