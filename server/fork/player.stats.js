process.title = `${process.argv[2]}.${process.argv[3]}`
process.on('message', (stat) => {
  const Promise = require('bluebird')
  const Player = require('../models/player.model')
  const Attendance = require('../models/attendance.model')
  const Score = require('../models/score.model')
  const Warn = require('../models/warn.model')
  const Expulsion = require('../models/expulsion.model')

  let playerInstance

  Promise
    .resolve(Player.findById(stat.player).exec())
    .then((player) => {
      if (!player) {
        const err = JSON.stringify({ error: 'No player found', origin: process.title })
        process.send(`fail::${err}`)
      }
      playerInstance = player
      return Promise.all([
        Attendance.count({ player: player._id }),
        Warn.count({ player: player._id }),
        Expulsion.count({ player: player._id }),
        Score.count({ player: player._id }),
      ])
    })
    .then((counts) => {
      return playerInstance.update({
        attendance: counts[0],
        warns: counts[1],
        expulsions: counts[2],
        goals: counts[3],
      })
    })
    .then((res) => {
      return process.send(`success::${JSON.stringify(res)}`)
    })
    .catch((err) => {
      return process.send(`fail::${JSON.stringify(err)}`)
    })
})

process.on('uncaughtException', (err) => {
  console.log(`${process.title} Caught exception: ${err}`)
})
