const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  media: { type: mongoose.Schema.ObjectId, ref: 'media' },
  data: { type: Date, default: Date.now() },
  title: { type: String, require: true },
  body: { type: String, require: true },
  type: { type: String, require: true },
})

module.exports = mongoose.model('post', postSchema, 'posts')
