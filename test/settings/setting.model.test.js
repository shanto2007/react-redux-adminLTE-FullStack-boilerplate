const { testenv } = global
const app = require(testenv.app)
const Setting = require(testenv.serverdir + 'models/setting.model')
const chai = require('chai')
const expect = require('expect')

describe('Setting - MODEL', () => {

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

  after((done) => {
    Promise
      .resolve(Setting.remove({}))
      .then(done())
      .catch(done)
  })
})
