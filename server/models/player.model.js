const { Promise } = global
const mongoose = require('../config/database')

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
  player.model('team').update({ _id: player.team }, {
    $addToSet: {
      players: player,
    },
  }, (err) => {
    if (err) done(err)
    done()
  })
})

/**
 * REMOVE FROM TEAM ARRAY OF REFERENCE
 * work only on document istance not on Model methods
 */
playerSchema.post('remove', (player, done) => {
  player.model('team').update({ _id: player.team }, {
    $pull: {
      players: player._id,
    },
  }, (err) => {
    if (err) done(err)
    done()
  })
})

playerSchema.post('remove', (player, done) => {
  player
    .model('attendance')
    .find({ player: player._id })
    .then((attendances) => {
      const promises = []
      for (let i = 0; i < attendances.length; i++) {
        promises.push(attendances[i].remove())
      }
      return Promise.all(promises)
    })
    .then(done())
    .catch(done)
})

playerSchema.post('remove', (player, done) => {
  return player.model('media').findOne({ _id: player.avatar }).then((media) => {
    if (media) media.remove()
    done()
  }).catch(done)
})

playerSchema.post('remove', (player, done) => {
  player
    .model('score')
    .find({ player: player._id })
    .then((scores) => {
      const promises = []
      for (let i = 0; i < scores.length; i++) {
        promises.push(scores[i].remove())
      }
      return Promise.all(promises)
    })
    .then(done())
    .catch(done)
})

playerSchema.post('remove', (player, done) => {
  player
    .model('warn')
    .find({ player: player._id })
    .then((warns) => {
      const promises = []
      for (let i = 0; i < warns.length; i++) {
        promises.push(warns[i].remove())
      }
      return Promise.all(promises)
    })
    .then(done())
    .catch(done)
})

playerSchema.post('remove', (player, done) => {
  player
    .model('expulsion')
    .find({ player: player._id })
    .then((expulsions) => {
      const promises = []
      for (let i = 0; i < expulsions.length; i++) {
        promises.push(expulsions[i].remove())
      }
      return Promise.all(promises)
    })
    .then(done())
    .catch(done)
})

module.exports = mongoose.model('player', playerSchema, 'players')
