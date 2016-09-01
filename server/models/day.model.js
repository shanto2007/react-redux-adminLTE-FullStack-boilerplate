const mongoose = require('mongoose')

const daySchema = mongoose.Schema({
  round: { type: mongoose.Schema.ObjectId, ref: 'round' },
  season: { type: mongoose.Schema.ObjectId, ref: 'season' },
  count: { type: Number, default: 0 },
  lastday: { type: Boolean, default: false },
})

module.exports = mongoose.model('day', daySchema, 'days')
