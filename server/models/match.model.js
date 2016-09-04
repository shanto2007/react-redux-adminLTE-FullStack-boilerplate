const mongoose = require('mongoose')

const matchSchema = mongoose.Schema({
  season: { type: mongoose.Schema.ObjectId, ref: 'season' },
  round: { type: mongoose.Schema.ObjectId, ref: 'round' },
  day: { type: mongoose.Schema.ObjectId, ref: 'day' },
  teamHome: { type: mongoose.Schema.ObjectId, ref: 'team' },
  teamAway: { type: mongoose.Schema.ObjectId, ref: 'team' },
  winner: { type: mongoose.Schema.ObjectId, ref: 'team' },
  loser: { type: mongoose.Schema.ObjectId, ref: 'team' },
  played: { type: Boolean, default: false },
  date: { type: Date, required: [true, 'Match date is required'] },
})

module.exports = mongoose.model('match', matchSchema, 'matchs')
