import {parse, RouteMatcher, RouteMatch, RouteParameters} from './parser'
import {findFirstTruthy} from './utils'

type RouteExecutor = (route: RouteMatch, ...args: any[]) => any

interface RouteDef {
  route: string,
  fn: RouteExecutor
}

interface Route {
  match: RouteMatcher,
  fn: RouteExecutor
}

interface Result {
  matcher: Route,
  result: RouteMatch
}

export function routing(routeDefs: Array<RouteDef>): (currentPath: string, ...args: any[]) => any {

  const routeMatchers = routeDefs.map(routeDef => ({
    match: parse(routeDef.route),
    fn: routeDef.fn
  }))

  return function(currentPath, ...args) {
    const matchingResult = firstMatchingRoute(routeMatchers, currentPath)

    if(matchingResult) {
      const {matcher, result} = matchingResult
      return matcher.fn(result, ...args)
    } else {
      return null
    }
  }
}

function firstMatchingRoute(matchers: Array<Route>, currentPath: string): Result {
  return findFirstTruthy(matchers, matcher => {
    const result = matcher.match(currentPath)

    if(result) {
      return {matcher, result}
    } else {
      return null
    }
  })
}
