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

require('./settings/setting.test.js')

/**
 * Projects
 */
require('./season/season.model.test.js')
require('./season/season.admin.test.js')

require('./round/round.model.test.js')
require('./round/round.admin.test.js')

require('./day/day.model.test.js')
// require('./day/day.admin.test.js')

require('./team/team.model.test.js')
// require('./team/team.admin.test.js')

require('./match/match.model.test.js')
// require('./match/match.admin.test.js')

require('./player/player.model.test.js')
// require('./player/player.admin.test.js')

require('./score/score.model.test.js')
// require('./score/score.admin.test.js')

require('./warn/warn.model.test.js')
// require('./warn/warn.admin.test.js')

require('./expulsion/expulsion.model.test.js')
// require('./expulsion/expulsion.admin.test.js')

/**
 * CLEANUPS
 */
require('./cleanup')
