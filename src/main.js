import routeParser from './parser'

console.log(routeParser('/foo/:bar')('/foo/123'))

export default {
  'Parser': routeParser
}
