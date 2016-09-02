global.testenv = {}
/**
 * SETUP
 */
const path = require('path')
testenv.rootdir = path.join(__dirname, '../')
testenv.app = path.join(testenv.rootdir, 'server.js')
testenv.serverdir = path.join(testenv.rootdir, 'server/')


/**
 * TESTS
 */
require('./server/server.test.js')
require('./users/user.test.js')
require('./medias/media.test.js')
require('./emails/emailer.test.js')
require('./settings/setting.test.js')

/**
 * PER PROJECTS MODELS
 */
require('./season/season.admin.test.js')
require('./round/round.admin.test.js')

/**
 * CLEANUPS
 */
require('./cleanup')
