const mocha = require('mocha')
const chai = require('chai')
const expect = chai.expect

const MartinettoParser = require('../dist/routeParser')
const parseRoute = MartinettoParser.parse

const routing = require('../dist/bundle')

context('Route parser', () => {

  describe('Route with named parameters', () => {
    const route = parseRoute('/users/:username/lists/:title')

    it('should match valid routes', () => {
      const path = '/users/janne/lists/2015'
      const result = route(path)
      expect(result).to.exist
      expect(result.path).to.equal('/users/janne/lists/2015')
      expect(result.params.username).to.equal('janne')
      expect(result.params.title).to.equal('2015')
    })

    it('should not match invalid named parameter route', () => {
      const path = '/users/janne|artists/Aphex%20Twin'
      const result = route(path)
      expect(result).to.be.undefined
    })

    it('should consider route to be the same with or without trailing slash', () => {
      const pathWithSlash = '/users/joe/lists/rock-anthems'
      const result = route(pathWithSlash)
      expect(result).to.exist
      expect(result.path).to.equal(pathWithSlash)
      expect(result.params.username).to.equal('joe')
      expect(result.params.title).to.equal('rock-anthems')
    })

    it('should URI decode parameters', () => {
      const path = '/users/John%20Doe/lists/%C3%84%C3%A4ni%C3%A4'
      const result = route(path)
      expect(result).to.exist
      expect(result.path).to.equal(path)
      expect(result.params.username).to.equal('John Doe')
      expect(result.params.title).to.equal('Ääniä')
    })

  })

  describe('Route with wildcards', () => {

    it('should provide wildcard path param with the "wildcard" key', () => {
      const route = parseRoute('/rest/*')
      const path = '/rest/artists/Deerhunter'
      const result = route(path)
      expect(result).to.exist
      expect(result.params.wildcard).to.equal('artists/Deerhunter')
    })


    it('should support url encoded wildcard params', () => {
      const route = parseRoute('/rest/*')
      const path = '/rest/artist/Sigur%20R%C3%B3s'
      const result = route(path)
      expect(result).to.exist
      expect(result.params.wildcard).to.equal('artist/Sigur Rós')
    })


    })

  })

  context('Routing', () => {
    describe('Routing with descending priority route list', () => {
      const routes = [
        { route: '/artists/:name/album/:albumName', fn: (routeData) => {
          console.log(routeData)
          return 'Album page'
        } },
        { route: '/artists/:name/*', fn: (routeData) =>  {
          console.log(routeData)
          return 'Artist page'
        } }
      ]

      const router = routing(routes)

      it('should match routes in order', () => {
        const routingResult1 = router('/artists/Aphex%20Twin/album/Syro')
        expect(routingResult1).to.equal('Album page')

        const routingResult2 = router('/artists/Aphex%20Twin/gigs')
        expect(routingResult2).to.equal('Artist page')
      })

    })

    describe('Subrouting', () => {
      const albumRouter = [
        {
          route: '/year/:year', 
          fn: (routeData) => `year ${routeData.params.year}`
        }
      ]

      const artistRouter = [{
        route: '/:name',
        fn: (routeData) => `artist ${routeData.params.name}`
      }]

      const routes = [
        {route: '/artists/', router: artistRouter},
        {route: '/albums', router: albumRouter}
      ]

      const router = routing(routes)

      it('should match routes from a subrouter', () => {
        expect(router('/artists/American%20Football')).to.equal('artist American Football')
      })
    })

    describe('Routing with additional parameter passing', () => {
      const routes = [
        { route: '/plus/:num', fn: (routeData, num2) => {
          return Number(routeData.params.num) + num2
        } },
        { route: '/plus/:num1/:num2', fn: (routeData) =>  {
          return Number(routeData.params.num1) + Number(routeData.params.num2)
        } }
      ]

      const router = routing(routes)

      it('should give the additional parameters to the route fn', () => {
        const result = router('/plus/3', 5)
        expect(result).to.equal(8)
      })
    })
  })
