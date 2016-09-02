/**
 * SETUP
 */
const path = require('path')
const rootdir = path.join(__dirname, '../')
const servermodule = path.join(rootdir, 'server.js')
const serverdir = path.join(rootdir, 'server/')

process.env.__rootdir = rootdir
process.env.__server = servermodule
process.env.__serverdir = serverdir

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
