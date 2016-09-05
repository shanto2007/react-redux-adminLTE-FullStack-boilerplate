const { Promise } = global
const db = require('../config/database')
const Player = require('../models/player.model')
const Score = require('../models/score.model')
const Warn = require('../models/warn.model')
const Expulsion = require('../models/expulsion.model')
const Attendance = require('../models/attendance.model')
// const Team = require('../models/team.model')

process.on('message', (score) => {
  db.connect()
  let playerInstance
  Promise
    .resolve(Player.findById(score.player))
    .then((player) => {
      if (!player) throw new Error('player.stats fork exited with Player not found')
      playerInstance = player
      return Promise.all([
        Score.count({ player: player._id }),
        Warn.count({ player: player._id }),
        Expulsion.count({ player: player._id }),
        Attendance.count({ player: player._id }),
      ])
    })
    .then((data) => {
      if (!data) throw new Error('player.stats fork exited with Data not found!')
      return playerInstance.update({
        goals: data[0],
        warns: data[1],
        expulsions: data[2],
        attendance: data[3],
      })
    })
    .then(() => {
      setTimeout(() => {
        process.exit()
      }, 150)
      process.send('updated_player_stats:success')
    })
    .catch(() => {
      setTimeout(() => {
        process.exit()
      }, 150)
      process.send('updated_player_stats:fail')
    })
})
