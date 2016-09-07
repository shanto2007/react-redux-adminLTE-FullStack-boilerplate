const { testenv, getRandomInt, Promise } = global
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Media = require(testenv.serverdir + 'models/media.model')
const chai = require('chai')
const expect = require('expect')

describe('Team - Model', () => {
  let seasonId, roundId, anotherSeasonId

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
      return Season.create({ year: getRandomInt(3999,9999) })
    }).then((season) => {
      anotherSeasonId = season._id
      done()
    })
    .catch(done)
  })

  it('shoud NOT create a team without a season id', (done) => {
    Team.create({}, (err) => {
      expect(err).toExist()
      expect(err.errors.season).toExist()
      done()
    })
  })

  it('shoud NOT create a team without a round id', (done) => {
    Team.create({
      season: seasonId
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.round).toExist()
      done()
    })
  })

  it('shoud NOT create a team without a name', (done) => {
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

  it('shoud NOT create a team with duplicate name', (done) => {
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

  it('shoud create a team with the same name but within another season', (done) => {
    Team.create({
      season: anotherSeasonId,
      round: roundId,
      name: 'Team Name Test  ', // space intended for trim to test
    }, (err, team) => {
      expect(err).toNotExist()
      expect(team).toExist()
      expect(team.name).toBe('Team Name Test')
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
