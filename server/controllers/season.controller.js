const Season = require('../models/season.model')

module.exports = {
  indexAdmin: (req, res) => {
    return Season.find({}, (err, seasons) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        seasons,
      })
    })
  },
  indexPublic: (req, res) => {
    return Season.find({}, (err, seasons) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        seasons,
      })
    })
  },
  getCurrent: (req, res) => {
    return Season.findOne({ current: true })
    .then((season) => {
      return res.json({
        success: true,
        action: 'get current',
        season,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'get current',
        message: err,
      })
    })
  },
  create: (req, res) => {
    const { body } = req
    if (!body.year) {
      return res.status(400).json({
        success: false,
        message: 'Year is required',
      })
    }

    return Season.count({}).exec()
    .then((count) => {
      let current = false
      if (!count) {
        current = true
      }
      return Season.create({
        year: body.year,
        current,
      })
    })
    .then((season) => {
      return res.json({
        success: true,
        season,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err.code && err.code === 11000 ? 'Season with that year exist' : err,
      })
    })
  },
  edit: (req, res) => {
    const seasonId = req.params.id
    const editedSeason = req.body
    if (!seasonId) {
      return res.status(400).json({
        success: false,
        message: 'Season id is required',
      })
    }
    return Season.findOneAndUpdate({ _id: seasonId }, editedSeason, { new: true }, (err, season) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        season,
      })
    })
  },

  setCurrent: (req, res) => {
    const seasonId = req.params.id
    return Season.setCurrentSeason(seasonId)
      .then((season) => {
        if (!season) {
          return res.status(404).json({
            action: 'set current season',
            success: false,
            message: 'Season Not found!',
          })
        }
        return res.json({
          action: 'set current season',
          success: true,
          season,
        })
      })
      .catch((err) => {
        return res.status(500).json({
          action: 'set current season',
          success: false,
          message: err,
        })
      })
  },

  delete: (req, res) => {
    const seasonId = req.params.id
    if (!seasonId) {
      return res.status(400).json({
        success: false,
        message: 'Season id is required',
      })
    }
    return Season.findOneAndRemove({ _id: seasonId })
    .then((status) => {
      if (!status) {
        return Promise.reject({ status: 404, message: 'Season don\'t exists', })
      }
      return Promise.all([
        Promise.resolve(status),
        Season.cascadeDelete(seasonId),
      ])
    })
    .then((status) => {
      return res.json({
        success: true,
        status,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        message: err.message ? err.message : err,
      })
    })
  },
}
