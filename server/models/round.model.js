const { Promise } = global
const mongoose = require('../config/database')

const roundSchema = mongoose.Schema({
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'season',
    required: [true, 'Round\'s season id not provided!'],
  },
  media: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'media',
  },
  host: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
    trim: true,
    uppercase: true,
    required: [true, 'Round label not provided'],
  },
})

roundSchema.index({ label: 1, season: 1 }, { unique: true })

// TODO: CASCADE REMOVE >> Days, Teams, Matches
/**
 * Round Cascade remove
 * ORDER:
 *  - Remove Day which cascade:
 *    - Matches which cascade
 *      - scores, attendance, warns, expulsions
 *  - Remove Teams which cascade:
 *    - Players
 */
roundSchema.methods.cascadeRemove = function roundCascadeRemoveData() {
  const round = this
  const Team = this.model('team')
  const Day = this.model('day')
  return Day.find({ round: round._id }).exec()
  .then((days) => {
    const promises = []
    days.forEach((day) => {
      return promises.push(day.cascadeRemove())
    })
    return Promise.all(promises)
  })
  .then(() => {
    return Team.find({ round: round._id }).exec()
  })
  .then((teams) => {
    const promises = []
    teams.forEach((team) => {
      return promises.push(team.remove())
    })
    return Promise.all(promises)
  })
  .then(() => {
    return round.remove()
  })
  .catch((err) => {
    return Promise.reject(err)
  })
}

module.exports = mongoose.model('round', roundSchema, 'rounds')
