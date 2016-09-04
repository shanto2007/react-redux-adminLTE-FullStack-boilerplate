const { testenv } = global
const app      = require(testenv.app)
const Media    = require(testenv.serverdir + 'models/media.model')
const fs       = require('fs')
const path     = require('path')
const chai     = require('chai')
const chaiHttp = require('chai-http')
const expect   = require('expect')
const jwt = require('jsonwebtoken')

chai.use(chaiHttp)
/**
 * API
 */
describe.only('Media - API', () => {
  let media_id, userAuthToken

  // generate a auth dummy token
  before(() => {
    userAuthToken = jwt.sign({
      username: 'admin',
      admin: 'admin',
    }, process.env.APP_KEY )
  })

  it('shoud NOT upload a media and create db record', (done) => {
    let media_file = path.join( __dirname, './media/test.jpeg' )
    chai
      .request(app)
      .post('/api/media/upload')
      .attach('media', fs.readFileSync(media_file), 'test.jpeg')
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toBe(400)
        done()
      })
  })

  it('shoud upload a media and create db record', (done) => {
    let media_file = path.join( __dirname, './media/test.jpeg' )
    chai.request(app)
    .post('/api/media/upload')
    .set('Authorization', userAuthToken)
    .attach('media', fs.readFileSync(media_file), 'test.jpeg')
    .end((err, res) => {
      if (err) throw err
      let {body} = res
      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.media).toExist()
      media_id = String(res.body.media._id)
      done()
    })
  })

  it('shoud get single media', ( done ) => {
    chai.request(app)
    .get('/api/media/' + media_id )
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(200)
      let {body} = res
      expect( String(body.media._id) ).toEqual( String(media_id) )
      done()
    })
  })

  it('shoud NOT edit single element', ( done ) => {
    chai.request(app)
    .patch('/api/media/' + media_id)
    .send({
      filename: 'testChange.jpg'
    })
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(400)
      done()
    })
  })

  it('shoud edit single element', ( done ) => {
    chai.request(app)
    .patch('/api/media/' + media_id)
    .set('Authorization', userAuthToken)
    .send({
      filename: '123.jpg',
    })
    .end((err, res) => {
      if(err) throw err
      expect(res).toExist()
      expect(res.status).toBe(200)
      expect(res.body.media.filename).toBe('123.jpg')
      done()
    })
  })


  it('shoud NOT delete the single media', (done) => {
    chai.request(app)
    .delete('/api/media/' + media_id )
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(400)
      done()
    })
  })

  it('shoud delete the single media', (done) => {
    chai.request(app)
    .delete('/api/media/' + media_id )
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(200)
      done()
    })
  })
})
