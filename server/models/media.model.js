const path = require('path')
const fs = require('fs')
const secrets = require('./../config/secrets')
const mongoose = require('mongoose')
const fork = require('../fork/fork.handlers')

const MediaSchema = mongoose.Schema({
  filename: { type: String },
  path: { type: String },
})

MediaSchema.set('toObject', { virtuals: true });
MediaSchema.set('toJSON', { virtuals: true });

MediaSchema.virtual('thumb').get(function() {
  return `/${secrets.UPLOAD_DIRNAME}/thumbnail/${this.filename}`
})

MediaSchema.pre('save', function preSave(done) {
  const media = this
  if (media.isModified('filename')) {
    media.path = `/${secrets.UPLOAD_DIRNAME}/${media.filename}`
  }
  done()
})

MediaSchema.post('save', (media, done) => {
  fork.generateThumbnail(media).then(() => {
    console.log("postsavedone");
    done()
  }).catch(done)
})

MediaSchema.post('remove', (media, done) => {
  console.log("remove");
  const projectRoot = path.join(__dirname, '../../')
  const uploadDir = path.join(projectRoot, `/${secrets.UPLOAD_DIRNAME}`)
  const file = `${uploadDir}/${media.filename}`
  fs.exists(file, (exist) => {
    if (exist) fs.unlinkSync(file)
  }) // DELETE THUMBNAIL TOO
  done()
})


module.exports = mongoose.model('Media', MediaSchema, 'medias')
