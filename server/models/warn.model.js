const mongoose = require('mongoose')
const forkHandlers = require('../fork/fork.handlers')

const warnSchema = mongoose.Schema({
  match: {
    type: mongoose.Schema.ObjectId,
    ref: 'match',
    required: [true, 'Match ID is required'],
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
    required: [true, 'Team ID is required'],
  },
  player: {
    type: mongoose.Schema.ObjectId,
    ref: 'player',
    required: [true, 'Player ID is required'],
  },
})

/**
 * ok with NODE_ENV=test keep an eye for dev&producion
 */
if (process.env.NODE_ENV === 'test') {
  warnSchema.post('save', (score, done) => {
    return forkHandlers.forkChildPlayerStatsUpdate(score, done)
  })
  warnSchema.post('remove', (score, done) => {
    return forkHandlers.forkChildPlayerStatsUpdate(score, done)
  })
} else {
  warnSchema.post('save', (score) => {
    return forkHandlers.forkChildPlayerStatsUpdate(score)
  })
  warnSchema.post('remove', (score) => {
    return forkHandlers.forkChildPlayerStatsUpdate(score)
  })
}

module.exports = mongoose.model('warn', warnSchema, 'warns')
