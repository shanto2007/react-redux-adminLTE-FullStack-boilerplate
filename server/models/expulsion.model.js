const mongoose = require('mongoose')

const expulsionSchema = mongoose.Schema({
  match: { type: mongoose.Schema.ObjectId, ref: 'match' },
  team: { type: mongoose.Schema.ObjectId, ref: 'team' },
  player: { type: mongoose.Schema.ObjectId, ref: 'player' },
})

module.exports = mongoose.model('expulsion', expulsionSchema, 'expulsions')
