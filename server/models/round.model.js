const mongoose = require('mongoose')

const roundSchema = mongoose.Schema({
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'season', required: [true, 'Round\'s season id not provided!'] },
  media: { type: mongoose.Schema.Types.ObjectId, ref: 'media' },
  host: { type: String, default: '' },
  label: { type: String, default: '', required: [true, 'Round label not provided'], unique: [true, 'Round label must be unique value'] },
})

module.exports = mongoose.model('round', roundSchema, 'rounds')
