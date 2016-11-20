# martinetto.js
[![Build Status](https://travis-ci.org/jliuhtonen/martinetto.js.svg?branch=master)](https://travis-ci.org/jliuhtonen/martinetto.js)

Martinetto.js is a library for parsing and matching relative url paths or _routes_. It supports named path parameters and wildcards. It also parses the fragment and query parts for matched routes.

## Usage

```javascript
> const Martinetto = require('./dist/martinetto')
> const routeMatcher = Martinetto.routing([
  { 
    route: '/artists/:name/album/:albumName', 
    fn: (routeData) => {
      console.log(routeData)
      return 'Album page'
    } 
  },
  { 
    route: '/artists/:name/*', 
    fn: (routeData) =>  {
      console.log(routeData)
      return 'Artist page'
    } 
  }
])
> routeMatcher('/artists/Aphex%20Twin/album/Syro')
{ path: '/artists/Aphex%20Twin/album/Syro',
  fragment: '',
  queryParams: {},
  pathParams: { name: 'Aphex Twin', albumName: 'Syro' },
  wildcards: [] }
'Album page'
> routeMatcher('/artists/Aphex%20Twin/gigs')
{ path: '/artists/Aphex%20Twin/gigs',
  fragment: '',
  queryParams: {},
  pathParams: { name: 'Aphex Twin' },
  wildcards: [ 'gigs' ] }
'Artist page'
```
