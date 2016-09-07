process.on('message', (score) => {
  const { Promise } = global
  const db = require('../config/database')
  const Player = require('../models/player.model')
  const Warn = require('../models/warn.model')
  db.connect()
  let playerInstance
  Promise
    .resolve(Player.findById(score.player))
    .then((player) => {
      if (!player) {
        process.send('fail::' + JSON.stringify({
          error: 'No player found',
        }))
      }
      playerInstance = player
      return Warn.count({ player: player._id })
    })
    .then((count) => {
      return playerInstance.update({
        warns: count,
      })
    })
    .then((res) => {
      setTimeout(() => {
        process.exit()
      }, 10)
      process.send('success::' + JSON.stringify(res))
    })
    .catch((err) => {
      setTimeout(() => {
        process.exit()
      }, 10)
      process.send('fail::' + JSON.stringify(err))
    })
})

process.on(process.title + ' uncaughtException', function (err) {
  console.log('Caught exception: ' + err)
})
