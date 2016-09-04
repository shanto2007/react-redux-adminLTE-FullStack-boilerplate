const { testenv, getRandomInt, Promise } = global
var Team = require(testenv.serverdir + 'models/team.model')
var Season = require(testenv.serverdir + 'models/season.model')
var Round = require(testenv.serverdir + 'models/round.model')
var Media = require(testenv.serverdir + 'models/media.model')
var chai = require('chai')
var expect = require('expect')

describe('Team - Model', () => {
  let seasonId, roundId

  before((done) => {
    Promise.resolve(Season.create({ year: getRandomInt(3999,9999) }))
    .then((season) => {
      seasonId = season._id
      return Round.create({
        season: season._id,
        label: 'Z',
      })
    })
    .then((round) => {
      roundId = round._id
      done()
    })
    .catch(done)
  })

  it('shoud not create a team without a season id', (done) => {
    Team.create({}, (err) => {
      expect(err).toExist()
      expect(err.errors.season).toExist()
      done()
    })
  })

  it('shoud not create a team without a round id', (done) => {
    Team.create({
      season: seasonId
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.round).toExist()
      done()
    })
  })

  it('shoud not create a team without a name', (done) => {
    Team.create({
      season: seasonId
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.name).toExist()
      done()
    })
  })

  it('shoud create a team', (done) => {
    Team.create({
      season: seasonId,
      round: roundId,
      name: 'Team Name Test  ', // space intended for trim to test
    }, (err, team) => {
      expect(err).toNotExist()
      expect(team).toExist()
      expect(team.name).toBe('Team Name Test')
      done()
    })
  })

  it('shoud create a team with duplicate name', (done) => {
    Team.create({
      season: seasonId,
      round: roundId,
      name: 'Team Name Test  ', // space intended for trim to test
    }, (err, team) => {
      expect(err).toExist()
      expect(err.toJSON()).toExist()
      expect(err.toJSON().code).toBe(11000)
      done()
    })
  })

  after((done) => {
    Promise.all([
      Season.remove({ _id: seasonId }),
      Round.remove({ _id: roundId }),
      Team.remove({}),
    ]).then(done()).catch(done)
  })
})
