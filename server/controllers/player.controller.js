const Player = require('../models/player.model')
const Media = require('../models/media.model')

module.exports = {
  create: (req, res) => {
    const newPlayer = req.body
    if (!newPlayer.season) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Player season not provided',
      })
    }
    if (!newPlayer.round) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Player round not provided',
      })
    }
    if (!newPlayer.name) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Player team not provided',
      })
    }
    if (!newPlayer.name) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Player name not provided',
      })
    }
    if (!newPlayer.surname) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Player surname not provided',
      })
    }
    return Player.create(newPlayer).then((player) => {
      return res.json({
        success: true,
        action: 'create',
        player,
      })
    }).catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'create',
        message: err,
      })
    })
  },

  edit: (req, res) => {
    const playerToEdit = req.body
    const playerId = req.params.id || req.body._id
    if (!playerId) {
      return res.status(400).json({
        success: false,
        action: 'edit',
        message: 'Player id not provided',
      })
    }
    if (!playerToEdit.name && !playerToEdit.surname) {
      return res.status(400).json({
        success: false,
        action: 'edit',
        message: 'Player name or surname not provided',
      })
    }
    return Player.findById(playerId)
    .then((player) => {
      if (!player) {
        return Promise.reject({
          status: 404,
          message: 'Team not found, maybe already removed',
        })
      }
      player.name = playerToEdit.name ? playerToEdit.name : player.name
      player.surname = playerToEdit.surname ? playerToEdit.surname : player.surname
      return player.save()
    })
    .then((player) => {
      return res.json({
        success: true,
        action: 'edit',
        player,
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
    const playerId = req.params.id
    return Player.findById(playerId).then((player) => {
      if (!player && playerId) {
        return Promise.reject({
          status: 404,
          success: false,
          action: 'delete',
          message: 'Team not found, maybe already removed',
        })
      } else if (!player && !playerId) {
        return Promise.reject({
          status: 400,
          success: false,
          action: 'delete',
          message: 'No player id provided.',
        })
      }
      return player.remove()
    })
    .then((player) => {
      return res.json({
        success: true,
        action: 'delete',
        player,
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

  avatarUpload: (req, res) => {
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
        message: 'No Player Id provided',
      })
    }
    const type = 'avatar'
    const filename = req.body.filename || req.file.filename
    return Media.create({
      filename,
      type,
    }).then((media) => {
      return Player.findByIdAndUpdate(id, { avatar: media._id }, { new: true }).populate('avatar')
    })
    .then((player) => {
      return res.json({
        success: true,
        action: 'update',
        player,
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
