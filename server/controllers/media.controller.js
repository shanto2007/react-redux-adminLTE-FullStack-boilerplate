const Media = require('../models/media.model.js')

let MediaCtrl
module.exports = MediaCtrl = {
  index: (req, res) => {
    return Media.find({})
    .then((medias) => {
      return res.json({
        success: true,
        action: 'index media',
        medias,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'index media',
        err,
      })
    })
  },

  indexByType: (req, res) => {
    const { type } = req.params
    if (!type) {
      return res.status(400).json({
        success: false,
        action: 'index media by type',
        message: 'No media type provided!',
      })
    }
    return Media.find({ type })
    .then((medias) => {
      return res.json({
        success: true,
        action: 'index media by type',
        medias,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'index media by type',
        message: err,
      })
    })
  },

  get: (req, res) => {
    const { id } = req.params
    return Media.findById(id)
    .then((media) => {
      if (!media) {
        return Promise.reject({
          message: 'Media not found!',
          status: 404,
        })
      }
      return res.json({
        success: true,
        action: 'get media',
        media,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        action: 'get media',
        message: err.message ? err.message : err,
        err,
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

  edit: (req, res) => {
    const { id } = req.params
    const { metadata } = req.body
    return Media.findById(id)
    .then((media) => {
      if (!media) {
        return Promise.reject({
          message: 'Media not found!',
          status: 404,
        })
      }
      if (metadata) media.metadata = metadata
      return media.save()
    })
    .then((newMedia) => {
      return res.json({
        success: true,
        action: 'edit media metadata',
        media: newMedia,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        action: 'edit media metadata',
        message: err.message ? err.message : err,
        err,
      })
    })
  },

  delete: (req, res) => {
    const { id } = req.params
    return Media.findById(id)
    .then((media) => {
      if (!media) {
        return Promise.reject({
          message: 'Media not found!',
          status: 404,
        })
      }
      return media.remove()
    })
    .then((media) => {
      return res.json({
        success: true,
        action: 'delete media',
        media,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        action: 'delete media',
        message: err.message ? err.message : err,
        err,
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
