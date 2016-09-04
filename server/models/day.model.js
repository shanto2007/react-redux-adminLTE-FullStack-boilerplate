const mongoose = require('mongoose')

const daySchema = mongoose.Schema({
  round: { type: mongoose.Schema.ObjectId, ref: 'round', required: [true, 'No round ID provided'] },
  season: { type: mongoose.Schema.ObjectId, ref: 'season', required: [true, 'No season ID provided'] },
  lastday: { type: Boolean, default: false },
})

/**
 * MODEL METHOD - Update lastday attribute per round
 * @return Promise
 */
daySchema.statics.roundSetLastDay = function roundSetLastDay(dayId) {
  const { Promise } = global
  const Day = this
  return new Promise((resolve, reject) => {
    return Day.findOneAndUpdate({ _id: dayId }, {
      $set: {
        lastday: true,
      },
    }, { new: true }, (updateDayError, updatedDay) => {
      if (updateDayError)
      return Day.update({
        round: updatedDay.round,
        _id: { $ne: updatedDay._id },
      }, {
        $set: {
          lastday: false,
        },
      }, (updateBulkError) => {
        if (updateBulkError) return reject(err)
        return resolve(updatedDay)
      })
    })
  })
}

module.exports = mongoose.model('day', daySchema, 'days')
