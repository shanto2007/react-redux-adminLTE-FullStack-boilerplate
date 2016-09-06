const mongoose = require('mongoose')
const forkHandlers = require('../fork/fork.handlers')

const matchSchema = mongoose.Schema({
  season: {
    type: mongoose.Schema.ObjectId,
    ref: 'season',
    required: [true, 'Season id is required'],
  },
  round: {
    type: mongoose.Schema.ObjectId,
    ref: 'round',
    required: [true, 'Round id is required'],
  },
  day: {
    type: mongoose.Schema.ObjectId,
    ref: 'day',
    required: [true, 'Day id is required'],
  },
  teamHome: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
    required: [true, 'Team at home id is required'],
  },
  teamAway: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
    required: [true, 'Team Away id is required'],
  },
  winner: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
  },
  loser: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
  },
  played: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: [true, 'Match date is required'],
  },
})

matchSchema.pre('validate', function matchPreValidation(next) {
  const match = this;
  if (match.isModified('teamHome') || match.isModified('teamAway')) {
    if (match.teamHome && match.teamAway) {
      if (match.teamHome.equals(match.teamAway)) {
        const err = new Error('match.model validation: teamHome and teamAway ids must be different!')
        next(err)
      }
    }
  }
  next()
})

matchSchema.pre('save', function preSaveHookMatch(next) {
  const match = this
  if (this.isModified('played') && this.isModified('winner')) {
    match.loser = match.winner.equals(match.teamHome) ? match.teamAway : match.teamHome
  }
  next()
})

if (process.env.NODE_ENV === 'test') {
  matchSchema.post('save', (match, done) => {
    if (match.played) {
      forkHandlers.forkChildTeamStatsUpdate(match, done)
    } else {
      done()
    }
  })
  // Remove data linked to the match >>>> MAYBE FORK A PROCESS FOR THAT
  matchSchema.post('remove', (match, done) => {
    Promise.all([
      match.model('score').find({ match: match._id }),
      match.model('warn').find({ match: match._id }),
      match.model('expulsion').find({ match: match._id }),
      match.model('attendance').find({ match: match._id }),
    ]).then((data) => {
      data[0].forEach((el) => el.remove())
      data[1].forEach((el) => el.remove())
      data[2].forEach((el) => el.remove())
      data[3].forEach((el) => el.remove())
      forkHandlers.forkChildTeamStatsUpdate(match, done)
    })
    .catch((err) => {
      done(err)
    })
  })
} else {
  matchSchema.post('save', (match) => {
    if (match.played) {
      forkHandlers.forkChildTeamStatsUpdate(match)
    }
  })
  matchSchema.post('remove', (match) => {
    forkHandlers.forkChildTeamStatsUpdate(match)
  })
}

module.exports = mongoose.model('match', matchSchema, 'matchs')
