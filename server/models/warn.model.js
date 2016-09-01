const mongoose = require('mongoose')

const warnSchema = mongoose.Schema({
  match: { type: mongoose.Schema.ObjectId, ref: 'match' },
  team: { type: mongoose.Schema.ObjectId, ref: 'team' },
  player: { type: mongoose.Schema.ObjectId, ref: 'player' },
})

module.exports = mongoose.model('warn', warnSchema, 'warns')
