const mongoose = require('mongoose')
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
 forkHandlers.playerExpulsionUpdate(expulsion).then(() => {
   done()
 }).catch((err) => {
   throw err
   done()
 })
})
expulsionSchema.post('remove', (expulsion, done) => {
 forkHandlers.playerExpulsionUpdate(expulsion).then(() => {
   done()
 }).catch((err) => {
   throw err
   done()
 })
})


module.exports = mongoose.model('expulsion', expulsionSchema, 'expulsions')
