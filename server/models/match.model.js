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

matchSchema.post('save', (match, done) => {
  if (!match.played) done()
  forkHandlers.teamStatsUpdate(match).then(() => {
    done()
  })
  .catch((err) => {
    throw err
    done()
  })
})

matchSchema.post('remove', (match, done) => {
  console.time('removeData')
  forkHandlers
  .cascadeRemoveMatchData(match)
  .then((res) => {
    console.timeEnd('removeData')
    return done()
  })
  .catch((err) => {
    throw err
    return done()
  })
})

matchSchema.post('remove', (match, done) => {
  console.time('update')
  forkHandlers.teamStatsUpdate(match)
  .then((res) => {
    console.timeEnd('update')
    return done()
  })
  .catch((err) => {
    throw err
    return done()
  })
})


module.exports = mongoose.model('match', matchSchema, 'matchs')
