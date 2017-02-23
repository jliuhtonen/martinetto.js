import {parse, RouteMatcher, RouteMatch, RouteParameters} from './routeParser'
import {collectFirst, removeTrailingSlash} from './utils'

export type RouterDef<A, B> = Array<RouteDef<A, B>>
export type RouteDef<A, B> = ConcreteRouteDef<A, B> | SubrouterDef<A, B>
export type RouteExecutor<A,B> = (route: RouteMatch, options?: A) => B

export interface ConcreteRouteDef<A, B> {
  route: string,
  fn: RouteExecutor<A, B>
}

export interface SubrouterDef<A, B> {
  route: string,
  router: RouterDef<A, B>
}

export type RoutingFn<A, B> = (currentPath: string, options?: A) => B | undefined

export function routing<A, B>(routerDef: RouterDef<A, B>): RoutingFn<A, B> {
  const expandedRoutes: Array<ConcreteRouteDef<A, B>> = expandRoutes(routerDef)
  const routeMatchers = expandedRoutes.map(definitionToRoute)

  return createRoutingFn<A,B>(routeMatchers)
}

function createRoutingFn<A, B>(routes: Route<A, B>[]): RoutingFn<A, B> {
  return (currentPath: string, args?: A) => {
    const matchingResult = firstMatchingRoute(routes, currentPath)

    if(matchingResult) {
      const {matcher, result} = matchingResult
      return matcher.fn(result, args)
    } else {
      return undefined
    }
  }
}

function definitionToRoute<A, B>({route, fn}: ConcreteRouteDef<A, B>): Route<A, B> {
  return {
    match: parse(route),
    fn
  }
}

interface Route<A, B> {
  match: RouteMatcher,
  fn: RouteExecutor<A, B>
}

interface Result<A, B> {
  matcher: Route<A, B>,
  result: RouteMatch
}


function firstMatchingRoute<A, B>(matchers: Array<Route<A, B>>, currentPath: string): Result<A, B> | undefined {
  return collectFirst(matcher => routeMatch(currentPath, matcher), result => !!result, matchers)
}

function routeMatch<A, B>(currentPath: string, matcher: Route<A, B>): Result<A, B> | undefined {
  const result = matcher.match(currentPath)
  return result ? {matcher, result} : undefined
}

function expandRoutes<A, B>(routerDef: RouterDef<A, B>): Array<ConcreteRouteDef<A, B>> {
  const expandedRoutes: ConcreteRouteDef<A, B>[] = []
  return routerDef.reduce((expanded, routeSpec) => expanded.concat(expandRoute(routeSpec)), expandedRoutes)
}

function expandRoute<A, B>(routeDef: RouteDef<A, B>, routePrefix = ''): Array<ConcreteRouteDef<A, B>> {
  if (isExecutable(routeDef)) {
    return [routeDef as ConcreteRouteDef<A, B>]
  } else {
    const subrouter = routeDef as SubrouterDef<A, B>
    const subs = expandRoutes(subrouter.router).map(({route, fn}) => {
      return {route: `${removeTrailingSlash(subrouter.route)}${route}`, fn}
    })
    return subs
  }
}

function isExecutable<A, B>(routeDef: SubrouterDef<A, B> | ConcreteRouteDef<A, B>): routeDef is ConcreteRouteDef<A, B> {
  const {fn} = routeDef as ConcreteRouteDef<A, B>
  return typeof fn === 'function'
}
