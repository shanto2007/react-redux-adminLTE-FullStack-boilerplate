process.on('message', (score) => {
  const Promise = require('bluebird')
  const Player = require('../models/player.model')
  const Warn = require('../models/warn.model')

  let playerInstance
  Promise
    .resolve(Player.findById(score.player))
    .then((player) => {
      if (!player) {
        const err = JSON.stringify({
          error: 'No player found',
          origin: process.title,
        })
        process.send(`fail::${err}`)
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
      process.send(`success::${JSON.stringify(res)}`)
    })
    .catch((err) => {
      setTimeout(() => {
        process.exit()
      }, 10)
      process.send(`fail::${JSON.stringify(err)}`)
    })
})

process.on(`${process.title} uncaughtException`, (err) => {
  console.log(`Caught exception: ${err}`)
})
