const mongoose = require('mongoose')
const forkHandlers = require('../fork/fork.handlers')

const warnSchema = mongoose.Schema({
  match: {
    type: mongoose.Schema.ObjectId,
    ref: 'match',
    required: [true, 'Match ID is required'],
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
    required: [true, 'Team ID is required'],
  },
  player: {
    type: mongoose.Schema.ObjectId,
    ref: 'player',
    required: [true, 'Player ID is required'],
  },
})

warnSchema.post('save', (warn, done) => {
  forkHandlers.playerWarnUpdate(warn).then(() => {
    done()
  }).catch((err) => {
    done(err)
  })
})
warnSchema.post('remove', (warn, done) => {
  return forkHandlers.playerWarnUpdate(warn).then(() => {
    return done()
  }).catch((err) => {
    return done(err)
  })
})


module.exports = mongoose.model('warn', warnSchema, 'warns')
