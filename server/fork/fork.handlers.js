const fork = require('child_process').fork

const Childs = {
  'thumb.generator': {
    path: 'server/fork/thumb.generator',
    instance: undefined,
  },
  'team.stats': {
    path: 'server/fork/team.stats',
    instance: undefined,
  },
  'team.child.remove': {
    path: 'server/fork/team.child.remove',
    instance: undefined,
  },
  'player.score': {
    path: 'server/fork/player.score',
    instance: undefined,
  },
  'player.warn': {
    path: 'server/fork/player.warn',
    instance: undefined,
  },
  'player.expulsion': {
    path: 'server/fork/player.expulsion',
    instance: undefined,
  },
  'player.attendance': {
    path: 'server/fork/player.attendance',
    instance: undefined,
  },
}

/**
 * STARTUP FORKER
 */
function ForkChildBootstrap() {
  const keys = Object.keys(Childs)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    Childs[key].instance = fork(Childs[key].path, [process.title, key])
    console.log(`fork ${Childs[key].instance.spawnargs[1]} bootstrapped`)
  }
  Object.freeze(Childs)
}

function ForkChildKiller() {
  const keys = Object.keys(Childs)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    Childs[key].instance.kill()
    console.log(`fork ${Childs[key].instance.spawnargs[1]} killed`)
  }
}

/**
 * Main Handler of fork worker, return promise
 * @return Promise
 */
function MainHandler(childName, data) {
  const { Promise } = global
  return new Promise((resolve, reject) => {
    const child = Childs[childName].instance
    child.send(data)
    child.once('message', (m) => {
      const message = m.split('::')
      if (message[0] !== 'success') {
        return reject(new Error(message[1], childName))
      }
      return resolve({
        process: `Child process ${childName} ${message[0]}`,
        message: JSON.parse(message[1]),
      })
    })
  })
}

function generateThumbnail(media) {
  return MainHandler('thumb.generator', media)
}

function teamStatsUpdate(match) {
  return MainHandler('team.stats', match)
}

function cascadeRemoveMatchData(match) {
  return MainHandler('team.child.remove', match)
}

function playerScoreUpdate(score) {
  return MainHandler('player.score', score)
}

function playerWarnUpdate(warn) {
  return MainHandler('player.warn', warn)
}

function playerExpulsionUpdate(expulsion) {
  return MainHandler('player.expulsion', expulsion)
}

function playerAttendanceUpdate(attendance) {
  return MainHandler('player.attendance', attendance)
}


module.exports = {
  ForkChildBootstrap,
  ForkChildKiller,
  generateThumbnail,
  cascadeRemoveMatchData,
  teamStatsUpdate,
  playerScoreUpdate,
  playerWarnUpdate,
  playerExpulsionUpdate,
  playerAttendanceUpdate,
}
