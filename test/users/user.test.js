const { testenv } = global
const app = require(testenv.app)
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('expect')
const User = require(testenv.serverdir + 'models/user.model')

chai.use(chaiHttp)

describe('User', () => {
  var admin_token, user_token
  var normal_user = {
    username: 'Simone' + Date.now(),
    password: 'password'
  }
  var admin_user = {
    username: 'ADMIN' + Date.now(),
    password: 'password',
    admin: true,
  }

  after(() => {
    testenv.adminAuthToken = admin_token
    testenv.userAuthToken = user_token
  })

  /**
   * USER CREATION
   */
  describe('Create', () => {
    it('shoud create admin user', (done) => {
      chai.request(app)
      .post('/api/user')
      .send(admin_user)
      .end((err, res) => {
        if(err) throw err
        let { body } = res
        admin_token = body.token
        expect(res.status).toBe(200)
        expect(body.success).toBe(true)
        expect(body.token).toExist()
        done()
      })
    })
    it('shoud create a normal user', (done) => {
      chai.request(app)
      .post('/api/user')
      .send(normal_user)
      .end((err, res) => {
        if(err) throw err
        let { body } = res
        expect(res.status).toBe(200)
        expect(body.success).toBe(true)
        expect(body.token).toExist()
        done()
      })
    })
    it('shoud return error if username exist', (done) => {
      chai.request(app)
      .post('/api/user')
      .send(normal_user)
      .end((err, res) => {
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('shoud return error if password not provided', (done) => {
      chai.request(app)
      .post('/api/user')
      .send({ username: 'TEST' })
      .end((err, res) => {
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('shoud given an username check if exists', (done) => {
      chai.request(app)
      .get(`/api/user/${normal_user.username}/exist`)
      .end((err,res) => {
        expect(res.status).toBe(409)
        expect(res.body.success).toBe(true)
        expect(res.body.exist).toBe(true)
        done()
      })
    })
  })



  describe('Authentication', () => {
    it('shoud return auth error if password wrong', (done) => {
      wrongUser = Object.assign({}, normal_user)
      wrongUser.password = 'SomeRandomWrongPass'
      chai.request(app)
      .post('/api/user/auth')
      .send(wrongUser)
      .end((err, res) => {
        expect(res.status).toNotBe(200)
        expect(err).toExist()
        expect(res.body.message).toExist()
        done()
      })
    })
    it('shoud authenticate user', (done) => {
      chai.request(app)
      .post('/api/user/auth')
      .send(normal_user)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(200)
        expect(res.body.token).toExist()
        user_token = res.body.token
        done()
      })
    })
  })

  describe('Restricted Routes', () => {
    it('shoud fetch personal data', (done) => {
      chai.request(app)
      .get('/api/me')
      .set('Authorization', user_token)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        done()
      })
    })
    it('shoud get admin only route', (done) => {
      chai.request(app)
      .get('/api/users')
      .set('Authorization', admin_token)
      .end((err, res) => {
        if(err) throw err
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        done()
      })
    })
  })

  describe('Delete users', () => {
    it('should let user delete its own account', (done) => {
      chai.request(app)
      .delete('/api/me')
      .set('Authorization', user_token)
      .end((err, res) => {
        if(err) throw err
        expect(res.body.success).toBe(true)
        done()
      })
    })
  })

})
