const mongoose = require('mongoose')

const roundSchema = mongoose.Schema({
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'season', required: true },
  media: { type: mongoose.Schema.Types.ObjectId, ref: 'media' },
  host: { type: String, default: '' },
  label: { type: String, default: '', required: true, unique: true },
})

module.exports = mongoose.model('round', roundSchema, 'rounds')
