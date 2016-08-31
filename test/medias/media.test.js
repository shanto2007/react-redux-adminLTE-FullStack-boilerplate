const app      = require(process.env.__server)
const Media    = require(process.env.__serverdir + 'models/media.model')
const fs       = require('fs')
const path     = require('path')
const chai     = require('chai')
const chaiHttp = require('chai-http')
const expect   = require('expect')

chai.use(chaiHttp)

describe('Media', () => {
  /**
   * MODEL
   */
  describe('Model', () => {
    let media_id
    before((done) => {
      new Media({
        filename: 'stocazz.js',
      }).save((err, item) => {
        if(err) throw err
        media_id = item._id
        done()
      })
    })
    it('shoud check if dummy media exist', (done) => {
      Media.findById( media_id, (err, media) => {
        if(err) throw err
        expect(media).toExist()
        expect(String(media._id)).toBe(String(media_id))
        done()
      })
    })

    after((done) => {
      Media.findById( media_id, (err, media) => {
        if(err) throw err
        media.remove(done)
      })
    })
  })

  /**
   * API
   */
  describe('API', () => {
    let media_id

    it('shoud NOT upload a media and create db record', (done) => {
      let media_file = path.join( __dirname, './media/test.jpeg' )
      chai.request(app)
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
      .set('Authorization', process.env.AUTH_TOKEN)
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
      .set('Authorization', process.env.AUTH_TOKEN)
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
      .set('Authorization', process.env.AUTH_TOKEN)
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
      .set('Authorization', process.env.AUTH_TOKEN)
      .end((err, res) => {
        expect(res).toExist()
        expect(res.status).toBe(200)
        done()
      })
    })
  })
})
