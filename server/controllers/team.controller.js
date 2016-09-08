const Team = require('../models/team.model')

module.exports = {
  indexAdmin: (req, res) => {
    const query = {}
    if (req.params.round || req.body.round) {
      query.round = req.params.round || req.body.round
    }
    if (req.params.season || req.body.season) {
      query.season = req.params.season || req.body.season
    }
    return Team.find(query, (err, teams) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        teams,
      })
    })
  },
  indexPublic: (req, res) => {
    const query = {}
    if (req.params.round || req.body.round) {
      query.round = req.params.round || req.body.round
    }
    if (req.params.season || req.body.season) {
      query.season = req.params.season || req.body.season
    }
    return Team.find(query, (err, teams) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        teams,
      })
    })
  },
  getPublic: (req, res) => {
    const teamId = req.body.id || req.params.id
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'No Team id provided',
      })
    }
    return Team.findById(teamId, (err, team) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        team,
      })
    })
  },
  getAdmin: (req, res) => {
    const teamId = req.body.id || req.params.id
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'No Team id provided',
      })
    }
    return Team.findById(teamId, (err, team) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        team,
      })
    })
  },
  create: (req, res) => {
    return res.send('ok')
  },
  edit: (req, res) => {
    return res.send('ok')
  },
  delete: (req, res) => {
    return res.send('ok')
  },
}
