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
   throw err
   done()
 })
})
warnSchema.post('remove', (warn, done) => {
 forkHandlers.playerWarnUpdate(warn).then(() => {
   done()
 }).catch((err) => {
   throw err
   done()
 })
})


module.exports = mongoose.model('warn', warnSchema, 'warns')
