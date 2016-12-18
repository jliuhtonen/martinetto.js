require('dotenv').config()
const browserstack = require('browserstack-local')

exports.config = {
  user: process.env.BROWSERSTACK_USER,
  key: process.env.BROWSERSTACK_KEY,
  specs: [
    './test/browser-tests/**/*.ts'
  ],
  exclude: [
    // 'path/to/excluded/files'
  ],
  maxInstances: 10,
  capabilities: [{
    browserName: 'chrome',
    'browserstack.local': true,
    'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER
  }],
  sync: true,
  logLevel: 'result',
  coloredLogs: true,
  bail: 0,
  screenshotPath: './errorShots/',
  baseUrl: 'http://localhost:8080',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['browserstack'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    compilers: ['ts:ts-node/register']
  },
  onPrepare: function(config, capabilities) {
    console.log("Connecting local")
    return new Promise(function(resolve, reject) {
      exports.bs_local = new browserstack.Local()
      exports.bs_local.start({'key': exports.config.key}, function(error) {
        if (error) return reject(error)
        console.log('Connected. Now testing...')
        return resolve()
      })
    })
  },
  onComplete: function() {
    exports.bs_local.stop(function() {
      console.log('BrowserStack stopped.')
    })
  }
}
