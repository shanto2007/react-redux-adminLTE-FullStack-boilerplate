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

MediaSchema.virtual('thumbnail').get(function() {
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
  if (!process.env.MEDIA_MODEL_TEST) {
    fork.generateThumbnail(media).then(() => {
      done()
    }).catch((err) => {
      console.error('generateThumbnail', err)
      done()
    })
  }
  done()
})

MediaSchema.post('remove', (media, done) => {
  console.log("remove");
  const projectRoot = path.join(__dirname, '../../')
  const uploadDir = path.join(projectRoot, `/${secrets.UPLOAD_DIRNAME}`)
  const file = `${uploadDir}/${media.filename}`
  const thumb = `${uploadDir}/thumbnail/${media.filename}`
  fs.exists(file, (exist) => {
    if (exist) fs.unlinkSync(file)
  })
  fs.exists(thumb, (exist) => {
    if (exist) fs.unlinkSync(thumb)
  })
  done()
})


module.exports = mongoose.model('Media', MediaSchema, 'medias')
