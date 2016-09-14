process.title = `${process.argv[2]}.${process.argv[3]}`
process.on('message', (match) => {
  const Promise = require('bluebird')
  const Score = require('../models/score.model')
  const Warn = require('../models/warn.model')
  const Expulsion = require('../models/expulsion.model')
  const Attendance = require('../models/attendance.model')

  Promise.all([
    Score.find({ match: match._id }),
    Warn.find({ match: match._id }),
    Expulsion.find({ match: match._id }),
    Attendance.find({ match: match._id }),
  ]).then((data) => {
    const promises = []
    data[0].forEach((score) => promises.push(score.remove()))
    data[1].forEach((warn) => promises.push(warn.remove()))
    data[2].forEach((expulsion) => promises.push(expulsion.remove()))
    data[3].forEach((attendance) => promises.push(attendance.remove()))
    return Promise.all(promises)
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
