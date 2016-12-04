import * as P from 'parsimmon'
import * as objectAssign from 'object-assign'

enum RouteParameterType {Literal, PathParameter, Wildcard}

export interface RouteParameters { [name: string]: string }
export interface RouteMatch { path: string, params: RouteParameters }
export type RouteMatcher = (uri: string) => RouteMatch

interface RouteParameter {
  paramType: RouteParameterType,
  name?: string,
  value: string
}

const allowedLiteralCharsPattern = /[\w-]+/
const allowedPathCharsPattern = /[A-Za-z0-9_\.~:@\-%!\$&'\(\)\*\+,;=]+/

const literal = P.regexp(allowedPathCharsPattern).map(v => P.string(v).map(literalParameter))
const pathPart = P.regexp(allowedPathCharsPattern)
const wildcard = P.string('*').then(P.eof).map(() => P.all.map(wildcardParameter))
const pathSeparator = P.string('/').map(v => P.string(v).map(literalParameter))
const pathParam = P.regexp(/:(\w+)/, 1).map(k => pathPart.map(v => pathParameter(k, v)))

const pathToken = P.alt(wildcard, pathParam, literal)

const path: P.Parser<P.Parser<RouteParameter>[]> = P.lazy(() => P.seqMap(pathSeparator, pathToken, path.or(P.eof), combineParsers))

export function parse(str: string): RouteMatcher {
 const routeParseResult = path.parse(str)
 if (!routeParseResult.status) throw new Error('Invalid route pattern')
 const uriParsers: P.Parser<RouteParameter>[] = routeParseResult.value
 const uriParser: P.Parser<RouteParameter[]> = P.seq(...uriParsers)

 return (uri) => {
   const parseResult = uriParser.parse(uri)
   if (!parseResult.status) return undefined

   const routeParameters = parseResult.value.filter(p => p.paramType !== RouteParameterType.Literal)
   const routeParamMap: RouteParameters = {}
   const params = routeParameters.reduce((paramsObj, {paramType, name, value}) => {
     const obj: RouteParameters = {}
     obj[name] = decodeURIComponent(value)
     return objectAssign(paramsObj, obj)
   }, routeParamMap)

   return {path: uri, params}
 }
}

function combineParsers(a: P.Parser<RouteParameter>, b: P.Parser<RouteParameter>, cs: P.Parser<RouteParameter>[] | null) {
  return [a, b].concat(cs || [])
}

function literalParameter(value: string): RouteParameter {
  return {paramType: RouteParameterType.Literal, value}
}

function pathParameter(name: string, value: string): RouteParameter {
  return {paramType: RouteParameterType.PathParameter, name, value}
}

function wildcardParameter(value: string): RouteParameter {
  return {paramType: RouteParameterType.Wildcard, name: 'wildcard', value}
}
