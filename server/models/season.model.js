const mongoose = require('../config/database')

const seasonSchema = mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Season year is required'],
    unique: [true, 'Season year must be unique value'],
  },
  current: { type: Boolean, default: false },
})

seasonSchema.statics.setCurrentSeason = function setCurrentSeasonAttribute(seasonId) {
  const Season = this.model('season')
  return Promise.resolve(Season.update({ current: true }, { $set: { current: undefined } }).exec())
  .then(() => {
    return Season.findByIdAndUpdate(seasonId, { current: true }, { new: true }).exec()
  })
  .catch((err) => {
    return Promise.reject(err)
  })
}

module.exports = mongoose.model('season', seasonSchema, 'seasons')
