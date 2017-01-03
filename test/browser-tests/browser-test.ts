import {expect} from 'chai'

const testUrlPrefix = 'http://localhost:8080/test-app'

describe('Refractive routing', function() {
  context('From app root', function() {
    beforeEach(function() {
      browser.url('/test-app')
      .waitForExist('#app-content')
    })

    it('can run router in browser', function () {
      expect(getAppText()).to.equal('HI')
    })

    it('runs route on clicking a link', function() {
      browser.click('#contact-link')
      .waitForText('#app-content')

      expect(getAppText()).to.equal('Contact us')
      expect(browser.getUrl()).to.equal(`${testUrlPrefix}/contact`)
    })

    it('runs previous route on clicking back', function() {
      browser.click('#contact-link')
      .waitForText('#app-content')
      browser.back()

      expect(getAppText()).to.equal('HI')
      expect(browser.getUrl()).to.equal(`${testUrlPrefix}/`)
    })
  })
})

function getAppText() {
  return browser.getText('#app-content')
}

