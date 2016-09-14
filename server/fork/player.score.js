process.title = `${process.argv[2]}.${process.argv[3]}`
process.on('message', (score) => {
  const Promise = require('bluebird')
  const Player = require('../models/player.model')
  const Score = require('../models/score.model')

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
      return Score.count({ player: player._id })
    })
    .then((count) => {
      return playerInstance.update({
        goals: count,
      })
    })
    .then((res) => {
      process.send(`success::${JSON.stringify(res)}`)
    })
    .catch((err) => {
      console.log(err)
      process.send(`fail::${JSON.stringify(err)}`)
    })
})
