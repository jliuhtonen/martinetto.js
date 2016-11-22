import {parse, RouteMatcher, RouteMatch, RouteParameters} from './routeParser'
import {findFirstTruthy, removeTrailingSlash} from './utils'

export type RouterDef = Array<RouteDef>
export type RouteDef = ConcreteRouteDef | SubrouterDef
type RouteExecutor = (route: RouteMatch, ...args: any[]) => any

export interface ConcreteRouteDef {
  route: string,
  fn: RouteExecutor
}

export interface SubrouterDef {
  route: string,
  router: RouterDef
}

interface Route {
  match: RouteMatcher,
  fn: RouteExecutor
}

interface Result {
  matcher: Route,
  result: RouteMatch
}

export default function routing(routerDef: RouterDef): (currentPath: string, ...args: any[]) => any {
  const expandedRoutes: Array<ConcreteRouteDef> = expandRoutes(routerDef)

  const routeMatchers = expandedRoutes.map(({route, fn}) => ({
    match: parse(route),
    fn
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

function expandRoutes(routerDef: RouterDef): Array<ConcreteRouteDef> {
  const expandedRoutes: Array<ConcreteRouteDef> = []
  return routerDef.reduce((expanded, routeSpec) => expanded.concat(expandRoute(routeSpec)), expandedRoutes)
}

function expandRoute(routeDef: RouteDef, routePrefix = ''): Array<ConcreteRouteDef> {
  if (isExecutable(routeDef)) {
    return [routeDef as ConcreteRouteDef]
  } else {
    const subrouter = routeDef as SubrouterDef
    const subs = expandRoutes(subrouter.router).map(({route, fn}) => {
      return {route: `${removeTrailingSlash(subrouter.route)}${route}`, fn}
    })
    return subs
  }
}

function isExecutable(routeDef: SubrouterDef | ConcreteRouteDef): routeDef is ConcreteRouteDef {
  const {fn} = (<ConcreteRouteDef>routeDef)
  return typeof fn === 'function'
}
