const sanitizeHtml = require('sanitize-html')
const mongoose = require('../config/database')

const bodySanitize = {
  allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
  'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'],
}

const titleSanitize = {
  allowedTags: [],
  allowedAttributes: [],
}

const postSchema = mongoose.Schema({
  title: { type: String, required: [true, 'Post title not provided'] },
  body: { type: String, required: [true, 'Post body not provided'] },
  type: { type: String, default: 'post' },
  media: { type: mongoose.Schema.ObjectId, ref: 'media' },
  created: { type: Date, default: Date.now() },
  metadata: { type: mongoose.Schema.Types.Mixed },
})

postSchema.pre('validate', function preValidatePost(next) {
  const post = this
  if (post.isModified('metadata') && typeof this.metadata !== 'string') {
    try {
      this.metadata = JSON.stringify(this.metadata)
    } catch (e) {
      next(e)
    }
  }
  next()
})

postSchema.pre('save', function preSavePost(next) {
  const post = this
  post.title = sanitizeHtml(post.title, titleSanitize).trim()
  post.body = sanitizeHtml(post.body, bodySanitize).trim()
  next()
})

module.exports = mongoose.model('post', postSchema, 'posts')
