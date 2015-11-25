import {zip, and} from './utils'

const tokenSeparator = '/'
const namedParamPattern = /^:\w+$/
const defaultNamedParamValidationPattern = /^\w+$/

function parseRoute(path, prefix = '') {
  const pathToParse = pathWithoutPrefix(path, prefix)
  const routeTokens = asTokens(pathToParse)

  return function(locationStr) {
    const strTokens = asTokens(locationStr)
    const strMatchTokens = strTokens.filter(token => token.type === 'literal')

    if(!compareTokens(routeTokens, strMatchTokens)) {
      return { isMatch: false }
    } else {
      return {
        isMatch: true,
        params: getParams(routeTokens, strTokens)
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

function stringToToken(part) {
  if(part.match(namedParamPattern)) {
    return {
      type: 'pathParam',
      value: part.substring(1)
    }
  } else {
    return {
      type: 'literal',
      value: part
    }
  }
}

function compareTokens(routeTokens, locationTokens, namedParamValidationPattern = defaultNamedParamValidationPattern) {
  if(routeTokens.length !== locationTokens.length) {
    return false
  }

  const zippedTokens = zip(routeTokens, locationTokens)
  console.log(zippedTokens)
  const tokenMatches = zippedTokens.map(([routeToken, locationToken]) => tokenMatch(routeToken, locationToken, namedParamValidationPattern))
  console.log(tokenMatches)
  return and(tokenMatches)
}

function tokenMatch(routeToken, locationToken, validPathParamPattern) {
  if(routeToken.type === 'pathParam') {
    return !!locationToken.value.match(validPathParamPattern)
  } else {
    return locationToken.value === routeToken.value
  }
}

function getParams(routeTokens, locationTokens) {
  return routeTokens.reduce((params, routeToken, index) => {
    if(routeToken.type === 'pathParam') {
      params[routeToken.value] = locationTokens[index].value
    }

    return params
  }, {})
}

function pathParamName(pathParam) {
  return pathParam.substring(1)
}

export default parseRoute
