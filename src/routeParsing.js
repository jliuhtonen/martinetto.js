import {intersperse, flatten, notEmpty} from './utils'
import escapeStringRegexp from 'escape-string-regexp'

const namedParamPattern = /^:\w+$/

const wildcardTokenSeparator = '*'
const wildcardToken = { type: 'wildcard', value: 'wildcard', pattern: '([\\w-%\/]*)' }

const pathTokenSeparator = '/'
const pathTokenSeparatorRegExp = escapeStringRegexp(pathTokenSeparator)

export function asTokens(path) {
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

export function toPattern(routeTokens) {
  return routeTokens.map(token => token.pattern).join(pathTokenSeparatorRegExp)
}

function stringToPathToken(part) {
  if(part.match(namedParamPattern)) {
    return {
      type: 'pathParam',
      value: part.substring(1),
      pattern: '([\\w-%]+)'
    }
  } else {
    return {
      type: 'literal',
      value: part,
      pattern: escapeStringRegexp(part)
    }
  }
}
