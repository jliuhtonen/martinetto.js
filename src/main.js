import {zip, and, flatten, intersperse, pathWithoutPrefix} from './utils'
import {asTokens, toPattern} from './routeParsing'
import {extractWildcardParams, extractPathParams} from './parameterExtract'

export function parseRoute(route, prefix = '') {
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

      const pathParams = extractPathParams(paramValuePairs)
      const wildcards = extractWildcardParams(paramValuePairs)

      return {
        path: currentPath,
        pathParams,
        wildcards
      }
    }
  }
}
