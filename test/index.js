const mocha = require('mocha')
const chai = require('chai')
const expect = chai.expect

const Martinetto = require('../dist/martinetto')
const parseRoute = Martinetto.parseRoute

describe('Route with named parameters', () => {
  const route = parseRoute("/users/:username/lists/:year")
  it('should match valid routes', () => {
    const path = '/users/janne/lists/2015'
    const result = route(path)
    expect(result).to.exist
    expect(result.path).to.equal(path)
    expect(result.pathParams.username).to.equal('janne')
    expect(result.pathParams.year).to.equal('2015')
  })
})
