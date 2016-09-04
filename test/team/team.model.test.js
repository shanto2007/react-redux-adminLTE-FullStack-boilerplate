const { testenv, getRandomInt, Promise } = global
var app = require(testenv.app)
var Team = require(testenv.serverdir + 'models/team.model')
var Season = require(testenv.serverdir + 'models/season.model')
var Round = require(testenv.serverdir + 'models/round.model')
var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = require('expect')

describe.only('Team - Model', () => {
  let seasonId, roundId

  before((done) => {
    Season.create({
      year: getRandomInt(3999,9999)
    }).then((season) => {
      Round.create({
        season: season._id,
        label: 'Z',
      }).then((round) => {
        seasonId = season._id
        roundId = round._id
        done()
      }).catch(done)
    }).catch(done)
  })

  it('shoud ', () => {

  })

  after((done) => {
    Promise.all([
      Season.remove({ _id: seasonId }),
      Round.remove({ _id: roundId }),
    ]).then(done()).catch(done)
  })
})
