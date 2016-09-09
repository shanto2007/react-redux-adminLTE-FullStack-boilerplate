const Team = require('../models/team.model')

module.exports = {
  indexAdmin: (req, res) => {
    return Team.find(req.query, (err, teams) => {
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
    return Team.find(req.query, (err, teams) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Invalid query.',
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
    const newTeam = req.body
    if (!req.body.season) {
      return res.status(500).json({
        success: false,
        message: 'Team season not provided',
      })
    }
    if (!req.body.round) {
      return res.status(500).json({
        success: false,
        message: 'Team round not provided',
      })
    }
    if (!req.body.name) {
      return res.status(500).json({
        success: false,
        message: 'Team name not provided',
      })
    }
    Team.create(newTeam, (err, team) => {
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
    return res.send('ok')
  },
  edit: (req, res) => {
    return res.send('ok')
  },
  delete: (req, res) => {
    return res.send('ok')
  },
}
