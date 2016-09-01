const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
  team: { type: mongoose.Schema.ObjectId, ref: 'team' },
  season: { type: mongoose.Schema.ObjectId, ref: 'season' },
  round: { type: mongoose.Schema.ObjectId, ref: 'round' },
  name: { type: String, require: true },
  goalsCount: { type: Number },
  warnsCount: { type: Number },
  expulsionsCoutt: { type: Number },
})

module.exports = mongoose.model('player', playerSchema, 'players')
