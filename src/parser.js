import {zip, and, flatten, intersperse} from './utils'
import escapeStringRegexp from 'escape-string-regexp'

const wildcardTokenSeparator = '*'
const wildcardTokenSeparatorRegExp = escapeStringRegexp(wildcardTokenSeparator)

const pathTokenSeparator = '/'
const pathTokenSeparatorRegExp = escapeStringRegexp(pathTokenSeparator)

const namedParamPattern = /^:\w+$/

function parseRoute(route, prefix = '') {
  const routeToParse = pathWithoutPrefix(route, prefix)
  const routeTokens = asTokens(routeToParse)
  const routeRegExp = new RegExp(toPattern(routeTokens))
  const expectedParamTokens = routeTokens
    .filter(token => token.type !== 'literal')

  return function(currentPath) {
    const pathToMatch = pathWithoutPrefix(currentPath, prefix)
    const paramMatches = pathToMatch.match(routeRegExp)
    const isMatch = !!paramMatches

    if(!isMatch) {
      return null
    } else {
      const paramValues = paramMatches.splice(1)
      const paramValuePairs = zip(expectedParamTokens, paramValues)

      const pathParams = toPathParamsObject(paramValuePairs
        .filter(([param, value]) => param.type === 'pathParam'))

      const wildcards = paramValuePairs
        .filter(([param, value]) => param.type === 'wildcard')
        .map(([param, value]) => value)

      return {
        path: currentPath,
        pathParams,
        wildcards
      }
    }
  }
}

function pathWithoutPrefix(path, prefix) {
  const pathHasPrefix = path.startsWith(prefix)
  return pathHasPrefix ? path.substring(prefix.length) : path
}

function asTokens(path) {
  const wildcardTokens = path.split('*')
  const tokenizedPaths = wildcardTokens.map(path => {
    return path
    .split(pathTokenSeparator)
    .filter(notEmpty)
    .map(stringToToken)
  })

  const tokenizedWithWildcards = intersperse(tokenizedPaths,
    { type: 'wildcard', value: 'wildcard', pattern: '([\\w\/]*)' })

  return flatten(tokenizedWithWildcards)
}

function toPattern(routeTokens) {
  return routeTokens.map(token => token.pattern).join(pathTokenSeparatorRegExp)
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

function toPathParamsObject(paramValues) {
  return paramValues.reduce((params, [param, value]) => {
    params[param.value] = value
    return params
  }, {})
}

function notEmpty(enumerable) {
  return enumerable.length > 0
}

export default parseRoute
