global.testenv = {}
/**
 * SETUP
 */
const path = require('path')
testenv.rootdir = path.join(__dirname, '../')
testenv.servermodule = path.join(rootdir, 'server.js')
testenv.serverdir = path.join(rootdir, 'server/')


/**
 * TESTS
 */
require('./server/server.test.js')
require('./users/user.test.js')
require('./medias/media.test.js')
require('./emails/emailer.test.js')
require('./settings/setting.test.js')

require('./season/season.test.js')

require('./cleanup')
