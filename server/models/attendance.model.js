const mongoose = require('mongoose')
const forkHandlers = require('../fork/fork.handlers')

const attendanceSchema = mongoose.Schema({
  season: {
    type: mongoose.Schema.ObjectId,
    ref: 'season',
    required: [true, 'Season id required'],
  },
  match: {
    type: mongoose.Schema.ObjectId,
    ref: 'match',
    required: [true, 'Match id required'],
  },
  player: {
    type: mongoose.Schema.ObjectId,
    ref: 'player',
    required: [true, 'Player id required'],
  },
})



attendanceSchema.post('save', (attendance, done) => {
  return forkHandlers.playerAttendanceUpdate(attendance).then(() => {
    done()
  }).catch((err) => {
    throw err
    done()
  })
})
attendanceSchema.post('remove', (attendance, done) => {
  return forkHandlers.playerAttendanceUpdate(attendance).then(() => {
    done()
  }).catch((err) => {
    throw err
    done()
  })
})




module.exports = mongoose.model('attendance', attendanceSchema, 'attendances')
