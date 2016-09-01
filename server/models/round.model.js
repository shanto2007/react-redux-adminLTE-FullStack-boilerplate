const mongoose = require('mongoose')

const roundSchema = mongoose.Schema({
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'season', required: true },
  host: { type: String, default: '' },
  media: { type: mongoose.Schema.Types.ObjectId, ref: 'media' },
})

module.exports = mongoose.model('round', roundSchema, 'rounds')
