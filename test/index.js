const mocha = require('mocha')
const chai = require('chai')
const expect = chai.expect

const Martinetto = require('../src/routeParser')
const parseRoute = Martinetto.parseRoute

context('Route parser', () => {

  describe('Route with named parameters', () => {
    const route = parseRoute('/users/:username/lists/:title')

    it('should match valid routes and parse query params', () => {
      const path = '/users/janne/lists/2015?filter=name&criteria=Aphex%20Twin'
      const result = route(path)
      expect(result).to.exist
      expect(result.path).to.equal('/users/janne/lists/2015')
      expect(result.pathParams.username).to.equal('janne')
      expect(result.pathParams.title).to.equal('2015')
      expect(result.queryParams).to.exist
      expect(result.queryParams.filter).to.equal('name')
      expect(result.queryParams.criteria).to.equal('Aphex Twin')
    })

    it('should not match invalid named parameter route', () => {
      const path = '/users/janne/artists/Aphex%20Twin'
      const result = route(path)
      expect(result).to.be.null
    })

    it('should consider route to be the same with or without trailing slash', () => {
      const pathWithSlash = '/users/joe/lists/rock-anthems'
      const result = route(pathWithSlash)
      expect(result).to.exist
      expect(result.path).to.equal(pathWithSlash)
      expect(result.pathParams.username).to.equal('joe')
      expect(result.pathParams.title).to.equal('rock-anthems')
    })

    it('should URI decode parameters', () => {
      const path = '/users/John%20Doe/lists/%C3%84%C3%A4ni%C3%A4'
      const result = route(path)
      expect(result).to.exist
      expect(result.path).to.equal(path)
      expect(result.pathParams.username).to.equal('John Doe')
      expect(result.pathParams.title).to.equal('Ääniä')
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

    it('should consider route to be the same with or without single trailing slash', () => {
      const route = parseRoute('/rest/*/')
      const path = '/rest/artists/Deerhunter'
      const result = route(path)
      expect(result).to.exist
      expect(Object.keys(result.pathParams).length).to.equal(0)
      expect(result.wildcards.length).to.equal(1)
      expect(result.wildcards[0]).to.equal('artists/Deerhunter')  })

      it('should support multiple wildcard params', () => {
        const route = parseRoute('/files/*/filter/*')
        const path = '/files/photos/2015/spain/filter/Barcelona/Monday'
        const result = route(path)
        expect(result).to.exist
        expect(result.wildcards.length).to.equal(2)
        expect(result.wildcards[0]).to.equal('photos/2015/spain')
        expect(result.wildcards[1]).to.equal('Barcelona/Monday')
      })

      it('should support url encoded wildcard params', () => {
        const route = parseRoute('/rest/*')
        const path = '/rest/artist/Sigur%20R%C3%B3s'
        const result = route(path)
        expect(result).to.exist
        expect(result.wildcards.length).to.equal(1)
        expect(result.wildcards[0]).to.equal('artist/Sigur Rós')
      })


    })

  })
