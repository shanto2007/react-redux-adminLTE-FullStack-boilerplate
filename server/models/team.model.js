const mongoose = require('mongoose')

const teamSchema = mongoose.Schema({
  round: {
    type: mongoose.Schema.ObjectId,
    ref: 'round',
    required: [true, 'Round id is required!'],
  },
  season: {
    type: mongoose.Schema.ObjectId,
    ref: 'season',
    required: [true, 'Season id is required!'],
  },
  players: [{
    type: mongoose.Schema.ObjectId,
    ref: 'players',
  }],
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: 'media',
  },
  groupPhoto: {
    type: mongoose.Schema.ObjectId,
    ref: 'media',
  },
  goalScored: {
    type: Number,
    default: 0,
  },
  goalTaken: {
    type: Number,
    default: 0,
  },
  wins: {
    type: Number,
    default: 0,
  },
  draws: {
    type: Number,
    default: 0,
  },
  losts: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: '',
    trim: true,
    // unique: [true, 'Team name must be unique'],
    required: [true, 'Team name is required'],
  },
})

//  TEAM NAME ARE UNIQUE PER SEASON
teamSchema.index({ name:1, season: 1 }, { unique: true });

module.exports = mongoose.model('team', teamSchema, 'teams')
