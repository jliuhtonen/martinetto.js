export function extractWildcardParams(paramValuePairs) {
  return paramValuePairs
  .filter(([param]) => param.type === 'wildcard')
  .map(([ , value]) => decodeURIComponent(value))
}

export function extractPathParams(paramValuePairs) {
  return paramValuePairs
  .filter(([param]) => param.type === 'pathParam')
  .reduce((params, [param, value]) => {
    params[param.value] = decodeURIComponent(value)
    return params
  }, {})
}
