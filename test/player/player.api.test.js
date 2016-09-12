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
const Player     = require(testenv.serverdir + 'models/player.model')

chai.use(chaiHttp)

describe('Player - API', () => {
  let userAuthToken, seasonId, anotherSeasonId, roundId, teamId, playerId, mediaId

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
      return Team.create({
        season: seasonId,
        round: roundId,
        name: 'TeamA',
      })
    })
    .then((team) => {
      teamId = team._id
      done()
    })
    .catch(done)
  })

  describe('Create', () => {
    it('should NOT create without auth token', (done) => {
      chai.request(app)
      .post('/api/admin/player')
      .end((err, res) => {
        expect(err).toExist()
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT create without season id', (done) => {
      chai.request(app)
      .post('/api/admin/player')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT create without round id', (done) => {
      chai.request(app)
      .post('/api/admin/player')
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
      })
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT create without team id', (done) => {
      chai.request(app)
      .post('/api/admin/player')
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        round: roundId,
      })
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT create without name id', (done) => {
      chai.request(app)
      .post('/api/admin/player')
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        round: roundId,
        team: teamId,
      })
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should NOT create without surname id', (done) => {
      chai.request(app)
      .post('/api/admin/player')
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        round: roundId,
        team: teamId,
        name: 'MyName',
      })
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should create', (done) => {
      chai.request(app)
      .post('/api/admin/player')
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        round: roundId,
        team: teamId,
        name: 'MyName',
        surname: 'MySurName',
      })
      .end((err, res) => {
        expect(res.body.success).toBe(true)
        expect(res.body.player).toExist()
        expect(res.body.player.fullname).toEqual('MyName MySurName')
        playerId = res.body.player._id
        done()
      })
    })
    it('should have added the player to the corresponding team array of reference', (done) => {
      Team.findById(teamId).then((team) => {
        expect(team.players.length).toBe(1)
        expect(team.players[0].equals(playerId)).toBe(true)
        done()
      }).catch(done)
    })
  }) // Create

  describe('Edit', () => {
    it('should NOT edit player without authToken', (done) => {
      chai.request(app)
      .patch(`/api/admin/player/${playerId}`)
      .end((err, res) => {
        expect(err).toExist()
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT edit player without player id', (done) => {
      chai.request(app)
      .patch(`/api/admin/player/`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should NOT edit player without the surname or name provided', (done) => {
      chai.request(app)
      .patch(`/api/admin/player/${playerId}`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should return 404 if not exist', (done) => {
      chai.request(app)
      .patch(`/api/admin/player/${teamId}`) // fakeid
      .set('Authorization', userAuthToken)
      .send({
        name: 'MyNewName'
      })
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should return error if invalid id', (done) => {
      chai.request(app)
      .patch(`/api/admin/player/teamId`) // fakeid
      .set('Authorization', userAuthToken)
      .send({
        name: 'MyNewName'
      })
      .end((err, res) => {
        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should edit player name', (done) => {
      chai.request(app)
      .patch(`/api/admin/player/${playerId}`)
      .set('Authorization', userAuthToken)
      .send({
        name: 'MyNewName'
      })
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.player).toExist()
        expect(res.body.player.name).toEqual('MyNewName')
        done()
      })
    })
    it('should edit player surnname', (done) => {
      chai.request(app)
      .patch(`/api/admin/player/${playerId}`)
      .set('Authorization', userAuthToken)
      .send({
        surname: 'MyNewSurName'
      })
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.player).toExist()
        expect(res.body.player.surname).toEqual('MyNewSurName')
        done()
      })
    })
  }) // Edit

  describe('Upload Avatar', () => {
    it('should NOT upload player avatar without authToken', (done) => {
      chai.request(app)
      .post(`/api/admin/player/${playerId}/avatar`)
      .end((err, res) => {
        expect(err).toExist()
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT upload player avatar without player id', (done) => {
      chai.request(app)
      .post(`/api/admin/player/`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should NOT upload player avatar without an attached file', (done) => {
      chai.request(app)
      .post(`/api/admin/player/${playerId}/avatar`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should NOT upload player avatar without an attached file', (done) => {
      let mediaFile = path.join( __dirname, './media/test.jpeg' )
      chai.request(app)
      .post(`/api/admin/player/${playerId}/avatar`)
      .set('Authorization', userAuthToken)
      .attach('playerAvatar', fs.readFileSync(mediaFile), 'test.jpeg')
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.player.avatar.path).toExist()
        mediaId = res.body.player.avatar._id
        done()
      })
    })
  })

  describe('Delete', () => {
    it('should NOT delete without auth token', (done) => {
      chai.request(app)
      .delete(`/api/admin/player/${playerId}`)
      .end((err, res) => {
        expect(err).toExist()
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT delete without player id', (done) => {
      chai.request(app)
      .delete(`/api/admin/player/`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(err).toExist()
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT delete, return 404 if not found', (done) => {
      chai.request(app)
      .delete(`/api/admin/player/${teamId}`) // fakeid
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should NOT delete if invalid id', (done) => {
      chai.request(app)
      .delete(`/api/admin/player/teamId`) // fakeid
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should delete', (done) => {
      chai.request(app)
      .delete(`/api/admin/player/${playerId}`) // fakeid
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        done()
      })
    })
    it('should have removed the player from the team array of reference', (done) => {
      Team.findById(teamId).then((team) => {
        expect(team.players.length).toBe(0)
        done()
      }).catch(done)
    })
    it('should have removed the player media', (done) => {
      Media.findById(mediaId).then((media) => {
        expect(media).toNotExist()
        done()
      }).catch(done)
    })
  }) // Delete

  after((done) => {
    Promise.all([
      Season.remove({}),
      Round.remove({}),
      Team.remove({}),
      Player.remove({}),
      Media.remove({}),
    ]).then(done()).catch(done)
  })
})
