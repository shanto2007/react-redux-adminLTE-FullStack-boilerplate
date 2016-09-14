const mongoose = require('../config/database').mongoose

const postSchema = mongoose.Schema({
  media: { type: mongoose.Schema.ObjectId, ref: 'media' },
  data: { type: Date, default: Date.now() },
  title: { type: String, require: [true, 'Post title not provided'] },
  body: { type: String, require: [true, 'Post body not provided'] },
  type: { type: String, require: [true, 'Post type not provided'] },
})

module.exports = mongoose.model('post', postSchema, 'posts')
