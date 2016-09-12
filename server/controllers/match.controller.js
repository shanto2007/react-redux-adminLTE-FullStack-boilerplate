const Match = require('../models/match.model')

module.exports = {
  create: (req, res) => {
    const newMatch = req.body
    if (!newMatch.season) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match season id not provided',
      })
    }
    if (!newMatch.round) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match round id not provided',
      })
    }
    if (!newMatch.day) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match day id not provided',
      })
    }
    if (!newMatch.teamHome) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match teamHome id not provided',
      })
    }
    if (!newMatch.teamAway) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match teamAway id not provided',
      })
    }
    if (!newMatch.date) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match date not provided',
      })
    }
    return Match.create(newMatch).then((match) => {
      return res.json({
        success: true,
        action: 'create',
        match,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'create',
        message: err,
      })
    })
  },

  edit: (req, res) => {
    return res.send(200)
  },

  delete: (req, res) => {
    return res.send(200)
  },
}
