const path = require('path')
const fork = require('child_process').fork

const Childs = {
  'thumb.generator': {
    path: path.join(__dirname, 'thumb.generator'),
    instance: undefined,
  },
  'team.stats': {
    path: path.join(__dirname, 'team.stats'),
    instance: undefined,
  },
  'player.stats': {
    path: path.join(__dirname, 'player.stats'),
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
    Childs[key].instance.setMaxListeners(0)
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

function playerStatsUpdate(stat) {
  return MainHandler('player.stats', stat)
}

module.exports = {
  ForkChildBootstrap,
  ForkChildKiller,
  generateThumbnail,
  teamStatsUpdate,
  playerStatsUpdate,
}
