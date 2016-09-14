const mongoose = require('../config/database')
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
    return done()
  }).catch((err) => {
    return done(err)
  })
})
attendanceSchema.post('remove', (attendance, done) => {
  return forkHandlers.playerAttendanceUpdate(attendance).then(() => {
    return done()
  }).catch((err) => {
    return done(err)
  })
})

module.exports = mongoose.model('attendance', attendanceSchema, 'attendances')
