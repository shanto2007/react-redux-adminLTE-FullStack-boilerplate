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

playerSchema.set('toObject', { virtuals: true });
playerSchema.set('toJSON', { virtuals: true });

playerSchema.virtual('fullname').get(function fullNameVirtualGenerator() {
  return `${this.name} ${this.surname}`
})

/**
 * ADD TO TEAM ARRAY OF REFERENCE
 * document
 */
playerSchema.post('save', (player) => {
  player.model('team').findById(player.team, (err, team) => {
    if (err) throw err
    team.players.addToSet(player)
    team.save()
  })
})

/**
 * REMOVE TO TEAM ARRAY OF REFERENCE
 * work only on document istance not on Model methods
 */
playerSchema.post('remove', (player) => {
  player.model('team').findById(player.team, (err, team) => {
    if (err) throw err
    team.players.pull(player)
    team.save()
  })
})

playerSchema.post('insertMany', function insertManyPostHook(players, done) {
  if (players.length) {
    this.model('team').findById(players[0].team, (err, team) => {
      if (err) throw err
      for (let i = 0; i < players.length; i++) {
        team.players.addToSet(players[i])
      }
      team.save((err) => {
        if (err) throw err
        done()
      })
    })
  }
})


module.exports = mongoose.model('player', playerSchema, 'players')
