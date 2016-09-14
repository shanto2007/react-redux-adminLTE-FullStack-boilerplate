const AppForkedChild = []
/**
 * Main Handler of fork worker, return promise
 * @return Promise
 */
function MainHandler(childPath, childName, data) {
  const { Promise } = global
  const fork = require('child_process').fork

  return new Promise((resolve, reject) => {
    const child = fork(childPath, [process.title, childName])
    AppForkedChild.push(child)
    child.send(data)
    child.on('message', (m) => {
      const message = m.split('::')
      if (message[0] !== 'success') {
        child.kill('SIGINT')
        return reject(new Error(message[1], childName))
      }
      child.kill('SIGINT')
      return resolve({
        process: `Child process ${childName} ${message[0]}`,
        message: JSON.parse(message[1]),
      })
    })
  })
}

/**
 * Create an array of child to kill incase of bad application exit
 * @return {[type]} [description]
 */
function killForkedChilds() {
  if (AppForkedChild.length) {
    for (let i = 0; i < AppForkedChild.length; i++) {
      if (!AppForkedChild[i].killed) {
        AppForkedChild[i].kill()
        console.log(`fork ${AppForkedChild[i].spawnargs[1]} killed`);
      }
    }
  } else {
    console.log('No forked child to kill');
  }
}

function generateThumbnail(media) {
  return MainHandler('server/fork/thumb.generator', 'thumb.generator', media)
}

function teamStatsUpdate(match) {
  return MainHandler('server/fork/team.stats', 'team.stats', match)
}

function cascadeRemoveMatchData(match) {
  return MainHandler('server/fork/team.child.remove', 'team.child.remove', match)
}

function playerScoreUpdate(score) {
  return MainHandler('server/fork/player.score', 'player.score', score)
}

function playerWarnUpdate(warn) {
  return MainHandler('server/fork/player.warn', 'player.warn', warn)
}

function playerExpulsionUpdate(expulsion) {
  return MainHandler('server/fork/player.expulsion', 'player.expulsion', expulsion)
}

function playerAttendanceUpdate(attendance) {
  return MainHandler('server/fork/player.attendance', 'player.attendance', attendance)
}

module.exports = {
  killForkedChilds,
  generateThumbnail,
  cascadeRemoveMatchData,
  teamStatsUpdate,
  playerScoreUpdate,
  playerWarnUpdate,
  playerExpulsionUpdate,
  playerAttendanceUpdate,
}
