const mocha = require('mocha')
const chai = require('chai')
const expect = chai.expect

const Martinetto = require('../dist/martinetto')
const parseRoute = Martinetto.parseRoute

describe('Route with named parameters', () => {
  const route = parseRoute('/users/:username/lists/:year')

  it('should match valid routes', () => {
    const path = '/users/janne/lists/2015'
    const result = route(path)
    expect(result).to.exist
    expect(result.path).to.equal(path)
    expect(result.pathParams.username).to.equal('janne')
    expect(result.pathParams.year).to.equal('2015')
  })

  it('should not match invalid named parameter route', () => {
    const path = '/users/janne/artists/Aphex%20Twin'
    const result = route(path)
    expect(result).to.be.null
  })

})

describe('Route with wildcards', () => {

  it('should provide wildcard path param as the first array element', () => {
    const route = parseRoute('/rest/*')
    const path = '/rest/artists/Deerhunter'
    const result = route(path)
    expect(result).to.exist
    expect(Object.keys(result.pathParams).length).to.equal(0)
    expect(result.wildcards.length).to.equal(1)
    expect(result.wildcards[0]).to.equal('artists/Deerhunter')
  })

  it('should support multiple wildcard params', () => {
    const route = parseRoute('/files/*/filter/*')
    const path = '/files/photos/2015/spain/filter/Barcelona/Monday'
    const result = route(path)
    expect(result).to.exist
    expect(result.wildcards.length).to.equal(2)
    expect(result.wildcards[0]).to.equal('photos/2015/spain')
    expect(result.wildcards[1]).to.equal('Barcelona/Monday')
  })


})
