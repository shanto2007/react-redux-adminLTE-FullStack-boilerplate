const path = require('path')
const fs = require('fs')
const secrets = require('./../config/secrets')
const mongoose = require('mongoose')

const MediaSchema = mongoose.Schema({
  filename: { type: String },
  path: { type: String },
})

MediaSchema.pre('save', function preSave(done) {
  const media = this
  if (media.isModified('filename')) {
    media.path = `/uploads/${media.filename}`
  }
  done()
})

MediaSchema.post('remove', (media, done) => {
  const projectRoot = path.join(__dirname, '../../')
  const uploadDir = path.join(projectRoot, `/${secrets.UPLOAD_DIRNAME}`)
  const file = `${uploadDir}/${media.filename}`
  console.log(file);
  fs.exists(file, (exist) => {
    if (exist) fs.unlinkSync(file)
  })
  done()
})

module.exports = mongoose.model('Media', MediaSchema, 'medias')
