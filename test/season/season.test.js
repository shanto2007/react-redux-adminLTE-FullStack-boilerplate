var app = require(process.env.__server)
var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = require('expect')

describe('Season ADMIN', () => {
  let admin_token, user_token, season_id

  before(() => {
    admin_token = process.env.admin_token
    user_token = process.env.user_token
    console.log(global.testUtils);
  })

  /**
   *  CREATION
   *  field required|unique: year
   */
  it('shoud not create without year attribute', (done) => {
    chai.request(app)
    .post('/api/admin/season')
    .set('Authorization', user_token)
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toNotBe(200)
      done()
    })
  })
  it('shoud create unique year field 2016', (done) => {
    chai.request(app)
    .post('/api/admin/season')
    .set('Authorization', user_token)
    .send({
      year: 2016,
    })
    .end((err, res) => {
      let { season } = res.body
      expect(res).toExist()
      expect(res.status).toBe(200)
      expect(season).toExist()
      season_id = season._id
      done()
    })
  })
  it('shoud create unique year field 2017', (done) => {
    chai.request(app)
    .post('/api/admin/season')
    .set('Authorization', user_token)
    .send({
      year: 2017,
    })
    .end((err, res) => {
      let { season } = res.body
      expect(res).toExist()
      expect(res.status).toBe(200)
      expect(season).toExist()
      done()
    })
  })
  it('shoud not create with existing unique year field', (done) => {
    chai.request(app)
    .post('/api/admin/season')
    .set('Authorization', user_token)
    .send({
      year: 2016,
    })
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toNotBe(200)
      done()
    })
  })

})
