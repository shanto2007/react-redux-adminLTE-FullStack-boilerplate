const { testenv } = global
const app = require(testenv.app)
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('expect')

chai.use(chaiHttp)

describe('Email', () => {
  it('should send an email', (done) => {
    chai.request(app)
    .post('/api/email')
    .send({
      from: 'Simone <test@example.com>',
      subject: 'test',
      message: 'Test Message ayo!'
    })
    .end((err, res) => {
      if (err) throw err
      expect(res.body).toExist()
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      done();
    })
  })
})
