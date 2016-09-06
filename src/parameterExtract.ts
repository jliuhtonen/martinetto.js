export enum RouteParamType { literal, wildcard, pathParam }

export interface RouteParam {
  type: RouteParamType,
  value: string,
  pattern: string
}

export function extractWildcardParams(paramValuePairs: Array<[RouteParam, string]>): string[] {
  return paramValuePairs
  .filter(([param]) => param.type === RouteParamType.wildcard)
  .map(([ , value]) => decodeURIComponent(value))
}

export interface PathParamMap {
  [name: string]: string
}

export function extractPathParams(paramValuePairs: Array<[RouteParam, string]>): PathParamMap {
  return paramValuePairs
  .filter(([param]) => param.type === RouteParamType.pathParam)
  .reduce((params, [param, value]) => {
    params[param.value] = decodeURIComponent(value)
    return params
  }, (<PathParamMap>{}))
}
