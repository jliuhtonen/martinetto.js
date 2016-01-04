import {notEmpty, splitAtFirst} from './utils'

const queryParamSeparator = '&'
const keyValueSeparator = '='

export default function parseQueryParams(query) {
  return splitAtFirst(query, queryParamSeparator)
    .filter(notEmpty)
    .map(kv => kv.split(keyValueSeparator))
    .reduce((params, [key, value]) => {
      const cleanedVal = value ? decodeURIComponent(value) : null
      params[key] = cleanedVal
      return params
    }, {})
}
