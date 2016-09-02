const { testenv } = global
const app = require(testenv.app)
const Setting = require(testenv.serverdir + 'models/setting.model')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('expect')

chai.use(chaiHttp)

describe('Setting', () => {
  describe('Model', () => {
    it('shoud create the setting', (done) => {
      var setting = new Setting({
        sitename: 'TestSite',
        mailContact: 'test@mymail.com',
        joinAllowed: false,
      })
      setting.save((err, s) => {
        if (err) throw err
        expect(s).toExist()
        expect(s.joinAllowed).toBe(false)
        expect(s.sitename).toBe('TestSite')
        expect(s.mailContact).toBe('test@mymail.com')
        done()
      })
    })
    it('shoud remove it', (done) => {
      Setting.findOne({}, (err, doc) => {
        if (err) throw err
        if (doc) doc.remove(done)
      })
    })
  })

  describe('API', () => {
    it('shoud get setting', (done) => {
      chai
        .request(app)
        .get('/api/setting')
        .set('Authorization', testenv.userAuthToken)
        .end((err, res) => {
          expect(res).toExist()
          expect(res.status).toBe(200)
          expect(res.body.success).toBe(true)
          done()
        })
    })
    it('shoud edit the setting', (done) => {
      chai
        .request(app)
        .patch('/api/setting')
        .set('Authorization', testenv.userAuthToken)
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
  })
  after((done) => {
    Setting.find({}, (err, settings) => {
      settings.forEach((setting) => {
        setting.remove()
      })
      done()
    })
  })
})
