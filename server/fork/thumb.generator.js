process.title = `${process.argv[2]}.${process.argv[3]}`
process.on('message', (media) => {
  const Promise = require('bluebird')
  const Jimp = require('jimp')
  const fs = require('fs')
  const path = require('path')
  const Media = require('../models/media.model')

  const thumbPath = path.join(process.cwd(), `${process.env.UPLOAD_DIRNAME}/thumbnail/`)
  let mediaInstance

  Promise
    .resolve(Media.findById(media._id))
    .then((media) => {
      if (!media) {
        const err = JSON.stringify({ error: 'No Media found', origin: process.title })
        process.send(`fail::${err}`)
      }
      mediaInstance = media
      const fsPath = path.join(process.cwd(), media.path)
      fs.stat(thumbPath, (err, stat) => {
        if(!stat) fs.mkdir(thumbPath)
      })
      return Jimp.read(fsPath)
    })
    .then(function (image) {
      // original extension poi boh ch'o sonno
      console.log(process.title);
      return image
        .resize(250, 250)
        .quality(50)
        .write(thumbPath + mediaInstance.filename);
    })
    .then((res) => {
      process.send(`success::${JSON.stringify(res)}`)
    })
    .catch((err) => {
      process.send(`fail::${JSON.stringify(err)}`)
    })
})


process.on(`${process.title} uncaughtException`, (err) => {
  console.log(`Caught exception: ${err}`)
})
