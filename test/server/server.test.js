var app = require(process.env.__server)
var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = require('expect')

chai.use(chaiHttp)

describe('Server', () => {
  it('shoud bootstrap testing suite', (done) => {
    chai
    .request(app)
    .get('/api')
    .end((err, res) => {
      expect(res).toExist()
      done()
    })
  })
  it('shoud return api root', (done) => {
    chai
    .request(app)
    .get('/api')
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      done()
    })
  })
})
