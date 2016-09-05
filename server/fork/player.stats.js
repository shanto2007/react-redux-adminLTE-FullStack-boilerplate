const { Promise } = global
const db = require('../config/database')
const Player = require('../models/player.model')
const Score = require('../models/score.model')
const Warn = require('../models/warn.model')
const Expulsion = require('../models/expulsion.model')
const Team = require('../models/team.model')

process.on('message', (score) => {
  db.connect()
  let playerInstance
  Promise
    .resolve(Player.findById(score.player))
    .then((player) => {
      if (!player) throw 'player.stats fork exited with Player not found'
      playerInstance = player
      return Promise.all([
        Score.count({ player: player._id }),
        Warn.count({ player: player._id }),
        Expulsion.count({ player: player._id }),
      ])
    })
    .then((data) => {
      if (!data) throw 'player.stats fork exited with Data not found!'
      return playerInstance.update({
        goals: data[0],
        warns: data[1],
        expulsions: data[2],
      })
    })
    .then((status) => {
      if (!status) if (!data) throw 'player.stats fork exited with Stats not found!'
      process.send('updated_player_stats:success')
    })
    .catch((err) => {
      process.send('updated_player_stats:fail')
      throw err
    })
})
