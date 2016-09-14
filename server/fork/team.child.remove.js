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

// TODO the problem is that the score fork child result undefined when called after removing a match and I still don't know why

// WORKING BUT WON'T UPDATE PLAYER STATS remove()

// process.title = `${process.argv[2]}.${process.argv[3]}`
// process.on('message', (match) => {
//   const Promise = require('bluebird')
//   const Score = require('../models/score.model')
//   const Warn = require('../models/warn.model')
//   const Expulsion = require('../models/expulsion.model')
//   const Attendance = require('../models/attendance.model')
//
//   Promise.all([
//     Score.remove({ match: match._id }).exec(),
//     Warn.remove({ match: match._id }).exec(),
//     Expulsion.remove({ match: match._id }).exec(),
//     Attendance.remove({ match: match._id }).exec(),
//   ])
//   .then((res) => {
//     const status = res.map((el) => {
//       return el.result
//     })
//     console.log(status)
//     process.send(`success::${JSON.stringify(status)}`)
//   })
//   .catch((err) => {
//     process.send(`fail::${JSON.stringify(err)}`)
//   })
// })
