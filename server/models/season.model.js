const mongoose = require('../config/database')

const seasonSchema = mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Season year is required'],
    unique: [true, 'Season year must be unique value'],
  },
  current: { type: Boolean, default: false },
})

/**
 * [setCurrentSeason description]
 * @param season is the season id
 * @return Promise
 */
seasonSchema.statics.setCurrentSeason = function setCurrentSeasonAttribute(season) {
  const Season = this.model('season')
  return Promise.resolve(Season.update({ current: true }, { $set: { current: undefined } }).exec())
  .then(() => {
    return Season.findByIdAndUpdate(season, { current: true }, { new: true }).exec()
  })
  .catch((err) => {
    return Promise.reject(err)
  })
}

/**
 * [cascadeDelete description]
 * @param  season is the season id
 * @return Promise
 */
seasonSchema.statics.cascadeDelete = function cascadeDeleteSeasonData(season) {
  const Round = this.model('round')
  const Day = this.model('day')
  const Match = this.model('match')
  return Promise.all([
    Round.remove({ season }),
    Day.remove({ season }),
    Match.remove({ season }),
  ]).then((results) => {
    const res = []
    results.forEach((result) => {
      res.push(result.result)
    })
    return res
  })
}

module.exports = mongoose.model('season', seasonSchema, 'seasons')
