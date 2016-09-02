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
    const newRoundRequest = req.body
    if (!newRoundRequest) {
      return res.status(400).json({
        success: false,
        message: 'No data provided',
      })
    }
    if (!newRoundRequest.season) {
      return res.status(400).json({
        success: false,
        message: 'No Season Id Provided',
      })
    }
    if (!newRoundRequest.label) {
      return res.status(400).json({
        success: false,
        message: 'No Round Label Provided',
      })
    }
    const newRound = new Round(newRoundRequest)
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
    const editRoundRequest = req.body
    const roundId = editRoundRequest.id || editRoundRequest._id
    if (!roundId) {
      return res.status(400).json({
        success: false,
        message: 'No data or id provided',
      })
    }
    return Round.findOneAndUpdate({ _id: roundId }, editRoundRequest, { new: true }, (err, round) => {
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
