const { testenv, getRandomInt, Promise } = global
const app      = require(testenv.app)
const jwt      = require('jsonwebtoken')
const chaiHttp = require('chai-http')
const expect   = require('expect')
const Team     = require(testenv.serverdir + 'models/team.model')
const Season   = require(testenv.serverdir + 'models/season.model')
const Round    = require(testenv.serverdir + 'models/round.model')
const Day      = require(testenv.serverdir + 'models/day.model')
const Match    = require(testenv.serverdir + 'models/match.model')
const Score    = require(testenv.serverdir + 'models/score.model')
const Player   = require(testenv.serverdir + 'models/player.model')
const chai     = require('chai')

describe.only('Match - API', () => {
  let userAuthToken,
      seasonId,
      roundId,
      dayId,
      teamAId,
      teamBId,
      playerAId,
      playerBId,
      matchId

  before((done) => {
    userAuthToken = jwt.sign({
      username: 'admin',
      admin: 'admin',
    }, process.env.APP_KEY )

    return Promise.resolve(Season.create({
      year: getRandomInt(1, 9999)
    })).then((season) => {
      seasonId = season._id
      return Round.create({
        season: season._id,
        label: 'A'
      })
    })
    .then((round) => {
      roundId = round._id
      return Day.create({
        season: seasonId,
        round: roundId,
      })

    })
    .then((day) => {
      dayId = day._id
      // create teams
      let TeamA = {
        round: roundId,
        season: seasonId,
        name: 'TeamA',
      }
      let TeamB = {
        round: roundId,
        season: seasonId,
        name: 'TeamB',
      }
      return Promise.all([
        Team.create(TeamA),
        Team.create(TeamB),
      ])
    })
    .then((teams) => {
      teamAId = teams[0]._id
      teamBId = teams[1]._id
      // create players
      let PlayerA = {
        round: roundId,
        season: seasonId,
        team: teamAId,
        name: 'PlayerA',
        surname: 'PlayerASurname',
      }
      let PlayerB = {
        round: roundId,
        season: seasonId,
        team: teamBId,
        name: 'PlayerB',
        surname: 'PlayerBSurname',
      }
      return Promise.all([
        Player.create(PlayerA),
        Player.create(PlayerB),
      ])
    })
    .then((players) => {
      playerAId = players[0]._id
      playerBId = players[1]._id
      done()
    })
    .catch((err) => {
      console.log(err)
      done()
    })
  })

 /**
  * Create
  */
  describe('Create', () => {
    it('should NOT create without auth token', (done) => {
      chai.request(app)
      .post(`/api/admin/match`)
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT create without season id', (done) => {
      chai.request(app)
      .post(`/api/admin/match`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT create without round id', (done) => {
      chai.request(app)
      .post(`/api/admin/match`)
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
      })
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT create without day id', (done) => {
      chai.request(app)
      .post(`/api/admin/match`)
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        day: dayId,
      })
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT create without teamHome id', (done) => {
      chai.request(app)
      .post(`/api/admin/match`)
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        day: dayId,
        round: roundId,
      })
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT create without teamAway id', (done) => {
      chai.request(app)
      .post(`/api/admin/match`)
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        day: dayId,
        round: roundId,
        teamHome: teamAId,
      })
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT create without date', (done) => {
      chai.request(app)
      .post(`/api/admin/match`)
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        day: dayId,
        round: roundId,
        teamHome: teamAId,
        teamAway: teamBId,
      })
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should create', (done) => {
      chai.request(app)
      .post(`/api/admin/match`)
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        day: dayId,
        round: roundId,
        teamHome: teamAId,
        teamAway: teamBId,
        date: Date.now(),
      })
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.match).toExist()
        matchId = res.body.match._id
        done()
      })
    })
    it('should NOT create a duplicate in that day', (done) => {
      chai.request(app)
      .post(`/api/admin/match`)
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        day: dayId,
        round: roundId,
        teamHome: teamAId,
        teamAway: teamBId,
        date: Date.now(),
      })
      .end((err, res) => {
        expect(res.status).toBe(500)
        expect(res.body.message).toExist()
        done()
      })
    })
  })

  /**
   * Edit
   */
  describe('Edit', () => {
    it('should')
  })

  /**
   * Delete
   */
  describe('Delete', () => {
    it('should')
  })

  /**
   * CLEANUP
   */
  after((done) => {
    Promise.all([
      Season.remove({}),
      Round.remove({}),
      Day.remove({}),
      Team.remove({}),
      Player.remove({}),
    ]).then(done()).catch(done)
  })
})
