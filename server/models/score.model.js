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

scoreSchema.post('save', (score, done) => {
  forkHandlers.playerScoreUpdate(score).then(() => {
    done()
  }).catch((err) => {
    console.log(err);
    done()
  })
})
scoreSchema.post('remove', (score, done) => {
  forkHandlers.playerScoreUpdate(score).then(() => {
    done()
  }).catch((err) => {
    console.log(err);
    done()
  })
})

module.exports = mongoose.model('score', scoreSchema, 'scores')
