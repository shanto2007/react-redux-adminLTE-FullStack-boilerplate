const mongoose = require('mongoose')
const forkHandlers = require('../fork/fork.handlers')

const scoreSchema = mongoose.Schema({
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
  teamScorer: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
    required: [true, 'Team scorer id required'],
  },
  teamTaker: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
    required: [true, 'Team taker id required'],
  },
  player: {
    type: mongoose.Schema.ObjectId,
    ref: 'player',
    required: [true, 'Player id required'],
  },
})

/**
 * OK IN TEST KEEP AN EYE FOR NO TEST ENV
 */
if (process.env.NODE_ENV === 'test') {
  scoreSchema.post('save', (score, done) => {
    return forkHandlers.forkChildStatsUpdate(score, done)
  })
  scoreSchema.post('remove', (score, done) => {
    return forkHandlers.forkChildStatsUpdate(score, done)
  })
} else {
  scoreSchema.post('save', (score) => {
    return forkHandlers.forkChildStatsUpdate(score)
  })
  scoreSchema.post('remove', (score) => {
    return forkHandlers.forkChildStatsUpdate(score)
  })
}


module.exports = mongoose.model('score', scoreSchema, 'scores')
