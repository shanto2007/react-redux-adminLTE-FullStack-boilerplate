const mongoose = require('../config/database')

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
  name: {
    type: String,
    default: '',
    trim: true,
    required: [true, 'Team name is required'],
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
  points: {
    type: Number,
    default: 0,
  },
})

//  TEAM NAME ARE UNIQUE PER SEASON
teamSchema.index({ name: 1, season: 1 }, { unique: true })

teamSchema.post('remove', (team, done) => {
  const promises = []
  team
  .model('player')
  .find({ team: team._id })
  .then((players) => {
    for (let i = 0; i < players.length; i++) {
      promises.push(players[i].remove())
    }
    return team.model('media').find({ _id: { $in: [team.groupPhoto, team.avatar] } })
  })
  .then((medias) => {
    for (let i = 0; i < medias.length; i++) {
      promises.push(medias[i].remove())
    }
    return Promise.all(promises)
  })
  .then(done())
  .catch(done)
})

module.exports = mongoose.model('team', teamSchema, 'teams')
