const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
    required: [true, 'Player\'s Team id not provided'],
  },
  season: {
    type: mongoose.Schema.ObjectId,
    ref: 'season',
    required: [true, 'Player\'s Season id not provided'],
  },
  round: {
    type: mongoose.Schema.ObjectId,
    ref: 'round',
    required: [true, 'Player\'s Round id not provided'],
  },
  name: {
    type: String,
    required: [true, 'Player name not provided'],
  },
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: 'media',
  },
  goalsCount: {
    type: Number,
    default: 0,
  },
  warnsCount: {
    type: Number,
    default: 0,
  },
  expulsionsCoutt: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('player', playerSchema, 'players')
