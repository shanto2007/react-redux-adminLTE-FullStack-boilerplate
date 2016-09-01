const mongoose = require('mongoose')

const seasonSchema = mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  current: { type: Boolean },
})

module.exports = mongoose.model('season', seasonSchema, 'seasons')
