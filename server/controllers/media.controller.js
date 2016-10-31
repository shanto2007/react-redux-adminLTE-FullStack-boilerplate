const Media = require('../models/media.model.js')

let MediaCtrl
module.exports = MediaCtrl = {
  index: (req, res) => {
    Media.find({}, (err, medias) => {
      if (err) {
        return res.status(500).json({
          success: false,
          err,
        })
      }
      return res.json({
        success: true,
        medias,
      })
    })
  },

  get: (req, res) => {
    const mediaId = req.body.id || req.params.id
    Media.findById(mediaId, (err, media) => {
      if (err) {
        return res.status(500).json({
          success: false,
          err,
        })
      }

      if (!media) {
        return res.status(404).json({
          success: false,
          message: 'Media not found!',
        })
      }

      return res.json({
        success: true,
        media,
      })
    })
  },

  create: (req, res) => {
    const filename = req.body.filename || req.file.filename
    const { type, metadata } = req.body
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'No Filename provided',
      })
    }

    return new Media({
      filename,
      type,
      metadata,
    }).save((err, media) => {
      if (err) {
        return res.status(500).json({
          success: false,
          err,
        })
      }
      return res.json({
        success: true,
        media,
      })
    })
  },

  delete: (req, res) => {
    const mediaId = req.body.id || req.params.id
    Media.findById(mediaId, (err, media) => {
      if (err) {
        return res.status(500).json({
          success: false,
          err,
        })
      }

      if (!media) {
        return res.status(404).json({
          success: false,
          message: 'Media not found!',
        })
      }
      return media.remove((error) => {
        if (error) {
          return res.status(500).json({
            success: false,
            error,
          })
        }
        return res.json({
          success: true,
          message: 'Media removed.',
        })
      })
    })
  },

  upload: (req, res) => {
    const { file } = req
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      })
    }
    return MediaCtrl.create(req, res)
  },
}
