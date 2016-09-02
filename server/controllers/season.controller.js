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
  create: (req, res) => {
    const { body } = req
    if (!req.body || !req.body.year) {
      return res.status(400).json({
        success: false,
        message: 'Year is required',
      })
    }
    const season = new Season(body)
    return season.save((err, season) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.code && err.code === 11000 ? 'Season with that year exist' : err,
        })
      }
      return res.json({
        success: true,
        season,
      })
    })
  },
  edit: (req, res) => {
    const seasonId = req.body.id || req.body._id
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
  delete: (req, res) => {
    const seasonId = req.body.id || req.body._id
    if (!seasonId) {
      return res.status(400).json({
        success: false,
        message: 'Season id is required',
      })
    }
    return Season.findOneAndRemove({ _id: seasonId }, (err, status) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      if (!status) {
        return res.status(404).json({
          success: false,
          message: 'Season don\'t exists',
        })
      }
      return res.json({
        success: true,
        status,
      })
    })
  },
}
