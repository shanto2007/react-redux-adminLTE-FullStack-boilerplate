const { testenv, getRandomInt, Promise } = global
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Day = require(testenv.serverdir + 'models/day.model')
const Match = require(testenv.serverdir + 'models/match.model')
const chai = require('chai')
const expect = require('expect')

describe('Match - Model', () => {
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
        return Team.insertMany([
          {
            name: 'TeamA',
            season: seasonId,
            round: roundId,
          },{
            name: 'TeamB',
            season: seasonId,
            round: roundId,
          },
        ])

      })
      .then((teams) => {
        teamAId = teams[0]._id
        teamBId = teams[1]._id
        done()
      })
      .catch(done)
  })


  it('should not create a match without a date', (done) => {
    Match.create({}, (err) => {
      expect(err).toExist()
      expect(err.errors.date).toExist()
      done()
    })
  })

  it('should not create a match without season id', (done) => {
    Match.create({
      date: Date.now(),
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.season).toExist()
      done()
    })
  })

  it('should not create a match without round id', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.round).toExist()
      done()
    })
  })

  it('should not create a match without day id', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
      round: roundId
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.day).toExist()
      done()
    })
  })

  it('should not create a match without a team at home id', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
      round: roundId,
      day: dayId,
      teamAway: teamBId,
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.teamHome).toExist()
      done()
    })
  })

  it('should not create a match without a team away id', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
      round: roundId,
      day: dayId,
      teamHome: teamAId,
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.teamAway).toExist()
      done()
    })
  })

  it('should not create a match if the two team id are equal', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
      round: roundId,
      day: dayId,
      teamHome: teamAId,
      teamAway: teamAId,
    }, (err) => {
      expect(err).toExist()
      expect(err.message).toExist()
      done()
    })
  })

  it('shoud finally create a match :)', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
      round: roundId,
      day: dayId,
      teamHome: teamAId,
      teamAway: teamBId,
    }, (err, match) => {
      expect(err).toNotExist()
      expect(match).toExist()
      done()
    })
  })

  /**
   * CLEANUP
   */
  after((done) => {
    Promise.all([
      Season.remove({ _id: seasonId }),
      Round.remove({ _id: roundId }),
      Day.remove({ _id: dayId }),
      Team.remove({ _id: { $in: [teamAId, teamBId] } }),
      Match.remove({}),
    ]).then(done()).catch(done)
  })
})
