const Team = require('../models/team.model')
const Media = require('../models/media.model')

module.exports = {
  indexByRound: (req, res) => {
    const { round } = req.params
    return Team.find({ round }).exec()
      .then((teams) => {
        return res.json({
          success: true,
          action: 'index by round',
          teams,
        })
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          action: 'index by round',
          message: err,
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
    const teamId = req.params.id
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'No Team id provided',
      })
    }
    return Team.findById(teamId)
    .then((team) => {
      if (!team) {
        return Promise.reject({
          message: 'Team not found, maybe already removed',
          status: 404,
        })
      }
      return res.json({
        success: true,
        team,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        message: err.message ? err.message : err,
      })
    })
  },

  getAdmin: (req, res) => {
    const teamId = req.params.id
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'No Team id provided',
      })
    }
    return Team
      .findById(teamId)
      .populate('avatar groupPhoto')
      .exec()
      .then((team) => {
        if (!team) {
          return Promise.reject({
            message: 'Team not found, maybe already removed',
            status: 404,
          })
        }
        return res.json({
          success: true,
          team,
        })
      })
      .catch((err) => {
        return res.status(err.status ? err.status : 500).json({
          success: false,
          message: err.message ? err.message : err,
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
    return Team.create(newTeam)
      .then((team) => {
        return res.json({
          success: true,
          action: 'create',
          team,
        })
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          action: 'create',
          message: err.code && err.code === 11000 ? 'A team with that name already exist in this season.' : err,
          err,
        })
      })
  },

  edit: (req, res) => {
    const teamToEdit = req.body
    const teamId = req.params.id
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
        return Promise.reject({
          status: 404,
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
      return res.status(err.status ? err.status : 500).json({
        success: false,
        action: 'edit',
        message: err.message ? err.message : err,
      })
    })
  },

  delete: (req, res) => {
    const teamId = req.params.id
    return Team.findById(teamId)
    .then((team) => {
      if (!team) {
        return Promise.reject({
          status: 404,
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
      return res.status(err.status ? err.status : 500).json({
        success: false,
        action: 'delete',
        message: err.message ? err.message : err,
      })
    })
  },

  teamPhotoUpload: (req, res) => {
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
        message: 'No Team Id provided',
      })
    }
    const type = 'groupPhoto'
    const filename = req.body.filename || req.file.filename
    return Media.create({
      filename,
      type,
    }).then((media) => {
      return Team.findByIdAndUpdate(id, { groupPhoto: media._id }, { new: true })
    })
    .then((team) => {
      return res.json({
        success: true,
        action: 'update',
        team,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: 'Error uploading team photo, try again.',
        error: err,
      })
    })
  },

  teamAvatarUpload: (req, res) => {
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
        message: 'No Team Id provided',
      })
    }
    const type = 'avatar'
    const filename = req.body.filename || req.file.filename
    return Media.create({
      filename,
      type,
    }).then((media) => {
      return Team.findByIdAndUpdate(id, { avatar: media._id }, { new: true })
    })
    .then((team) => {
      return res.json({
        success: true,
        action: 'update',
        team,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: 'Error uploading team photo, try again.',
        error: err,
      })
    })
  },
}
