import {zip, and, flatten, intersperse, pathWithoutPrefix} from './utils'
import {asTokens, toPattern} from './routeParsing'
import {extractWildcardParams, extractPathParams} from './parameterExtract'
import parseQueryParams from './queryParams'

const fragmentSeparator = '#'
const querySeparator = '?'

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
