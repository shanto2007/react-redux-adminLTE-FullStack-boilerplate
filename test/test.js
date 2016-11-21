global.Promise = require('bluebird')
global.testenv = {}
/**
 * SETUP
 */
const path = require('path')
testenv.rootdir = path.join(__dirname, '../')
testenv.app = path.join(testenv.rootdir, 'server.js')
testenv.serverdir = path.join(testenv.rootdir, 'server/')

global.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Boilerplate TEst
 */

require('./server/server.test.js')

require('./users/user.model.test.js')
require('./users/user.api.test.js')

require('./medias/media.model.test.js')
require('./medias/media.api.test.js')

// require('./emails/emailer.test.js')

require('./settings/setting.model.test.js')
require('./settings/setting.api.test.js')

/**
 * Projects
 */
require('./post/post.model.test.js')
require('./post/post.api.test.js')
