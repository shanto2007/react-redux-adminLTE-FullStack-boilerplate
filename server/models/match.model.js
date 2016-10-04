const mongoose = require('../config/database')
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
  teamHomeScores: {
    type: Number,
    default: 0,
  },
  teamAwayScores: {
    type: Number,
    default: 0,
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

matchSchema.index({ teamHome: 1, teamAway: 1, day: 1 }, { unique: [true, 'This match already exist in that day'] })

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
  if (this.isModified('played') && this.isModified('winner') && this.played) {
    match.loser = match.winner.equals(match.teamHome) ? match.teamAway : match.teamHome
  }
  next()
})

matchSchema.post('save', (match, done) => {
  if (match.played) {
    return forkHandlers.teamStatsUpdate(match).then(() => {
      return done()
    })
    .catch((err) => {
      return done(err)
    })
  }
  return done()
})

matchSchema.post('remove', (match, done) => {
  return forkHandlers.teamStatsUpdate(match)
  .then(() => {
    return done()
  })
  .catch((err) => {
    console.error('teamStatsUpdate', err);
    return done(err)
  })
})

matchSchema.methods.cascadeRemove = function cascadeRemove() {
  const { Promise } = global
  const Score = this.model('score')
  const Warn = this.model('warn')
  const Expulsion = this.model('expulsion')
  const Attendance = this.model('attendance')
  const match = this
  return Promise.all([
    Score.find({ match: match._id }),
    Warn.find({ match: match._id }),
    Expulsion.find({ match: match._id }),
    Attendance.find({ match: match._id }),
  ]).then((data) => {
    const promises = []
    data[0].forEach((score) => promises.push(score.remove()))
    data[1].forEach((warn) => promises.push(warn.remove()))
    data[2].forEach((expulsion) => promises.push(expulsion.remove()))
    data[3].forEach((attendance) => promises.push(attendance.remove()))
    return Promise.all(promises)
  })
  .then(() => {
    return Promise.resolve(match)
  })
}

matchSchema.methods.reset = function reset() {
  return this.cascadeRemove()
  .then((match) => {
    match.played = false
    match.winner = undefined
    match.loser = undefined
    match.teamHomeScores = undefined
    match.teamAwayScores = undefined
    return match.save()
  })
  .then((match) => {
    return forkHandlers.teamStatsUpdate(match).then(() => {
      return Promise.resolve(match)
    })
  })
}

module.exports = mongoose.model('match', matchSchema, 'matchs')
