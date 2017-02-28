const { testenv } = global
const app      = require(testenv.app)
const Setting  = require(testenv.serverdir + 'models/setting.model')
const User     = require(testenv.serverdir + 'models/user.model')
const chai     = require('chai')
const chaiHttp = require('chai-http')
const expect   = require('expect')
const jwt      = require('jsonwebtoken')

chai.use(chaiHttp)

describe('Setting - API', () => {
  let userAuthToken

  before((done) => {
    User.create({
      admin: true,
      username: 'admin',
      password: 'admin',
      email: 'test@example.com',
    })
    .then((user) => {
      userAuthToken = jwt.sign(user.toJSON(), process.env.APP_KEY)
      done()
    })
    .catch((err) => {
      done(err)
    })
  })

  it('should create the setting', (done) => {
    chai
    .request(app)
    .patch('/api/setting')
    .set('Authorization', userAuthToken)
    .send({
      sitename: 'TestEdit',
      mailContact: 'test@myedit.com',
      joinAllowed: true,
    })
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      done()
    })
  })

  it('should edit the setting', (done) => {
    chai
    .request(app)
    .patch('/api/setting')
    .set('Authorization', userAuthToken)
    .send({
      sitename: 'TestEdit',
      mailContact: 'test@myedit.com',
      joinAllowed: true,
    })
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      Setting.count({}, (err, count) => {
        expect(count).toBe(1)
      })
      done()
    })
  })


  it('should get setting', (done) => {
    chai
      .request(app)
      .get('/api/setting')
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        done()
      })
  })


  after((done) => {
    return Promise.all([
      Setting.remove({}),
      User.remove({}),
    ]).then(done()).catch(done)
  })
})
