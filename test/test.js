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

require('./users/user.test.js')

require('./medias/media.model.test.js')
require('./medias/media.api.test.js')

require('./emails/emailer.test.js')

require('./settings/setting.model.test.js')
require('./settings/setting.api.test.js')

/**
 * Projects
 */
require('./season/season.model.test.js')
require('./season/season.api.test.js')

require('./round/round.model.test.js')
require('./round/round.api.test.js')

require('./day/day.model.test.js')
require('./day/day.api.test.js')

require('./team/team.model.test.js')
require('./team/team.api.test.js')

require('./player/player.model.test.js')
require('./player/player.api.test.js')

require('./match/match.model.test.js')
require('./match/match.api.test.js')


require('./score/score.model.test.js')
// require('./score/score.api.test.js')

require('./warn/warn.model.test.js')
// require('./warn/warn.api.test.js')

require('./expulsion/expulsion.model.test.js')
// require('./expulsion/expulsion.api.test.js')

require('./attendance/attendance.model.test.js')
// require('./attendance/attendance.api.test.js')

require('./post/post.model.test.js')
require('./post/post.api.test.js')

/**
 * CLEANUPS
 */
require('./cleanup')
