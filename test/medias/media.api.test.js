const { testenv } = global
const app         = require(testenv.app)
const Media       = require(testenv.serverdir + 'models/media.model')
const fs          = require('fs')
const path        = require('path')
const chai        = require('chai')
const chaiHttp    = require('chai-http')
const expect      = require('expect')
const jwt         = require('jsonwebtoken')

chai.use(chaiHttp)
/**
 * API
 */
describe('Media - API', () => {
  let mediaId, userAuthToken, storedMediaPath, storedThumbPath, preUploadMediaStat, mediaWithMetaId

  // generate a auth dummy token
  before(() => {
    userAuthToken = jwt.sign({
      username: 'admin',
      admin: 'admin',
    }, process.env.APP_KEY )
  })

  it('should NOT upload a media without an authToken', (done) => {
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

  it('should NOT upload, return error if file not provided', (done) => {
    let mediaFile = path.join( __dirname, './media/test.jpeg' )
    chai.request(app)
    .post('/api/media/upload')
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(400)
      done()
    })
  })

  it('should upload a media', (done) => {
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
      expect(body.media.thumbnail).toExist()
      expect(body.media.path).toExist()
      mediaId = String(res.body.media._id)
      storedMediaPath = body.media.path
      storedThumbPath = body.media.thumbnail
      done()
    })
  })

  it('should check that file has been stored', (done) => {
    const filePath = path.join(testenv.rootdir, storedMediaPath)
    fs.stat(filePath, (err, stat) => {
      expect(stat).toExist()
      expect(stat.size).toEqual(preUploadMediaStat.size)
      done()
    })
  })

  it('should upload a media with metadata', (done) => {
    let mediaFile = path.join( __dirname, './media/test.jpeg' )
    chai.request(app)
    .post('/api/media/upload')
    .set('Authorization', userAuthToken)
    .field('type', 'MyCustomType')
    .field('metadata', JSON.stringify({ title: 'MyCustomTitle' }))
    .attach('media', fs.readFileSync(mediaFile), 'test.jpeg')
    .end((err, res) => {
      if (err) throw err
      let {body} = res
      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.media).toExist()
      expect(body.media.metadata).toExist()
      mediaWithMetaId = body.media._id
      let metadata
      try {
        metadata = JSON.parse(body.media.metadata)
      } catch (e) {
        done(e)
      } finally {
        expect(metadata).toBeA('object')
      }
      done()
    })
  })

  it('should EDIT a media metadata', (done) => {
    let mediaFile = path.join( __dirname, './media/test.jpeg' )
    chai.request(app)
    .patch(`/api/media/${mediaWithMetaId}/metadata`)
    .set('Authorization', userAuthToken)
    .send({
      metadata: {
        myNewMetadata: 'myNewMetadata',
      }
    })
    .end((err, res) => {
      if (err) throw err
      let {body} = res
      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.media).toExist()
      expect(body.media.metadata).toExist()
      let metadata
      try {
        metadata = JSON.parse(body.media.metadata)
      } catch (e) {
        done(e)
      } finally {
        expect(metadata).toBeA('object')
        expect(metadata.myNewMetadata).toExist()
      }
      done()
    })
  })

  it('should check that thumbnail has been generated', (done) => {
    const filePath = path.join(testenv.rootdir, storedThumbPath)
    fs.stat(filePath, (err, stat) => {
      expect(stat).toExist()
      done()
    })
  })

  it('should GET single media', (done) => {
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

  it('should NOT GET single media', (done) => {
    chai.request(app)
    .get('/api/media/' + "mediaId" )
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toNotBe(200)
      done()
    })
  })

  it('should GET media index', (done) => {
    chai.request(app)
    .get('/api/medias')
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      let { body } = res
      expect(res).toExist()
      expect(res.status).toBe(200)
      expect(body.medias).toExist()
      expect(body.medias).toBeA('array')
      done()
    })
  })


  it('should NOT delete the single media without authToken', (done) => {
    chai.request(app)
    .delete('/api/media/' + mediaId )
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(400)
      done()
    })
  })

  it('should delete the single media', (done) => {
    chai.request(app)
    .delete('/api/media/' + mediaId )
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(200)
      done()
    })
  })

  it('should return error on delete of not existing media', (done) => {
    chai.request(app)
    .delete('/api/media/' + mediaId )
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(404)
      done()
    })
  })

  it('should return 404 on GET single deleted media', (done) => {
    chai.request(app)
    .get('/api/media/' + mediaId )
    .set('Authorization', userAuthToken)
    .end((err, res) => {
      expect(err).toExist()
      expect(res.status).toBe(404)
      done()
    })
  })

  it('should check that file has been unlinked file after remove', (done) => {
    const filePath = path.join(testenv.rootdir, storedMediaPath)
    fs.stat(filePath, (err, stat) => {
      expect(stat).toNotExist()
      done()
    })
  })

  it('should check that file has been unlinked the thumbnail after remove', (done) => {
    const filePath = path.join(testenv.rootdir, storedThumbPath)
    fs.stat(filePath, (err, stat) => {
      expect(stat).toNotExist()
      done()
    })
  })

  after((done) => {
    Media.remove({}).then(done()).catch(done)
  })
})
