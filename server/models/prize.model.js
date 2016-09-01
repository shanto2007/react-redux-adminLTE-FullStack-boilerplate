const mongoose = require('mongoose')

const prizeSchema = mongoose.Schema({
  season: { type: mongoose.Schema.ObjectId, ref: 'season' },
  media: { type: mongoose.Schema.ObjectId, ref: 'media' },
  title: { type: String, require: true },
  description: { type: String, require: true },
  type: { type: String, require: true },
})

module.exports = mongoose.model('prize', prizeSchema, 'prizes')
