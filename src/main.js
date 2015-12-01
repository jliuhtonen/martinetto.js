import routeParser from './parser'

console.log(routeParser('/foo/:bar/*')('/foo/123/abba/cabba'))

export default {
  'Parser': routeParser
}
