const mongoose = require('mongoose')

const seasonSchema = mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Season year is required'],
    unique: [true, 'Season year must be unique value'],
  },
  current: { type: Boolean },
})

seasonSchema.pre('save', function seasonPreSave(next, done) {
  const season = this
  if (season.current) {
    season.model('season').count({ current: true }).then((err, count) => {
      if (err) return err
      next(new Error("ASDASD")) // >> NON PASSA ALLA CALLBACK NON SO PERCHE PORCO DIO
    })
  }
  next()
})

module.exports = mongoose.model('season', seasonSchema, 'seasons')
