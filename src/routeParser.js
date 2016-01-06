import {zip, intersperse, flatten, notEmpty, pathWithoutPrefix} from './utils'
import escapeStringRegexp from 'escape-string-regexp'
import {extractWildcardParams, extractPathParams} from './parameterExtract'
import parseQueryParams from './queryParams'

const fragmentSeparator = '#'
const querySeparator = '?'
const namedParamPattern = /^:\w+$/
const allowedPathChars = "A-Za-z0-9_\\.~:@\\-%!\\$&'\\(\\)\\*\\+,;="
const wildcardTokenSeparator = '*'
const wildcardToken = { type: 'wildcard', value: 'wildcard', pattern: `([${allowedPathChars}\/]*)` }
const pathTokenSeparator = '/'
const pathTokenSeparatorRegExp = escapeStringRegexp(pathTokenSeparator)

export function parseRoute(route, prefix = '') {
  const routeToParse = pathWithoutPrefix(route, prefix)
  const routeTokens = asTokens(routeToParse)
  const routeRegExp = new RegExp(toPattern(routeTokens))
  const expectedParamTokens = routeTokens
    .filter(token => token.type !== 'literal')

  return function(uriPath) {
    const pathParts = parseRelativePathParts(uriPath)
    const currentPath = pathParts.path

    const pathToMatch = pathWithoutPrefix(currentPath, prefix)
    const paramMatches = pathToMatch.match(routeRegExp)
    const isMatch = !!paramMatches

    if(!isMatch) {
      return null
    } else {
      const paramValues = paramMatches.splice(1)
      const paramValuePairs = zip(expectedParamTokens, paramValues)

      const pathParams = extractPathParams(paramValuePairs)
      const wildcards = extractWildcardParams(paramValuePairs)
      const queryParams = parseQueryParams(pathParts.query)

      return {
        path: currentPath,
        fragment: pathParts.fragment,
        queryParams,
        pathParams,
        wildcards
      }
    }
  }
}

function parseRelativePathParts(relativePath) {
  const [pathWithoutFragment, fragment = ''] = relativePath.split(fragmentSeparator)
  const [path, query = ''] = pathWithoutFragment.split(querySeparator)

  return { path, query, fragment }
}

function asTokens(path) {
  const wildcardTokens = path.split(wildcardTokenSeparator)
  const tokenizedPaths = wildcardTokens.map(path => {
    return path
    .split(pathTokenSeparator)
    .filter(notEmpty)
    .map(stringToPathToken)
  })

  const tokenizedWithWildcards = intersperse(tokenizedPaths, wildcardToken)

  return flatten(tokenizedWithWildcards)
}

function toPattern(routeTokens) {
  return routeTokens.map(token => token.pattern).join(pathTokenSeparatorRegExp)
}

function stringToPathToken(part) {
  if(part.match(namedParamPattern)) {
    return {
      type: 'pathParam',
      value: part.substring(1),
      pattern: `([${allowedPathChars}]+)`
    }
  } else {
    return {
      type: 'literal',
      value: part,
      pattern: escapeStringRegexp(part)
    }
  }
}
