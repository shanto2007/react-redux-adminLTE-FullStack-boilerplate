const mongoose = require('../config/database').mongoose
const forkHandlers = require('../fork/fork.handlers')

const expulsionSchema = mongoose.Schema({
  match: {
    type: mongoose.Schema.ObjectId,
    ref: 'match',
    required: [true, 'Match ID is required'],
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'team',
    required: [true, 'team ID is required'],
  },
  player: {
    type: mongoose.Schema.ObjectId,
    ref: 'player',
    required: [true, 'player ID is required'],
  },
})

expulsionSchema.post('save', (expulsion, done) => {
  return forkHandlers.playerExpulsionUpdate(expulsion).then(() => {
    return done()
  }).catch((err) => {
    return done(err)
  })
})
expulsionSchema.post('remove', (expulsion, done) => {
  return forkHandlers.playerExpulsionUpdate(expulsion).then(() => {
    return done()
  }).catch((err) => {
    return done(err)
  })
})


module.exports = mongoose.model('expulsion', expulsionSchema, 'expulsions')
