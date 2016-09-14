process.title = `${process.argv[2]}.${process.argv[3]}`
console.log(`Fork: ${process.title}`)
process.on('message', (score) => {
  const Promise = require('bluebird')
  const Player = require('../models/player.model')
  const Attendance = require('../models/attendance.model')

  let playerInstance

  Promise
    .resolve(Player.findById(score.player))
    .then((player) => {
      if (!player) {
        const err = JSON.stringify({ error: 'No player found', origin: process.title })
        process.send(`fail::${err}`)
      }
      playerInstance = player
      return Attendance.count({ player: player._id })
    })
    .then((count) => {
      return playerInstance.update({
        attendance: count,
      })
    })
    .then((res) => {
      process.send(`success::${JSON.stringify(res)}`)
    })
    .catch((err) => {
      process.send(`fail::${JSON.stringify(err)}`)
    })
})

process.on(`${process.title} uncaughtException`, (err) => {
  console.log(`Caught exception: ${err}`)
})
