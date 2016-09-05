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


/**
 * ok with NODE_ENV=test keep an eye for dev&producion
 */
if (process.env.NODE_ENV === 'test') {
  attendanceSchema.post('save', (score, done) => {
    forkHandlers.forkChildStatsUpdate(score, done)
  })
} else {
  attendanceSchema.post('save', (score) => {
    forkHandlers.forkChildStatsUpdate(score)
  })
}


module.exports = mongoose.model('attendance', attendanceSchema, 'attendances')
