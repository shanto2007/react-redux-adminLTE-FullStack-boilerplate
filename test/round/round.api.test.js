const { testenv, Promise } = global
const path     = require('path')
const fs       = require('fs')
const app      = require(testenv.app)
const chai     = require('chai')
const chaiHttp = require('chai-http')
const expect   = require('expect')
const Season   = require(testenv.serverdir + 'models/season.model')
const Round    = require(testenv.serverdir + 'models/round.model')
const jwt      = require('jsonwebtoken')

chai.use(chaiHttp)

describe('Round - API', () => {
  let roundToEditId, userAuthToken, seasonId, mediaId

  before((done) => {
    userAuthToken = jwt.sign({
      username: 'admin',
      admin: true,
    }, process.env.APP_KEY )

    Promise.resolve(Season.create({
      year: 2016,
    })).then((season) => {
      seasonId = season._id
      done()
    }).catch(done)
  })

  describe('Creation', () => {
    /**
    *  CREATION
    *  fields:
    *   required: season(id), label(string)
    *   unique: label
    */
    it('should not create without auth token', (done) => {
      return chai.request(app)
      .post('/api/admin/round')
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should not create without season (id) attribute', (done) => {
      return chai.request(app)
      .post('/api/admin/round')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        done()
      })
    })
    it('should not create without label attribute', (done) => {
      return chai.request(app)
      .post('/api/admin/round')
      .set('Authorization', userAuthToken)
      .send({
        season: '13579a5s4d4as89d7a',
      })
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        done()
      })
    })
    it('should create a round', (done) => {
      return chai.request(app)
      .post('/api/admin/round')
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        label: 'A',
      })
      .end((err, res) => {
        let { round } = res.body
        expect(res).toExist()
        expect(res.status).toBe(200)
        expect(round).toExist()
        done()
      })
    })
    it('should not create a round with duplicate [label] attribute', (done) => {
      return chai.request(app)
      .post('/api/admin/round')
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        label: 'A',
      })
      .end((err, res) => {
        let { round } = res.body
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should create a round with another [label] attribute', (done) => {
      return chai.request(app)
      .post('/api/admin/round')
      .set('Authorization', userAuthToken)
      .send({
        season: seasonId,
        label: 'B',
      })
      .end((err, res) => {
        let { round } = res.body
        roundToEditId = round._id
        expect(res).toExist()
        expect(res.status).toBe(200)
        expect(round).toExist()
        done()
      })
    })
  }) // CREATION

  /**
  *  EDIT
  */
  describe('Edit', () => {

    it('should not edit without token', (done) => {
      return chai.request(app)
      .patch('/api/admin/round')
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })

    it('should return error if no round id provided', (done) => {
      return chai.request(app)
      .patch('/api/admin/round')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })

    it('should not edit/duplicate a unique field', (done) => {
      const host = 'My Torunament Host'
      return chai.request(app)
      .patch(`/api/admin/round/${roundToEditId}`)
      .set('Authorization', userAuthToken)
      .send({ label: 'A' })
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body).toExist()
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })

    it('should edit a round', (done) => {
      const host = 'My Torunament Host'
      return chai.request(app)
      .patch(`/api/admin/round/${roundToEditId}`)
      .set('Authorization', userAuthToken)
      .send({ host })
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body).toExist()
        expect(res.body.success).toBe(true)
        expect(res.body.round.host).toEqual(host)
        done()
      })
    })
    it('should upload the host photo', function (done) {
      this.timeout(5000)
      let mediaFile = path.join( __dirname, './media/test.jpeg' )
      return chai.request(app)
      .post(`/api/admin/round/${roundToEditId}/photo`)
      .set('Authorization', userAuthToken)
      .attach('roundHostPhoto', fs.readFileSync(mediaFile), 'test.jpeg')
      .end((err, res) => {
        expect(res.body.round.media).toExist()
        mediaId = res.body.round.media._id
        done()
      })
    })
  }) //  EDIT

  /**
  *  GET
  */
  describe('Get', () => {
    it('should not GET without token', (done) => {
      return chai.request(app)
      .get('/api/admin/rounds')
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should GET', (done) => {
      return chai.request(app)
      .get('/api/admin/rounds')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.success).toBe(true)
        expect(res.body.rounds).toExist()
        expect(res.body.rounds).toBeAn('array')
        done()
      })
    })
  }) // GET

  /**
  *  GET by Season
  */
  describe('Get by season', () => {
    it('should not GET without token', (done) => {
      return chai.request(app)
      .get(`/api/admin/rounds/${seasonId}`)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should GET for season provided', (done) => {
      return chai.request(app)
      .get(`/api/admin/rounds/${seasonId}`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.success).toBe(true)
        expect(res.body.rounds).toExist()
        expect(res.body.rounds).toBeAn('array')
        done()
      })
    })
    it('should GET empty if none for season or id is not of an existing season', (done) => {
      return chai.request(app)
      .get(`/api/admin/rounds/${roundToEditId}`) // >> fakeit
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.success).toBe(true)
        expect(res.body.rounds).toExist()
        expect(res.body.rounds.length).toBe(0)
        expect(res.body.rounds).toBeAn('array')
        done()
      })
    })
  }) // GET

  /**
   * DELETE ONLY IMAGE ROUTE
   */
  describe('Delete Round Media', () => {
    it('should NOT remove the round\'s media without auth token', (done) => {
      return chai.request(app)
      .delete(`/api/admin/round/${roundToEditId}/photo`)
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT remove return 404 if item not found', (done) => {
      return chai.request(app)
      .delete(`/api/admin/round/${seasonId}/photo`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(404)
        done()
      })
    })
    it('should remove the round\'s media', (done) => {
      return chai.request(app)
      .delete(`/api/admin/round/${roundToEditId}/photo`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        const { round } = res.body
        expect(res.status).toBe(200)
        expect(round).toExist()
        expect(round.media).toNotExist()
        done()
      })
    })
    it('should have updated the media field', (done) => {
      return Round.findById(roundToEditId)
      .then((round) => {
        expect(round.media).toNotExist()
        done()
      }).catch(done)
    })
    it('should NOT remove and return error if round has no media', (done) => {
      return chai.request(app)
      .delete(`/api/admin/round/${roundToEditId}/photo`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(404)
        done()
      })
    })
  })

  /**
  *  DELETE
  */
  describe('Delete', () => {
    it('should not delete without token', (done) => {
      return chai.request(app)
      .delete('/api/admin/round')
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should return error if no round id provided', (done) => {
      return chai.request(app)
      .delete('/api/admin/round')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('should delete', (done) => {
      return chai.request(app)
      .delete(`/api/admin/round/${roundToEditId}`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body).toExist()
        expect(res.body.success).toBe(true)
        done()
      })
    })
    it('should return error if not exist', (done) => {
      return chai.request(app)
      .delete(`/api/admin/round/${roundToEditId}`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(404)
        expect(res.body).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
  }) //  DELETE

  after((done) => {
    Promise.all([
      Season.remove({}),
      Round.remove({}),
    ]).then(done()).catch(done)
  })
})
