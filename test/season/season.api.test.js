const { testenv, Promise } = global
const app         = require(testenv.app)
const Season      = require(testenv.serverdir + 'models/season.model')
const chai        = require('chai')
const chaiHttp    = require('chai-http')
const expect      = require('expect')
const jwt         = require('jsonwebtoken')

describe('Season - API', () => {
  let userAuthToken, seasonToEditId
  // generate a auth dummy token
  before(() => {
    userAuthToken = jwt.sign({
      username: 'admin',
      admin: 'admin',
    }, process.env.APP_KEY )
  })

  describe('Create', () => {
    /**
    *  CREATION
    *  field required|unique: year
    */
    it('shoud not create without auth token', (done) => {
      chai.request(app)
      .post('/api/admin/season')
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })
    it('shoud not create without year attribute', (done) => {
      chai.request(app)
      .post('/api/admin/season')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        done()
      })
    })
    it('shoud create unique year field 2016', (done) => {
      chai.request(app)
      .post('/api/admin/season')
      .set('Authorization', userAuthToken)
      .send({
        year: 2016,
      })
      .end((err, res) => {
        let { season } = res.body
        expect(res).toExist()
        expect(res.status).toBe(200)
        expect(season).toExist()
        done()
      })
    })
    it('shoud create unique year field 2017', (done) => {
      chai.request(app)
      .post('/api/admin/season')
      .set('Authorization', userAuthToken)
      .send({
        year: 2017,
      })
      .end((err, res) => {
        let { season } = res.body
        expect(res).toExist()
        expect(res.status).toBe(200)
        expect(season).toExist()
        seasonToEditId = season._id
        done()
      })
    })
    it('shoud not create with existing unique year field', (done) => {
      chai.request(app)
      .post('/api/admin/season')
      .set('Authorization', userAuthToken)
      .send({
        year: 2016,
      })
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        done()
      })
    })
  }) // CREATION

  /**
  *  EDIT
  *  field required|unique: year
  */
  describe('Edit', () => {
    it('shoud not edit without token', (done) => {
      chai.request(app)
      .patch('/api/admin/season')
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('shoud return error if no season id provided', (done) => {
      chai.request(app)
      .patch('/api/admin/season')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('shoud edit', (done) => {
      chai.request(app)
      .patch('/api/admin/season')
      .set('Authorization', userAuthToken)
      .send({
        id: seasonToEditId,
        year: 2020,
      })
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body).toExist()
        expect(res.body.success).toBe(true)
        expect(res.body.season.year).toBe(2020)
        done()
      })
    })
    it('shoud not edit unique field', (done) => {
      chai.request(app)
      .patch('/api/admin/season')
      .set('Authorization', userAuthToken)
      .send({
        id: seasonToEditId,
        year: 2016,
      })
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.body.success).toBe(false)
        done()
      })
    })
  }) //  EDIT

  /**
  *  EDIT
  */
  describe('Delete', () => {
    it('shoud not delete without token', (done) => {
      chai.request(app)
      .delete('/api/admin/season')
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('shoud return error if no season id provided', (done) => {
      chai.request(app)
      .delete('/api/admin/season')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('shoud delete', (done) => {
      chai.request(app)
      .delete('/api/admin/season')
      .set('Authorization', userAuthToken)
      .send({
        id: seasonToEditId
      })
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body).toExist()
        expect(res.body.success).toBe(true)
        done()
      })
    })
    it('shoud return error if not exist', (done) => {
      chai.request(app)
      .delete('/api/admin/season')
      .set('Authorization', userAuthToken)
      .send({
        id: seasonToEditId
      })
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(404)
        expect(res.body).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
  }) //  DELETE

  /**
  *  GET
  */
  describe('Get', () => {
    it('shoud not GET without token', (done) => {
      chai.request(app)
      .get('/api/admin/seasons')
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('shoud GET', (done) => {
      chai.request(app)
      .get('/api/admin/seasons')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.success).toBe(true)
        expect(res.body.seasons).toExist()
        expect(res.body.seasons).toBeAn('array')
        done()
      })
    })
  }) // GET

  after((done) => {
    Promise.resolve(
      Season.remove({})
    ).then(done()).catch(done)
  })
})
