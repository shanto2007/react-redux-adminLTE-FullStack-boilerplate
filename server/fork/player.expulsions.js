process.on('message', (score) => {
  const { Promise } = global
  const db = require('../config/database')
  const Player = require('../models/player.model')
  const Exp = require('../models/expulsion.model')
  db.connect()
  let playerInstance
  Promise
    .resolve(Player.findById(score.player))
    .then((player) => {
      if (!player) process.send('no_player_found:fail')
      playerInstance = player
      return Exp.count({ player: player._id })
    })
    .then((count) => {
      return playerInstance.update({
        expulsions: count,
      })
    })
    .then((status) => {
      setTimeout(() => {
        process.exit()
      }, 10)
      process.send('update_player_scores:success')
    })
    .catch(() => {
      setTimeout(() => {
        process.exit()
      }, 10)
      process.send('update_player_scores:fail')
    })
})
