require('dotenv').config()
const browserstack = require('browserstack-local')
const objectAssign = require('object-assign')

const commonCapabilityObj = {
  'browserstack.local': true,
  project: 'Refractive',
  'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER
}

const capabilities = [
{
  'browser': 'Chrome',
  'browserName': 'Latest Chrome'
},
{
  'browser': 'Firefox',
  'browserName': 'Latest Firefox'
},
{
  'os': 'Windows',
  'os_version': '10',
  'browser': 'IE',
  'browserName': 'IE 11 on Win 10',
  'browser_version': '11.0',
  'resolution': '1024x768'
},
{
  'os': 'OS X',
  'os_version': 'Sierra',
  'browser': 'Safari',
  'browserName': 'Safari 10 on OS X Sierra',
  'browser_version': '10.0',
  'resolution': '1024x768'
},
{
  'os': 'Windows',
  'os_version': '7',
  'browser': 'IE',
  'browserName': 'IE 10 on Win 7',
  'browser_version': '10.0',
  'resolution': '1024x768'
},
].map(capability => objectAssign(capability, commonCapabilityObj))

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
  capabilities: capabilities,
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
