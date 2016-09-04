const mongoose = require('mongoose')

const prizeSchema = mongoose.Schema({
  season: { type: mongoose.Schema.ObjectId, ref: 'season' },
  media: { type: mongoose.Schema.ObjectId, ref: 'media' },
  title: { type: String, require: [true, 'Prize\'s title not provided!'] },
  description: { type: String, require: [true, 'Prize\'s description not provided!'] },
  type: { type: String, require: [true, 'Prize\'s type not provided!'] },
})

module.exports = mongoose.model('prize', prizeSchema, 'prizes')
