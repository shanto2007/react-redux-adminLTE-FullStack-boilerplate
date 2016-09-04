const { testenv, getRandomInt, Promise } = global
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Day = require(testenv.serverdir + 'models/day.model')
const Team = require(testenv.serverdir + 'models/team.model')
const chai = require('chai')
const expect = require('expect')

describe.only('Player - Model', () => {
  let seasonId, roundId, dayId, teamAId, teamBId

  before((done) => {
    Promise
      .resolve(Season.create({ year: getRandomInt(3999,9999) }))
      .then((season) => {
        seasonId = season._id
        return Round.create({
          season: season._id,
          label: 'Z',
        })
      })
      .then((round) => {
        roundId = round._id
        return Day.create({
          season: seasonId,
          round: round._id
        })
      })
      .then((day) => {
        dayId = day._id
        return Team.create({
          name: 'TeamForPlayerTest',
          season: seasonId,
          round: roundId,
        })
      })
      .then((team) => {
        teamId = team._id
        done()
      })
      .catch(done)
  })

  it('should')

  /**
   * CLEANUP
   */
  after((done) => {
    Promise.all([
      Season.remove({ _id: seasonId }),
      Round.remove({ _id: roundId }),
      Day.remove({ _id: dayId }),
      Team.remove({ _id: teamId }),
    ]).then(done()).catch(done)
  })
})
