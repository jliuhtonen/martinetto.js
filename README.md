# Martinetto.js
[![Build Status](https://travis-ci.org/jliuhtonen/martinetto.js.svg?branch=master)](https://travis-ci.org/jliuhtonen/martinetto.js)

Martinetto.js is a micro-library for parsing relative url paths or _routes_. It supports named parameters and one or more wildcards.

## Usage

```javascript
> const Martinetto = require('./dist/martinetto')
> const routeMatcher = Martinetto.parseRoute('/users/:username/lists/:year/*')
> routeMatcher('/users/janne/lists/2015/electronic/house')
{ path: '/users/janne/lists/2015/electronic/house',
  pathParams: { username: 'janne', year: '2015' },
  wildcards: [ 'electronic/house' ] }
```
