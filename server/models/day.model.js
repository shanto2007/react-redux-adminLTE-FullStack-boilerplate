const mongoose = require('mongoose')

const daySchema = mongoose.Schema({
  round: { type: mongoose.Schema.ObjectId, ref: 'round', required: [true, 'No round ID provided'] },
  season: { type: mongoose.Schema.ObjectId, ref: 'season', required: [true, 'No season ID provided'] },
  lastday: { type: Boolean, default: false },
})

/**
 * Update lastday attribute per round
 * @return Promise
 */
daySchema.statics.roundUpdateLastDay = function roundUpdateLastDay(dayId, roundId) {
  const { Promise } = global
  const Day = this
  return new Promise((resolve, reject) => {
    return Day.update({ round: roundId }, { $set: { lastday: false } }, (err) => {
      if (err) return reject(err)
      return Day.findOneAndUpdate({ _id: dayId }, { $set: { lastday: true } }, { new: true }, (err, updated) => {
        if (err) return reject(err)
        return resolve({
          success: true,
          updated,
        })
      })
    })
  })
}

module.exports = mongoose.model('day', daySchema, 'days')
