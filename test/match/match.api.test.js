const { testenv, getRandomInt, Promise } = global
const app        = require(testenv.app)
const jwt        = require('jsonwebtoken')
const chaiHttp   = require('chai-http')
const expect     = require('expect')
const Team       = require(testenv.serverdir + 'models/team.model')
const Season     = require(testenv.serverdir + 'models/season.model')
const Round      = require(testenv.serverdir + 'models/round.model')
const Day        = require(testenv.serverdir + 'models/day.model')
const Match      = require(testenv.serverdir + 'models/match.model')
const Player     = require(testenv.serverdir + 'models/player.model')
const Score      = require(testenv.serverdir + 'models/score.model')
const Attendance = require(testenv.serverdir + 'models/attendance.model')
const Warn       = require(testenv.serverdir + 'models/warn.model')
const Expulsion  = require(testenv.serverdir + 'models/expulsion.model')
const chai       = require('chai')

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
  describe('Edit - set date', () => {
    it('should NOT set date without auth token', (done) => {
      chai.request(app)
      .patch(`/api/admin/match/${matchId}/date`)
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT set date without match id', (done) => {
      chai.request(app)
      .patch(`/api/admin/match/`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(404)
        done()
      })
    })
    it('should NOT set date without match date', (done) => {
      chai.request(app)
      .patch(`/api/admin/match/${matchId}/date`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should set date', (done) => {
      chai.request(app)
      .patch(`/api/admin/match/${matchId}/date`)
      .set('Authorization', userAuthToken)
      .send({
        date: Date.now(),
      })
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.match.date).toExist()
        done()
      })
    })
  })

  /**
   * EDIT
   */
  describe('Edit', () => {
    let matchData
    before((done) => {
      /**
      * Setup request body
      */
      Promise.all([
        Player.findById(playerAId),
        Player.findById(playerBId),
      ])
      .then((players) => {
        matchData = [ players[0].toJSON(), players[1].toJSON() ]
        /**
         * Setup for:
         *  TeamA 3 - 1 TeamB
         *  playerA : 1 warn | 0 exp | 1 attendance | 3 scores
         *  playerB : 0 warn | 1 exp | 1 attendance | 1 scores
         */
        matchData[0].warned = true
        matchData[0].attended = true
        matchData[0].scored = 3

        matchData[1].expelled = true
        matchData[1].attended = true
        matchData[1].scored = 1
        done()
      }).catch(done)
    })
    it('should NOT edit without auth token' ,(done) => {
      chai.request(app)
      .patch(`/api/admin/match/${matchId}`)
      .end((err, res) => {
        expect(err).toExist()
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT edit with invalid match id', (done) => {
      chai.request(app)
      .patch(`/api/admin/match/matchId`)
      .set('Authorization', userAuthToken)
      .send([{}])
      .end((err, res) => {
        expect(res.status).toBe(500)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT edit return 404 if match dont exist', (done) => {
      chai.request(app)
      .patch(`/api/admin/match/${seasonId}`)
      .set('Authorization', userAuthToken)
      .send([{}])
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT edit without match data', (done) => {
      chai.request(app)
      .patch(`/api/admin/match/${matchId}`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should should edit a match', function(done) {
      this.timeout(10000)
      chai.request(app)
      .patch(`/api/admin/match/${matchId}`)
      .set('Authorization', userAuthToken)
      .send(matchData)
      .end((err, res) => {
        const { body } = res
        expect(res.status).toBe(200)
        expect(body.match.winner).toEqual(teamAId)
        expect(body.match.loser).toEqual(teamBId)
        expect(body.match.teamHomeScores).toBe(3)
        expect(body.match.teamAwayScores).toBe(1)
        done()
      })
    })
  })

  describe('Check fork child updates', () => {
    it('should have updated team A stats', (done) => {
      return Team.findById(teamAId).then((team) => {
        expect(team).toExist()
        expect(team.wins).toEqual(1)
        expect(team.losts).toEqual(0)
        expect(team.draws).toEqual(0)
        expect(team.goalTaken).toEqual(1)
        expect(team.goalScored).toEqual(3)
        done()
      }).catch(done)
    })
    it('should have updated team B stats', (done) => {
      return Team.findById(teamBId).then((team) => {
        expect(team).toExist()
        expect(team.wins).toEqual(0)
        expect(team.losts).toEqual(1)
        expect(team.draws).toEqual(0)
        expect(team.goalTaken).toEqual(3)
        expect(team.goalScored).toEqual(1)
        done()
      }).catch(done)
    })
    it('should have updated player A stats', (done) => {
      return Player.findById(playerAId)
      .then((player) => {
        expect(player).toExist()
        expect(player.goals).toEqual(3)
        expect(player.warns).toEqual(1)
        expect(player.expulsions).toEqual(0)
        expect(player.attendance).toEqual(1)
        done()
      })
    })
    it('should have updated player B stats', (done) => {
      return Player.findById(playerBId)
      .then((player) => {
        expect(player).toExist()
        expect(player.goals).toEqual(1)
        expect(player.warns).toEqual(0)
        expect(player.expulsions).toEqual(1)
        expect(player.attendance).toEqual(1)
        done()
      })
    })
  })

  /**
   * RESET A MATCH
   */
  describe('Reset match data', () => {
    it('should NOT reset without auth token', (done) => {
      chai.request(app)
      .patch(`/api/admin/match/${matchId}/reset`)
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should RETURN 404 if matchId dont match any', (done) => {
      chai.request(app)
      .patch(`/api/admin/match/${seasonId}/reset`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should reset', (done) => {
      chai.request(app)
      .patch(`/api/admin/match/${matchId}/reset`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.match).toExist()
        console.log(res.body)
        done()
      })
    })
  })

  /**
   * SHOULD HAVE CASCADE UPDATED THINGS
   */
  describe('Check fork child updates', () => {
    before((done) => {
      // It Should wait for forked to do their jobs
      setTimeout(() => {
        console.log('-- wait forked process to finish to test --')
        done()
      },5000)
    })
    it('should have updated player A stats', function(done) {
      return Player.findById(playerAId)
      .then((player) => {
        expect(player).toExist()
        expect(player.attendance).toBe(0)
        expect(player.goals).toBe(0)
        expect(player.warns).toBe(0)
        expect(player.expulsions).toBe(0)
        done()
      })
    })
    it('should have updated player B stats', function(done) {
      this.timeout(10000)
      return Player.findById(playerBId)
      .then((player) => {
        expect(player).toExist()
        expect(player.attendance).toBe(0)
        expect(player.goals).toBe(0)
        expect(player.warns).toBe(0)
        expect(player.expulsions).toBe(0)
        done()
      })
    })
    // BECAUSE IT THE CHILD USE WINNER AND LOSER ID TO GENERATE STATS IT WONT WORK
    // NEED TO BE REWRITED.
    // it('should have updated player A stats', function(done) {
    //   this.timeout(10000)
    //   return Team.findById(teamAId)
    //   .then((team) => {
    //     expect(team).toExist()
    //     console.log(team)
    //     done()
    //   })
    // })
  })

  /**
   * Delete
   */
  describe('Delete', () => {

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
      Score.remove({}),
      Attendance.remove({}),
      Warn.remove({}),
      Expulsion.remove({}),
    ]).then(done()).catch(done)
  })
})
