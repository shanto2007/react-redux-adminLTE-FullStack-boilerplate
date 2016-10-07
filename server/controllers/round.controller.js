const Round = require('../models/round.model')
const Media = require('../models/media.model')

module.exports = {
  indexAdmin: (req, res) => {
    return Round.find({}, (err, rounds) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        rounds,
      })
    })
  },
  indexPublic: (req, res) => {
    return Round.find({}, (err, rounds) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        rounds,
      })
    })
  },

  indexBySeason: (req, res) => {
    const seasonId = req.params.season
    if (!seasonId) {
      return res.status(400).json({
        success: false,
        message: 'No Season id provided',
      })
    }
    return Round.find({
      season: seasonId,
    })
    .populate('season media')
    .exec()
    .then((rounds) => {
      return res.json({
        success: true,
        action: 'index by season',
        rounds,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'index by season',
        message: err,
        err,
      })
    })
  },

  create: (req, res) => {
    const newRoundRequest = req.body
    if (!newRoundRequest) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'No data provided',
      })
    }
    if (!newRoundRequest.season) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'No Season Id Provided',
      })
    }
    if (!newRoundRequest.label) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'No Round Label Provided',
      })
    }
    return Round.create(newRoundRequest)
      .then((round) => {
        return res.json({
          success: true,
          action: 'create',
          round,
        })
      })
      .catch((err) => {
        const message = err.code && err.code === 11000 ? 'Label already exist for this season.' : err
        const status = err.code && err.code === 11000 ? 400 : 500
        return res.status(status).json({
          success: false,
          action: 'create',
          message,
          err,
        })
      })
  },
  edit: (req, res) => {
    const editRoundRequest = req.body
    const roundId = req.params.id
    if (!roundId) {
      return res.status(400).json({
        success: false,
        message: 'No data or id provided',
      })
    }
    return Round.findOneAndUpdate({ _id: roundId }, editRoundRequest, { new: true }).exec()
      .then((round) => {
        return res.json({
          success: true,
          action: 'edit',
          round,
        })
      })
      .catch((err) => {
        const message = err.code && err.code === 11000 ? 'Label already exist for this season.' : err
        const status = err.code && err.code === 11000 ? 400 : 500
        return res.status(status).json({
          success: false,
          action: 'edit',
          message,
          err,
        })
      })
  },
  delete: (req, res) => {
    const roundId = req.params.id
    if (!roundId) {
      return res.status(400).json({
        success: false,
        message: 'No id provided',
      })
    }
    // TODO: CASCADE REMOVE >> Team, Day, Matches
    return Round.findOneAndRemove({ _id: roundId }).exec()
      .then((round) => {
        if (!round) {
          return res.status(404).json({
            success: false,
            action: 'delete',
            message: 'Round not found, maybe already deleted.',
          })
        }
        return res.json({
          success: true,
          action: 'delete',
          round,
        })
      })
      .catch((err) => {
        return res.status(status).json({
          success: false,
          action: 'remove',
          message: err.message,
          err,
        })
      })
  },

  roundPhotoUpload: (req, res) => {
    const { file } = req
    const { id } = req.params
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      })
    }
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'No round Id provided',
      })
    }
    const type = 'roundHostPhoto'
    const filename = req.body.filename || req.file.filename
    return Media.create({
      filename,
      type,
    })
    .then((media) => {
      return Round.findByIdAndUpdate(id, { media: media._id }, { new: true })
    })
    .then((round) => {
      return res.json({
        success: true,
        action: 'update',
        round,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: 'Error uploading round host photo, try again.',
        error: err,
      })
    })
  },

  roundPhotoRemove: (req, res) => {
    const { id } = req.params
    let fetchedRound
    Round.findById(id)
    .then((round) => {
      if (!round) {
        return Promise.reject({
          message: 'Round not found, maybe already deleted',
          status: 404,
        })
      }
      fetchedRound = round
      return Media.findById(round.media)
    })
    .then((media) => {
      if (!media) {
        return Promise.reject({ message: 'The round has no media', status: 404 })
      }
      return media.remove()
    })
    .then(() => {
      return Round.findOneAndUpdate({ _id: fetchedRound._id }, { $unset: { media: 1 } }, { new: true }).exec()
    })
    .then((round) => {
      return res.json({
        success: true,
        action: 'remove round media',
        message: 'Round media removed',
        round,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        action: 'remove round media',
        message: err.message ? err.message : 'Error removing round host photo, try again.',
        error: err,
      })
    })
  },
}
