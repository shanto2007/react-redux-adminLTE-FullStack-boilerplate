const { testenv, Promise } = global
const fs       = require('fs')
const path     = require('path')
const app      = require(testenv.app)
const chai     = require('chai')
const chaiHttp = require('chai-http')
const expect   = require('expect')
const jwt      = require('jsonwebtoken')
const Season   = require(testenv.serverdir + 'models/season.model')
const Round    = require(testenv.serverdir + 'models/round.model')
const Team     = require(testenv.serverdir + 'models/team.model')
const Media     = require(testenv.serverdir + 'models/media.model')

chai.use(chaiHttp)

describe('Team - API', () => {
  let userAuthToken, seasonId, roundId, dayId, teamId, groupPhotoId, avatarId

  before((done) => {
    userAuthToken = jwt.sign({
      username: 'admin',
      admin: 'admin',
    }, process.env.APP_KEY )
    Promise.all([
      Season.create({
        year: 2016,
      }),
      Season.create({
        year: 2017,
      }),
    ]).then((seasons) => {
      seasonId = seasons[0]._id
      anotherSeasonId = seasons[1]._id
      return Promise.resolve(
        Round.create({
          season: seasonId,
          label: 'A'
        })
      )
    })
    .then((round) => {
      roundId = round._id
      done()
    })
    .catch(done)
  })

  describe('Creation', () => {
    it('should NOT create without auth token', (done) => {
      chai.request(app)
      .post('/api/admin/team')
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })

    it('should NOT create without round id', (done) => {
      chai.request(app)
      .post('/api/admin/team')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        const { success, message } = res.body
        expect(res.status).toNotBe(200)
        expect(err).toExist()
        expect(success).toBe(false)
        expect(message).toExist()
        done()
      })
    })

    it('should NOT create without season id', (done) => {
      chai.request(app)
      .post('/api/admin/team')
      .set('Authorization', userAuthToken)
      .send({
        round: roundId,
      })
      .end((err, res) => {
        const { success, message } = res.body
        expect(res.status).toNotBe(200)
        expect(err).toExist()
        expect(success).toBe(false)
        expect(message).toExist()
        done()
      })
    })

    it('should NOT create without a name', (done) => {
      chai.request(app)
      .post('/api/admin/team')
      .set('Authorization', userAuthToken)
      .send({
        round: roundId,
        season: seasonId,
      })
      .end((err, res) => {
        const { success, message } = res.body
        expect(res.status).toNotBe(200)
        expect(err).toExist()
        expect(success).toBe(false)
        expect(message).toExist()
        done()
      })
    })

    it('should NOT create and return error if invalid round id', (done) => {
      chai.request(app)
      .post('/api/admin/team')
      .set('Authorization', userAuthToken)
      .send({
        round: "roundId",
        season: seasonId,
        name: 'TeamA',
      })
      .end((err, res) => {
        const { success, message } = res.body
        expect(res.status).toNotBe(200)
        expect(err).toExist()
        expect(success).toBe(false)
        expect(message).toExist()
        done()
      })
    })

    it('should NOT create and return error if invalid season id', (done) => {
      chai.request(app)
      .post('/api/admin/team')
      .set('Authorization', userAuthToken)
      .send({
        round: roundId,
        season: "seasonId",
        name: 'TeamA',
      })
      .end((err, res) => {
        const { success, message } = res.body
        expect(res.status).toNotBe(200)
        expect(err).toExist()
        expect(success).toBe(false)
        expect(message).toExist()
        done()
      })
    })

    it('should create a team', (done) => {
      chai.request(app)
      .post('/api/admin/team')
      .set('Authorization', userAuthToken)
      .send({
        round: roundId,
        season: seasonId,
        name: 'TeamA',
      })
      .end((err, res) => {
        const { success, team } = res.body
        expect(res.status).toBe(200)
        expect(success).toBe(true)
        expect(team).toExist()
        teamId = team._id
        done()
      })
    })

    it('should NOT create a team with a duplicate name in that season', (done) => {
      chai.request(app)
      .post('/api/admin/team')
      .set('Authorization', userAuthToken)
      .send({
        round: roundId,
        season: seasonId,
        name: 'TeamA',
      })
      .end((err, res) => {
        const { success, message } = res.body
        expect(res.status).toNotBe(200)
        expect(success).toBe(false)
        expect(message).toExist()
        done()
      })
    })

    it('should create a team with the same name in another season', (done) => {
      chai.request(app)
      .post('/api/admin/team')
      .set('Authorization', userAuthToken)
      .send({
        round: roundId,
        season: anotherSeasonId,
        name: 'TeamA',
      })
      .end((err, res) => {
        const { success, team } = res.body
        expect(res.status).toBe(200)
        expect(success).toBe(true)
        expect(team).toExist()
        done()
      })
    })
  }) // CREATION

  describe('Edit', () => {
    before((done) => {
      // create a team to test against name duplication case on edit
      Team.create({
        season: seasonId,
        round: roundId,
        name: 'TeamC'
      }).then(done()).catch(done)
    })
    it('should NOT edit without providing auth token', (done) => {
      chai.request(app)
      .patch(`/api/admin/team/${teamId}`)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })

    it('should NOT edit if not team id provided', (done) => {
      chai.request(app)
      .patch('/api/admin/team/')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })

    it('should NOT edit if new team name not provided', (done) => {
      chai.request(app)
      .patch(`/api/admin/team/${teamId}`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })

    it('should NOT edit and return error if invalid id provided', (done) => {
      chai.request(app)
      .patch(`/api/admin/team/teamId`)
      .set('Authorization', userAuthToken)
      .send({ name: 'TeamB' })
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(500)
        done()
      })
    })

    it('should NOT edit and return 404 if not exists', (done) => {
      chai.request(app)
      .patch(`/api/admin/team/${seasonId}`) // fake it
      .set('Authorization', userAuthToken)
      .send({ name: 'TeamB' })
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body.team).toNotExist()
        done()
      })
    })

    it('should edit the team name passing id by route params', (done) => {
      chai.request(app)
      .patch(`/api/admin/team/${teamId}`)
      .set('Authorization', userAuthToken)
      .send({ name: 'TeamB' })
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.team).toExist()
        done()
      })
    })

    it('should edit the team name passing id by body json', (done) => {
      chai.request(app)
      .patch(`/api/admin/team/${teamId}`)
      .set('Authorization', userAuthToken)
      .send({ name: 'TeamA', id: teamId })
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.team).toExist()
        done()
      })
    })

    it('should NOT edit the team if there is another with the same name', (done) => {
      chai.request(app)
      .patch(`/api/admin/team/${teamId}`)
      .set('Authorization', userAuthToken)
      .send({ name: 'TeamC', id: teamId })
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(500)
        expect(res.body.message).toExist()
        done()
      })
    })

    it('should upload a group photo of the team', (done) => {
      let mediaFile = path.join( __dirname, './media/test.jpeg' )
      chai.request(app)
      .post(`/api/admin/team/${teamId}/photo`)
      .set('Authorization', userAuthToken)
      .attach('teamPhoto', fs.readFileSync(mediaFile), 'test.jpeg')
      .end((err, res) => {
        expect(res.body.team.groupPhoto).toExist()
        groupPhotoId = res.body.team.groupPhoto._id
        done()
      })
    })

    it('should upload a team avatar photo', (done) => {
      let mediaFile = path.join( __dirname, './media/test.jpeg' )
      chai.request(app)
      .post(`/api/admin/team/${teamId}/avatar`)
      .set('Authorization', userAuthToken)
      .attach('teamAvatar', fs.readFileSync(mediaFile), 'test.jpeg')
      .end((err, res) => {
        expect(res.body.team.avatar).toExist()
        avatarId = res.body.team.avatar._id
        done()
      })
    })
  }) // EDIT

  describe('GET - public', () => {
    it('should NOT get without passing an id', (done) => {
      chai.request(app)
      .get(`/api/team/`)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })

    it('should get', (done) => {
      chai.request(app)
      .get(`/api/team/${teamId}`)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.team).toExist()
        done()
      })
    })

    it('should NOT get, return 404 if not found', (done) => {
      chai.request(app)
      .get(`/api/team/${seasonId}`) // fake it
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(404)
        done()
      })
    })

    it('should NOT get, with invalid id', (done) => {
      chai.request(app)
      .get(`/api/team/seasonId`) // fake it
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(500)
        done()
      })
    })
  }) // GET PUBLIC

  describe('GET - admin', () => {
    it('should NOT get without passing auth token', (done) => {
      chai.request(app)
      .get(`/api/admin/team/`)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })

    it('should NOT get without passing an id', (done) => {
      chai.request(app)
      .get(`/api/admin/team/`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })

    it('should get', (done) => {
      chai.request(app)
      .get(`/api/admin/team/${teamId}`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.team).toExist()
        done()
      })
    })

    it('should NOT get, return 404 if not found', (done) => {
      chai.request(app)
      .get(`/api/admin/team/${seasonId}`) // fake it
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(404)
        done()
      })
    })

    it('should NOT get, with invalid id', (done) => {
      chai.request(app)
      .get(`/api/admin/team/seasonId`) // fake it
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(500)
        done()
      })
    })
  }) // GET ADMIN

  describe('INDEX', () => {
    it('should get public index', (done) => {
      chai.request(app)
      .get('/api/teams')
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.teams).toExist()
        done()
      })
    })

    it('should NOT get admin index without authToken', (done) => {
      chai.request(app)
      .get('/api/admin/teams')
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })

    it('should get admin index', (done) => {
      chai.request(app)
      .get('/api/admin/teams')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.teams).toExist()
        done()
      })
    })
  }) // INDEX

  describe('Delete', () => {
    it('should NOT delete without an auth token', (done) => {
      chai.request(app)
      .delete(`/api/admin/team/${teamId}`)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT delete without a team id provided', (done) => {
      chai.request(app)
      .delete(`/api/admin/team/`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT delete if the provided it is not valid', (done) => {
      chai.request(app)
      .delete(`/api/admin/team/teamId`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(500)
        done()
      })
    })
    it('should delete the team', (done) => {
      chai.request(app)
      .delete(`/api/admin/team/${teamId}`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.team).toExist()
        done()
      })
    })
    it('should have deleted the team', (done) => {
      Team.findById(teamId).then((team) => {
        expect(team).toNotExist()
        done()
      }).catch(done)
    })
    it('should NOT delete and return 404 if not exist', (done) => {
      chai.request(app)
      .delete(`/api/admin/team/${teamId}`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body.team).toNotExist()
        done()
      })
    })
    it('should have deleted team medias', (done) => {
      Media.find({ _id: { $in: [avatarId, groupPhotoId] } }).then((medias) => {
        expect(medias.length).toBe(0)
        done()
      }).catch(done)
    })
  }) // DELETE

  after((done) => {
    Promise.all([
      Season.remove({}),
      Round.remove({}),
      Team.remove({}),
      Media.remove({}),
    ]).then(done()).catch(done)
  })

})
