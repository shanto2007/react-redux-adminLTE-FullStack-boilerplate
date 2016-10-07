const { Promise } = global
const mongoose = require('../config/database')

const daySchema = mongoose.Schema({
  round: { type: mongoose.Schema.ObjectId, ref: 'round', required: [true, 'No round ID provided'] },
  season: { type: mongoose.Schema.ObjectId, ref: 'season', required: [true, 'No season ID provided'] },
  lastday: { type: Boolean, default: false },
})

/**
 * MODEL METHOD - Update lastday attribute per round
 * @return Promise
 */
daySchema.statics.setLastDay = function roundSetLastDay(dayId) {
  const { Promise } = global
  const Day = this
  return new Promise((resolve, reject) => {
    return Day.findOneAndUpdate({ _id: dayId }, {
      $set: {
        lastday: true,
      },
    }, { new: true }, (updateDayError, updatedDay) => {
      if (updateDayError) return reject(updateDayError)
      return Day.update({
        round: updatedDay.round,
        _id: { $ne: updatedDay._id },
      }, {
        $set: {
          lastday: false,
        },
      }, (updateBulkError) => {
        if (updateBulkError) return reject(updateBulkError)
        return resolve(updatedDay)
      })
    })
  })
}

daySchema.methods.addInfo = function addDayInfo() {
  let day = this
  const match = this.model('match')
  return Promise.all([
    match.count({ day: day._id, played: true }).exec(),
    match.count({ day: day._id, played: false }).exec(),
  ])
  .then((res) => {
    day = day.toObject()
    day.playedMatches = res[0]
    day.notPlayedMatches = res[1]
    return Promise.resolve(day)
  })
}

module.exports = mongoose.model('day', daySchema, 'days')
