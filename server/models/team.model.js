const mongoose = require('mongoose')

const teamSchema = mongoose.Schema({
  round: { type: mongoose.Schema.ObjectId, ref: 'round' },
  season: { type: mongoose.Schema.ObjectId, ref: 'season' },
  avatar: { type: mongoose.Schema.ObjectId, ref: 'media' },
  groupPhoto: { type: mongoose.Schema.ObjectId, ref: 'media' },
  goalScored: { type: Number, default: 0 },
  goalTaken: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losts: { type: Number, default: 0 },
})

module.exports = mongoose.model('team', teamSchema, 'teams')
