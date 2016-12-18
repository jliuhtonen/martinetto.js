import {expect} from 'chai'

describe('Refractive routing', function() {
  it('can run router in browser', function () {
    browser
    .url('/test-app')
    .pause(5000)

    expect(browser.getText('#app-content')).to.equal('HI')
  })
})
