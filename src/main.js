import {parseRoute} from './routeParser'
import {findFirstTruthy} from './utils'

export function routing(routeDefs) {

  const routeMatchers = routeDefs.map(routeDef => ({
    match: parseRoute(routeDef.route),
    fn: routeDef.fn
  }))

  return function(currentPath) {
    const matchingResult = firstMatchingRoute(routeMatchers, currentPath)

    if(matchingResult) {
      return matchingResult.matcher.fn(matchingResult.result)
    } else {
      return null
    }
  }
}

function firstMatchingRoute(matchers, currentPath) {
  return findFirstTruthy(matchers, matcher => {
    const result = matcher.match(currentPath)

    if(result) {
      return {matcher, result}
    } else {
      return null
    }
  })
}
