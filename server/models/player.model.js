const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
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
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
    required: [true, 'Player\'s Team id not provided'],
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Player name not provided'],
  },
  surname: {
    type: String,
    trim: true,
    required: [true, 'Player surname not provided'],
  },
  avatar: {
    type: mongoose.Schema.ObjectId,
    ref: 'media',
  },
  goals: {
    type: Number,
    default: 0,
  },
  warns: {
    type: Number,
    default: 0,
  },
  expulsions: {
    type: Number,
    default: 0,
  },
  attendance: {
    type: Number,
    default: 0,
  },
})

playerSchema.set('toObject', { virtuals: true });
playerSchema.set('toJSON', { virtuals: true });

playerSchema.virtual('fullname').get(function fullNameVirtualGenerator() {
  return `${this.name} ${this.surname}`
})

/**
 * ADD TO TEAM ARRAY OF REFERENCE
 * document
 */
playerSchema.post('save', (player, done) => {
  player.model('team').update({ _id: player.team}, {
    $addToSet: {
      players: player
    },
  }, (err, stats) => {
    if (err) done(err)
    done()
  })
})

/**
 * REMOVE TO TEAM ARRAY OF REFERENCE
 * work only on document istance not on Model methods
 */
playerSchema.post('remove', (player, done) => {
  player.model('team').update({ _id: player.team }, {
    $pull: {
      players: player._id,
    },
  }, (err, status) => {
    if (err) done(err)
    done()
  })
})

module.exports = mongoose.model('player', playerSchema, 'players')
