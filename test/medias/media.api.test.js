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
  let mediaId, userAuthToken, storedMediaPath, preUploadMediaStat

  // generate a auth dummy token
  before(() => {
    userAuthToken = jwt.sign({
      username: 'admin',
      admin: 'admin',
    }, process.env.APP_KEY )
  })

  it('shoud NOT upload a media without an authToken', (done) => {
    let mediaFile = path.join( __dirname, './media/test.jpeg' )
    fs.stat(mediaFile, (err, stat) => {
      preUploadMediaStat = stat
    })
    chai
      .request(app)
      .post('/api/media/upload')
      .attach('media', fs.readFileSync(mediaFile), 'test.jpeg')
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toBe(400)
        done()
      })
  })

  it('shoud upload a media', (done) => {
    let mediaFile = path.join( __dirname, './media/test.jpeg' )
    chai.request(app)
    .post('/api/media/upload')
    .set('Authorization', userAuthToken)
    .attach('media', fs.readFileSync(mediaFile), 'test.jpeg')
    .end((err, res) => {
      if (err) throw err
      let {body} = res
      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.media).toExist()
      mediaId = String(res.body.media._id)
      storedMediaPath = body.media.path
      done()
    })
  })

  it('shoud check that file has been stored', (done) => {
    const filePath = path.join(testenv.rootdir, storedMediaPath)
    fs.stat(filePath, (err, stat) => {
      console.log(stat);
      expect(stat).toExist()
      expect(stat.size).toEqual(preUploadMediaStat.size)
      done()
    })
  })

  it('shoud get single media', ( done ) => {
    chai.request(app)
    .get('/api/media/' + mediaId )
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(200)
      let {body} = res
      expect( String(body.media._id) ).toEqual( String(mediaId) )
      done()
    })
  })

  it('shoud NOT edit single element without auth token', ( done ) => {
    chai.request(app)
    .patch('/api/media/' + mediaId)
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
    .patch('/api/media/' + mediaId)
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


  it('shoud NOT delete the single media without authToken', (done) => {
    chai.request(app)
    .delete('/api/media/' + mediaId )
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(400)
      done()
    })
  })

  it('shoud delete the single media', (done) => {
    chai.request(app)
    .delete('/api/media/' + mediaId )
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(200)
      done()
    })
  })

  after((done) => {
    Media.remove({}).then(done()).catch(done)
  })
})
