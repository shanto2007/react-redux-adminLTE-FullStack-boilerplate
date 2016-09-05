const mongoose = require('mongoose')
const forkHandlers = require('../fork/fork.handlers')

const expulsionSchema = mongoose.Schema({
  match: {
    type: mongoose.Schema.ObjectId,
    ref: 'match',
    required: [true, 'Match ID is required'],
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
    required: [true, 'team ID is required'],
  },
  player: {
    type: mongoose.Schema.ObjectId,
    ref: 'player',
    required: [true, 'player ID is required'],
  },
})

/**
 * ok with NODE_ENV=test keep an eye for dev&producion
 */
if (process.env.NODE_ENV === 'test') {
  expulsionSchema.post('save', (score, done) => {
    return forkHandlers.forkChildPlayerStatsUpdate(score, done)
  })
  expulsionSchema.post('remove', (score, done) => {
    return forkHandlers.forkChildPlayerStatsUpdate(score, done)
  })
} else {
  expulsionSchema.post('save', (score) => {
    return forkHandlers.forkChildPlayerStatsUpdate(score)
  })
  expulsionSchema.post('remove', (score) => {
    return forkHandlers.forkChildPlayerStatsUpdate(score)
  })
}

module.exports = mongoose.model('expulsion', expulsionSchema, 'expulsions')
