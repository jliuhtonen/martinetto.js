import {parse, RouteMatcher, RouteMatch, RouteParameters} from './routeParser'
import {collectFirst, removeTrailingSlash} from './utils'

export {RouteMatch, RouteParameters} from './routeParser'
export type RouterDef = Array<RouteDef>
export type RouteDef = ConcreteRouteDef | SubrouterDef
export type RouteExecutor = (route: RouteMatch, ...args: any[]) => any

export interface ConcreteRouteDef {
  route: string,
  fn: RouteExecutor
}

export interface SubrouterDef {
  route: string,
  router: RouterDef
}

export type RoutingFn = (currentPath: string, ...args: any[]) => any 

export {linkClickListener, historyListener} from './client'

export function routing(routerDef: RouterDef): RoutingFn {
  const expandedRoutes: Array<ConcreteRouteDef> = expandRoutes(routerDef)
  const routeMatchers = expandedRoutes.map(definitionToRoute)

  return createRoutingFn(routeMatchers)
}

function createRoutingFn(routes: Route[]): RoutingFn {
  return (currentPath: string, ...args: any[]) => {
    const matchingResult = firstMatchingRoute(routes, currentPath)

    if(matchingResult) {
      const {matcher, result} = matchingResult
      return matcher.fn(result, ...args)
    } else {
      return null
    }
  }
}

function definitionToRoute({route, fn}: ConcreteRouteDef): Route {
  return {
    match: parse(route),
    fn
  }
}

interface Route {
  match: RouteMatcher,
  fn: RouteExecutor
}

interface Result {
  matcher: Route,
  result: RouteMatch
}


function firstMatchingRoute(matchers: Array<Route>, currentPath: string): Result | undefined {
  return collectFirst(matcher => routeMatch(currentPath, matcher), result => !!result, matchers)
}

function routeMatch(currentPath: string, matcher: Route): Result | undefined {
  const result = matcher.match(currentPath)
  return result ? {matcher, result} : undefined
}

function expandRoutes(routerDef: RouterDef): Array<ConcreteRouteDef> {
  const expandedRoutes: ConcreteRouteDef[] = []
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
  const {fn} = routeDef as ConcreteRouteDef
  return typeof fn === 'function'
}
