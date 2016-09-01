const mongoose = require('mongoose')

const scoreSchema = mongoose.Schema({
  season: { type: mongoose.Schema.ObjectId, ref: 'season' },
  match: { type: mongoose.Schema.ObjectId, ref: 'match' },
  teamScorer: { type: mongoose.Schema.ObjectId, ref: 'team' },
  teamTaker: { type: mongoose.Schema.ObjectId, ref: 'team' },
  player: { type: mongoose.Schema.ObjectId, ref: 'player' },
})

module.exports = mongoose.model('score', scoreSchema, 'scores')
