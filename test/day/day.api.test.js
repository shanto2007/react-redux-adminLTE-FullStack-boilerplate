const { testenv, Promise } = global
const app         = require(testenv.app)
const chai        = require('chai')
const chaiHttp    = require('chai-http')
const expect      = require('expect')
const Season      = require(testenv.serverdir + 'models/season.model')
const Round       = require(testenv.serverdir + 'models/round.model')
const Day       = require(testenv.serverdir + 'models/day.model')
const jwt         = require('jsonwebtoken')

describe('Day - API', () => {
  let userAuthToken, seasonId, roundId, dayId, anotherDayId

  before((done) => {
    userAuthToken = jwt.sign({
      username: 'admin',
      admin: 'admin',
    }, process.env.APP_KEY )

    Promise.resolve(Season.create({
      year: 2016,
    })).then((season) => {
      seasonId = season._id
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

  it('should NOT create a day without auth token', (done) => {
    chai.request(app)
    .post('/api/admin/day')
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toNotBe(200)
      expect(res.status).toBe(400)
      done()
    })
  })

  it('should NOT create a day without season id', (done) => {
    chai.request(app)
    .post('/api/admin/day')
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(400)
      done()
    })
  })

  it('should NOT create a day without round id', (done) => {
    chai.request(app)
    .post('/api/admin/day')
    .set('Authorization', userAuthToken)
    .send({
      season: seasonId,
    })
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(400)
      done()
    })
  })

  it('should NOT create a day and return error with invalid ids', (done) => {
    chai.request(app)
    .post('/api/admin/day')
    .set('Authorization', userAuthToken)
    .send({
      season: 'seasonId',
      round: 'roundId',
    })
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(500)
      expect(res.body.message.errors.round).toExist()
      expect(res.body.message.errors.season).toExist()
      done()
    })
  })

  it('should create a day', (done) => {
    chai.request(app)
    .post('/api/admin/day')
    .set('Authorization', userAuthToken)
    .send({
      season: seasonId,
      round: roundId,
    })
    .end((err, res) => {
      expect(err).toNotExist()
      expect(res.status).toBe(200)
      expect(res.body.day).toExist()
      dayId = res.body.day._id
      done()
    })
  })

  it('shoud create a bunch of days just for the next test', (done) => {
    let item = {
      season: seasonId,
      round: roundId,
    }
    Day.insertMany([item, item, item, item]).then((res) => {
      anotherDayId = res[3]._id
      expect(res).toExist()
      expect(res.length).toBe(4)
      done()
    }).catch(done)
  })

  it('should set the new last day for that round', (done) => {
    chai.request(app)
    .patch('/api/admin/day/setlastday')
    .set('Authorization', userAuthToken)
    .send({
      id: dayId,
    })
    .end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.day.lastday).toBe(true)
      expect(res.body.day._id).toEqual(dayId)
      done()
    })
  })

  it('should NOT set lastday with invalid id', (done) => {
    chai.request(app)
    .patch('/api/admin/day/setlastday')
    .set('Authorization', userAuthToken)
    .send({
      id: 'dayId',
    })
    .end((err, res) => {
      expect(res.status).toNotBe(200)
      expect(res.body.success).toBe(false)
      done()
    })
  })

  it('shoud set another day as last day of the round', (done) => {
    chai.request(app)
    .patch('/api/admin/day/setlastday')
    .set('Authorization', userAuthToken)
    .send({
      id: anotherDayId,
    })
    .end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.day.lastday).toBe(true)
      expect(res.body.day._id).toEqual(anotherDayId)
      done()
    })
  })

  it('shoud have kept only 1 lastday per round', (done) => {
    Day.find({ lastday: true }, (err, day) => {
      if (err) done(err)
      expect(day).toExist()
      expect(day.length).toBe(1)
      expect(day[0]._id).toEqual(anotherDayId)
      done()
    })
  })

  it('should get public day index', (done) => {
    chai.request(app)
    .get('/api/days')
    .end((err, res) => {
      const { body } = res
      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.days).toBeA('array')
      expect(body.days.length).toNotBe(0)
      done()
    })
  })

  it('should get public day index passing round id', (done) => {
    chai.request(app)
    .get(`/api/days/${roundId}`)
    .end((err, res) => {
      const { body } = res
      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.days).toBeA('array')
      expect(body.days.length).toNotBe(0)
      done()
    })
  })

  it('should return error if round id is invalid', (done) => {
    chai.request(app)
    .get(`/api/days/roundId`)
    .end((err, res) => {
      const { body } = res
      expect(err).toExist()
      expect(res.status).toNotBe(200)
      expect(body.success).toBe(false)
      expect(body.message).toExist()
      done()
    })
  })

  it('should NOT get admin day index without auth token', (done) => {
    chai.request(app)
    .get('/api/admin/days')
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toNotBe(200)
      done()
    })
  })

  it('should get admin day index', (done) => {
    chai.request(app)
    .get('/api/admin/days')
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      const { body } = res
      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.days).toBeA('array')
      expect(body.days.length).toNotBe(0)
      done()
    })
  })

  it('should NOT get a single day without auth token - admin route', (done) => {
    chai.request(app)
    .get('/api/admin/day')
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(400)
      done()
    })
  })

  it('should NOT get a single day without a valid id - admin route', (done) => {
    chai.request(app)
    .get('/api/admin/day/FAKEID')
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(500)
      done()
    })
  })

  it('should get a single day by route param id - admin route', (done) => {
    chai.request(app)
    .get('/api/admin/day/' + dayId )
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.body.day).toExist()
      expect(res.body.day._id).toEqual(dayId)
      done()
    })
  })

  it('should get a single day id passed by json - admin route', (done) => {
    chai.request(app)
    .get('/api/admin/day')
    .set('Authorization', userAuthToken)
    .send({
      id: dayId,
    })
    .end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.body.day).toExist()
      expect(res.body.day._id).toEqual(dayId)
      done()
    })
  })

  it('should NOT get a single day without a valid id', (done) => {
    chai.request(app)
    .get('/api/day/FAKEID')
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(500)
      done()
    })
  })

  it('should get a single day, passing id by json', (done) => {
    chai.request(app)
    .get('/api/day')
    .send({
      id: dayId,
    })
    .end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.body.day).toExist()
      expect(res.body.day._id).toEqual(dayId)
      done()
    })
  })

  it('should get a single day, passing id by param', (done) => {
    chai.request(app)
    .get('/api/day/' + dayId)
    .end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.body.day).toExist()
      expect(res.body.day._id).toEqual(dayId)
      done()
    })
  })

  it('should NOT delete a day without auth token', (done) => {
    chai.request(app)
    .delete('/api/admin/day/')
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(400)
      expect(res.body.message).toExist()
      done()
    })
  })

  it('should NOT delete a day without a proper id', (done) => {
    chai.request(app)
    .delete('/api/admin/day/MYFAKEID')
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(500)
      done()
    })
  })

  it('should delete a day passing id by form-data', (done) => {
    chai.request(app)
    .delete('/api/admin/day/')
    .send({
      id: dayId,
    })
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      done()
    })
  })

  it('should delete a day passing id by params', (done) => {
    chai.request(app)
    .delete(`/api/admin/day/${anotherDayId}`)
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      done()
    })
  })


  after((done) => {
    Promise.all([
      Season.remove({}),
      Round.remove({}),
      Day.remove({}),
    ]).then(done()).catch(done)
  })

})
