const { testenv, getRandomInt, Promise } = global
const Round = require(testenv.serverdir + 'models/round.model')
const Season = require(testenv.serverdir + 'models/season.model')
const chai = require('chai')
const expect = require('expect')

describe('Round - Model', () => {
  let seasonId,anotherSeasonId
  before((done) => {
    Promise.all([
      Season.create({ year: getRandomInt(2999, 9999) }),
      Season.create({ year: getRandomInt(2999, 9999) })
    ]).then((seasons) => {
      seasonId = seasons[0]._id
      anotherSeasonId = seasons[1]._id
      done()
    }).catch(done)
  })

  it('should NOT create a round without a season id', (done) => {
    Round.create({}, (err) => {
      expect(err).toExist()
      expect(err.errors.season).toExist()
      done()
    })
  })

  it('should NOT create a round without a label', (done) => {
    Round.create({
      season: seasonId
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.label).toExist()
      done()
    })
  })

  it('should create a round', (done) => {
    Round.create({
      season: seasonId,
      label: 'a ', // << lowercase/space intended
    }, (err, round) => {
      expect(err).toNotExist()
      expect(round.label).toEqual('A') // trimmed and uppercase in model
      done()
    })
  })

  it('should NOT create a round with duplicate label', (done) => {
    Round.create({
      season: seasonId,
      label: 'A'
    }, (err, round) => {
      expect(err).toExist()
      expect(err.toJSON().code).toBe(11000)
      done()
    })
  })

  it('should create a round with duplicate label but for another season, ensure unique compound indexes', (done) => {
    Round.create({
      season: anotherSeasonId,
      label: 'A'
    }, (err, round) => {
      expect(err).toNotExist()
      expect(round.label).toEqual('A') // trimmed and uppercase in model
      done()
    })
  })

  after((done) => {
    const { Promise } = global
    Promise.all([
      Season.remove({ _id: { $in: [seasonId, anotherSeasonId] } }),
      Round.remove({}),
    ]).then((a) => {
      done()
    })
  })
})
