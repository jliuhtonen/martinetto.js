import {parse, RouteMatcher, RouteMatch, RouteParameters} from './routeParser'
import {collectFirst, removeTrailingSlash} from './utils'

export {RouteMatch, RouteParameters} from './routeParser'
export {RouterDef, RouteDef, RouteExecutor, ConcreteRouteDef, SubrouterDef, RoutingFn, routing} from './routing'

export {linkClickListener, historyListener, linkToProcess} from './client'
