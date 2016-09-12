const { testenv, getRandomInt, Promise } = global
const chaiHttp = require('chai-http')
const expect = require('expect')
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Day = require(testenv.serverdir + 'models/day.model')
const Match = require(testenv.serverdir + 'models/match.model')
const Score = require(testenv.serverdir + 'models/score.model')
const Player = require(testenv.serverdir + 'models/player.model')
const chai = require('chai')

describe.only('Match - API', () => {
  before((done) => {
    Promise.resolve(Season.create({
      year: getRandomInt(1, 9999)
    })).then((season) => {
      console.log(season)
      done()
    }).catch(done)
  })

  it('should')

  /**
   * CLEANUP
   */
  after((done) => {
    Promise.all([
      Season.remove({}),
    ]).then(done()).catch(done)
  })
})
