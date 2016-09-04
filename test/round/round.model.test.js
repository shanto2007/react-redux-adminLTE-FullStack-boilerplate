const { testenv, getRandomInt } = global
var app = require(testenv.app)
var Round = require(testenv.serverdir + 'models/round.model')
var Season = require(testenv.serverdir + 'models/season.model')
var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = require('expect')

describe('Round - Model', () => {
  let seasonId
  before((done) => {
    Season.create({
      year: getRandomInt(2999, 9999)
    }, (err, res) => {
      if (err) throw err
      seasonId = res._id
      done()
    })
  })

  it('shoud not create a round without a season id', (done) => {
    Round.create({}, (err) => {
      expect(err).toExist()
      expect(err.errors.season).toExist()
      done()
    })
  })

  it('shoud not create a round without a label', (done) => {
    Round.create({
      season: seasonId
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.label).toExist()
      done()
    })
  })

  it('shoud create a round', (done) => {
    Round.create({
      season: seasonId,
      label: 'a ', // << lowercase/space intended
    }, (err, round) => {
      expect(err).toNotExist()
      expect(round.label).toEqual('A') // trimmed and uppercase in model
      done()
    })
  })

  it('shoud not create a round with duplicate label', (done) => {
    Round.create({
      season: seasonId,
      label: 'A'
    }, (err, round) => {
      expect(err).toExist()
      expect(err.toJSON().code).toBe(11000)
      done()
    })
  })

  after((done) => {
    const { Promise } = global
    Promise.all([
      Season.remove({ _id: seasonId }),
      Round.remove({}),
    ]).then((a) => {
      done()
    })
  })
})
