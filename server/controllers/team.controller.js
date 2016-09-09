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
    return Team.findById(teamId)
    .then((team) => {
      if (!team) {
        return res.status(404).json({
          success: true,
          action: 'delete',
          message: 'Team not found, maybe already removed',
        })
      }
      return res.json({
        success: true,
        team,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err,
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
    return Team.findById(teamId)
    .then((team) => {
      if (!team) {
        return res.status(404).json({
          success: true,
          action: 'delete',
          message: 'Team not found, maybe already removed',
        })
      }
      return res.json({
        success: true,
        team,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err,
      })
    })
  },

  create: (req, res) => {
    const newTeam = req.body
    if (!newTeam.season) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Team season not provided',
      })
    }
    if (!newTeam.round) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Team round not provided',
      })
    }
    if (!newTeam.name) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Team name not provided',
      })
    }
    return Team.create(newTeam, (err, team) => {
      if (err) {
        return res.status(500).json({
          success: false,
          action: 'create',
          message: err,
        })
      }
      return res.json({
        success: true,
        action: 'create',
        team,
      })
    })
  },

  edit: (req, res) => {
    const teamToEdit = req.body
    const teamId = teamToEdit.id || req.params.id
    if (!teamId) {
      return res.status(400).json({
        success: false,
        action: 'edit',
        message: 'Team id not provided',
      })
    }
    if (!teamToEdit.name) {
      return res.status(400).json({
        success: false,
        action: 'edit',
        message: 'Team name not provided',
      })
    }
    return Team.findById(teamId)
    .then((team) => {
      if (!team) {
        return res.status(404).json({
          success: true,
          action: 'delete',
          message: 'Team not found, maybe already removed',
        })
      }
      team.name = teamToEdit.name
      return team.save()
    })
    .then((team) => {
      return res.json({
        success: true,
        action: 'edit',
        team,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'edit',
        message: err,
      })
    })
  },

  delete: (req, res) => {
    const teamId = req.params.id
    if (!teamId) {
      return res.status(400).json({
        success: false,
        action: 'delete',
        message: 'Team id not provided',
      })
    }
    return Team.findById(teamId).then((team) => {
      if (!team) {
        return res.status(404).json({
          success: true,
          action: 'delete',
          message: 'Team not found, maybe already removed',
        })
      }
      return team.remove()
    })
    .then((team) => {
      return res.json({
        success: true,
        action: 'delete',
        team,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'delete',
        message: err,
      })
    })
  },
}
