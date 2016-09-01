const Round = require('../models/round.model')

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
  create: (req, res) => {
    const round = req.body
    if (!round) {
      return res.status(400).json({
        success: false,
        message: 'No data provided',
      })
    }
    if (!round.season) {
      return res.status(400).json({
        success: false,
        message: 'No Season Id Provided',
      })
    }
    const newRound = new Round(round)
    return newRound.save((err, round) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        round,
      })
    })
  },
  edit: (req, res) => {
    const editRound = req.body
    if (!editRound || !editRound._id) {
      return res.status(400).json({
        success: false,
        message: 'No data or id provided',
      })
    }
    return Round.findOneAndUpdate({ _id: editRound._id }, editRound, { new: true }, (err, round) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        round,
      })
    })
  },
  delete: (req, res) => {
    const id = req.body.id || req.body._id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'No id provided',
      })
    }
    return Round.findOneAndRemove({ _id: id }, (err, status) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      if (!status) {
        return res.status(404).json({
          success: false,
          message: 'Round not found',
        })
      }
      return res.json({
        success: true,
        status,
      })
    })
  },
}
