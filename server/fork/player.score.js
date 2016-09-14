process.on('message', (score) => {
  const Promise = require('bluebird')
  const db = require('../config/database')
  const Player = require('../models/player.model')
  const Score = require('../models/score.model')

  db.connect()
  
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
