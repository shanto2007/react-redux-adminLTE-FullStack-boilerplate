const mongoose = require('../config/database')

const seasonSchema = mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Season year is required'],
    unique: [true, 'Season year must be unique value'],
  },
  current: { type: Boolean },
})

seasonSchema.static.setCurrentSeason = (seasonId) => {
  // TODO set current and set all the other to false
}

module.exports = mongoose.model('season', seasonSchema, 'seasons')
