const { testenv } = global
const app = require(testenv.app)
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('expect')

describe('Round', () => {
  let roundToEditId
  describe('Creation', () => {
    /**
    *  CREATION
    *  fields:
    *   required: season(id), label(string)
    *   unique: label
    */
    it('shoud not create without auth token', (done) => {
      chai.request(app)
      .post('/api/admin/round')
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        done()
      })
    })
    it('shoud not create without season (id) attribute', (done) => {
      chai.request(app)
      .post('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        done()
      })
    })
    it('shoud not create without label attribute', (done) => {
      chai.request(app)
      .post('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
      .send({
        season: '13579a5s4d4as89d7a',
      })
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        done()
      })
    })
    it('shoud create a round', (done) => {
      chai.request(app)
      .post('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
      .send({
        season: testenv.seasonId,
        label: 'A',
      })
      .end((err, res) => {
        let { round } = res.body
        testenv.roundId = round._id
        expect(res).toExist()
        expect(res.status).toBe(200)
        expect(round).toExist()
        done()
      })
    })
    it('shoud not create a round with duplicate [label] attribute', (done) => {
      chai.request(app)
      .post('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
      .send({
        season: testenv.seasonId,
        label: 'A',
      })
      .end((err, res) => {
        let { round } = res.body
        expect(res).toExist()
        expect(res.status).toNotBe(200)
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('shoud create a round with another [label] attribute', (done) => {
      chai.request(app)
      .post('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
      .send({
        season: testenv.seasonId,
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

    it('shoud not edit without token', (done) => {
      chai.request(app)
      .patch('/api/admin/round')
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })

    it('shoud return error if no round id provided', (done) => {
      chai.request(app)
      .patch('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })

    it('shoud not edit/duplicate a unique field', (done) => {
      const host = 'My Torunament Host'
      chai.request(app)
      .patch('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
      .send({
        id: roundToEditId,
        label: 'A'
      })
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.body).toExist()
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })

    it('shoud edit a round', (done) => {
      const host = 'My Torunament Host'
      chai.request(app)
      .patch('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
      .send({
        id: roundToEditId,
        host,
      })
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body).toExist()
        expect(res.body.success).toBe(true)
        expect(res.body.round.host).toEqual(host)
        done()
      })
    })
  }) //  EDIT

  /**
  *  DELETE
  */
  describe('Delete', () => {
    it('shoud not delete without token', (done) => {
      chai.request(app)
      .delete('/api/admin/round')
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(res.status).toBe(400)
        expect(res.body.message).toExist()
        expect(res.body.success).toBe(false)
        done()
      })
    })
    it('shoud return error if no round id provided', (done) => {
      chai.request(app)
      .delete('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
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
      .delete('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
      .send({
        id: roundToEditId
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
      .delete('/api/admin/round')
      .set('Authorization', testenv.userAuthToken)
      .send({
        id: roundToEditId
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
      .get('/api/admin/rounds')
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
      .get('/api/admin/rounds')
      .set('Authorization', testenv.userAuthToken)
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
})
