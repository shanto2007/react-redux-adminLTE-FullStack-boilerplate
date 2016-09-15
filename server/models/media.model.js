const mongoose = require('../config/database')
const path = require('path')
const fs = require('fs')
const secrets = require('./../config/secrets')
const fork = require('../fork/fork.handlers')

const MediaSchema = mongoose.Schema({
  filename: { type: String },
  path: { type: String },
  type: { type: String, default: null },
})

MediaSchema.set('toObject', { virtuals: true });
MediaSchema.set('toJSON', { virtuals: true });

MediaSchema.virtual('thumbnail').get(function mediaThumbPathVirtual() {
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
  if (process.env.MEDIA_MODEL_TEST_SUITE !== 'true') {
    return fork.generateThumbnail(media).then(() => {
      return done()
    }).catch((err) => {
      return done(err)
    })
  }
  return done()
})

MediaSchema.post('remove', (media, done) => {
  const projectRoot = path.join(__dirname, '../../')
  const uploadDir = path.join(projectRoot, `/${secrets.UPLOAD_DIRNAME}`)
  const file = `${uploadDir}/${media.filename}`
  const thumb = `${uploadDir}/thumbnail/${media.filename}`
  fs.exists(file, (exist) => {
    if (exist) fs.unlinkSync(file)
    fs.exists(thumb, (exist) => {
      if (exist) fs.unlinkSync(thumb)
      return done()
    })
  })
})


module.exports = mongoose.model('media', MediaSchema, 'medias')
