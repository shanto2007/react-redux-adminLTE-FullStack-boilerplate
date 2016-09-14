const mongoose = require('../config/database')

const seasonSchema = mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Season year is required'],
    unique: [true, 'Season year must be unique value'],
  },
  current: { type: Boolean },
})

module.exports = mongoose.model('season', seasonSchema, 'seasons')
